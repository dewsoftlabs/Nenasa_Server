const loanModel = require("./loanModel");
const CustomerModel = require("../customer/CustomerModel");
const customerModel = require("../customer/CustomerModel");
const depositAccModel = require("../deposit_acc/depositAccModel");
const GuarantorModel = require("../guarantor/GuarantorModel");
const CollectionModal = require("../collection/CollectionModal");
const InstallementModal = require("../installement/InstallementModal");
const async = require('async');

const getAllLoans = (req, res) => {
  loanModel.getAllLoans((error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    res.status(200).send(results);
  });
};

const getLoanById = (req, res) => {
  const { loan_id } = req.params;
  loanModel.getloanById(loan_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: "Loan details not found" });
      return;
    }

    res.status(200).send(results);
  });
};

const addLoan = (req, res) => {
  const { loan, customer, deposit, guarantor, collection } = req.body;

  // Function to handle errors and send responses
  const handleError = (statusCode, errorMessage) => {
    res.status(statusCode).send({ error: errorMessage });
  };

  // Function to handle rollback in case of failure
  const rollback = (customer_id, deposit_acc_no, guarantor_id, loan_id, collection_id, callback) => {
    async.parallel([
      (cb) => { InstallementModal.deleteInstallementsByCollectionId(collection_id, cb); },
      (cb) => { CollectionModal.deleteCollection(collection_id, cb); },
      (cb) => { loanModel.deleteLoan(loan_id, cb); },
      (cb) => { depositAccModel.deleteDepositAcc(deposit_acc_no, cb); },
      (cb) => { GuarantorModel.deleteGuarantor(guarantor_id, cb); },
      (cb) => { customerModel.deleteCustomer(customer_id, cb); }
    ], (error, results) => {
      if (error) {
        console.error("Rollback failed:", error);
      }
      callback();
    });
  };

  if (!loan || !customer || !guarantor || !collection) {
    return handleError(500, "Failed to find necessary details for loan creation");
  }

  const createNewCustomer = (customer, callback) => {
    customerModel.addCustomer(customer, (error, customer_id) => {
      if (error) {
        return handleError(500, "Error fetching data from the database customer");
      }

      if (!customer_id) {
        return handleError(500, "Failed to create customer");
      }

      callback(customer_id);
    });
  };

  const createNewGuarantor = (guarantor, callback) => {
    GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
      if (error) {
        return handleError(500, "Error fetching data from the database guarantor");
      }

      if (!guarantor_id) {
        return handleError(500, "Failed to create Guarantor");
      }

      callback(guarantor_id);
    });
  };

  const createDepositAccount = (customer_id, deposit, callback) => {
    depositAccModel.adddepositAcc(customer_id, deposit, (error, deposit_acc_no) => {
      if (error) {
        return handleError(500, "Error fetching data from the database deposit");
      }

      if (!deposit_acc_no) {
        return handleError(404, "Failed to create Deposit Account");
      }

      callback(deposit_acc_no);
    });
  };

  const createNewLoan = (customer_id, deposit_acc_no, guarantor_id, callback) => {
    loanModel.addLoan(customer_id, deposit_acc_no, guarantor_id, loan, (error, loan_id) => {
      if (error) {
        // Perform rollback on error
        rollback(customer_id, deposit_acc_no, guarantor_id, loan_id, 0, () => {
          handleError(500, "Error fetching data from the database deposit_acc_no");
        });
        return;
      }

      if (!loan_id) {
        // Perform rollback on failure to create loan
        rollback(customer_id, deposit_acc_no, guarantor_id, loan_id, 0, () => {
          handleError(404, "Failed to create Loan");
        });
        return;
      }

      callback(loan_id);
    });
  };

  const createNewCollection = (loan_id, branchid, userid, callback) => {
    CollectionModal.addCollection(loan_id, branchid, userid, (error, collection_id) => {
      if (error) {
        // Perform rollback on error
        rollback(0, 0, 0, 0, collection_id, () => {
          handleError(500, "Error fetching data from the database collection");
        });
        return;
      }

      if (!collection_id) {
        // Perform rollback on failure to create collection
        rollback(0, 0, 0, 0, collection_id, () => {
          handleError(404, "Failed to create Collection");
        });
        return;
      }

      callback(collection_id);
    });
  };

  const createInstallement = (loan_period, collection, collection_id, installments, userid, callback) => {
    if (loan_period == 1 || loan_period == 2 || loan_period == 3) {
      let successCount = 0;
      let failCount = 0;

      collection.forEach((value) => {
        const desc = (loan_period === 1) ? value : (loan_period === 2) ? value.startDate + ',' + value.endDate : value.startDate + ',' + value.endDate + '|' + value.monthAndYear;

        InstallementModal.addInstallement(collection_id, desc, installments, userid, (error, installement_id) => {
          if (error) {
            // Increment the fail count
            failCount++;
            // Perform rollback on error
            rollback(0, 0, 0, 0, collection_id, () => {
              handleError(500, "Error creating installment");
            });
          } else if (!installement_id) {
            // Increment the fail count
            failCount++;
            // Perform rollback on failure to create installment
            rollback(0, 0, 0, 0, collection_id, () => {
              handleError(500, "Failed to create Installment");
            });
          } else {
            // Increment the success count
            successCount++;
          }

          // Check if all iterations are completed
          if (successCount + failCount === collection.length) {
            // Call the callback with success and fail counts
            if (failCount > 0) {
              // Perform rollback on failure
              rollback(0, 0, 0, 0, collection_id, () => {
                callback({ successCount, failCount });
              });
            } else {
              callback({ successCount, failCount });
            }
          }
        });
      });
    }
  };

  CustomerModel.getCustomerBynic(customer.customer_nic, (error, customerResults) => {
    if (error) {
      return handleError(500, "Error fetching data from the database customer_nic");
    }

    if (customerResults.length === 0) {
      createNewCustomer(customer, (customer_id) => {
        if (!deposit.deposithas) {
          GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
            if (error) {
              return handleError(500, "Error fetching data from the database guarantor_nic");
            }

            if (guarantorResults.length === 0) {
              createNewGuarantor(guarantor, (guarantor_id) => {
                createNewLoan(customer_id, 0, guarantor_id, (loan_id) => {
                  createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                    createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                      res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                    });
                  });
                });
              });
            } else {
              createNewLoan(customer_id, 0, guarantorResults[0].guarantor_id, (loan_id) => {
                createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                  createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                    res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                  });
                });
              });
            }
          });
        } else {
          createDepositAccount(customer_id, deposit, (deposit_acc_no) => {
            GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
              if (error) {
                return handleError(500, "Error fetching data from the database guarantor_nic");
              }

              if (guarantorResults.length === 0) {
                createNewGuarantor(guarantor, (guarantor_id) => {
                  createNewLoan(customer_id, deposit_acc_no, guarantor_id, (loan_id) => {
                    createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                      createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                        res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                      });
                    });
                  });
                });
              } else {
                createNewLoan(customer_id, deposit_acc_no, guarantorResults[0].guarantor_id, (loan_id) => {
                  createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                    createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                      res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                    });
                  });
                });
              }
            });
          });
        }
      });
    } else {
      const customerId = customerResults[0].customer_id;
      depositAccModel.getdepositAccBycustId(customerId, (error, depositresults) => {
        if (error) {
          return handleError(500, "Error fetching data from the database");
        }

        if (depositresults.length > 0) {
          const depositId = depositresults[0].deposit_acc_no;

          GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
            if (error) {
              return handleError(500, "Error fetching data from the database");
            }

            if (guarantorResults.length === 0) {
              createNewGuarantor(guarantor, (guarantor_id) => {
                createNewLoan(customerId, depositId, guarantor_id, (loan_id) => {
                  createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                    createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                      res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                    });
                  });
                });
              });
            } else {
              createNewLoan(customerId, depositId, guarantorResults[0].guarantor_id, (loan_id) => {
                createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                  createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                    res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                  });
                });
              });
            }
          });
        } else {
          GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
            if (error) {
              return handleError(500, "Error fetching data from the database");
            }

            if (guarantorResults.length === 0) {
              createNewGuarantor(guarantor, (guarantor_id) => {
                createNewLoan(customerId, 0, guarantor_id, (loan_id) => {
                  createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                    createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                      res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                    });
                  });
                });
              });
            } else {
              createNewLoan(customerId, 0, guarantorResults[0].guarantor_id, (loan_id) => {
                createNewCollection(loan_id, customer.branchid, loan.userid, (collection_id) => {
                  createInstallement(loan.loan_period, collection, collection_id, loan.installments, loan.userid, (result) => {
                    res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, result });
                  });
                });
              });
            }
          });
        }
      });
    }
  });
};

const addContinueLoan = (req, res) => {
  const { loan, customer_id, guarantor } = req.body;

  // Function to handle errors and send responses
  const handleError = (statusCode, errorMessage) => {
    res.status(statusCode).send({ error: errorMessage });
  };

  if (!loan || !customer_id || !guarantor) {
    return handleError(500, "Failed to find necessary details for loan continuation");
  }

  // Function to create a new guarantor if not found
  const createNewGuarantor = (guarantor, callback) => {
    GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
      if (error) {
        return handleError(500, "Error fetching data from the database guarantor");
      }

      if (!guarantor_id) {
        return handleError(500, "Failed to create Guarantor");
      }

      callback(guarantor_id);
    });
  };

  // Function to create a new loan
  const createNewLoan = (customer_id, deposit_acc_no, guarantor_id, callback) => {
    loanModel.addLoan(customer_id, deposit_acc_no, guarantor_id, loan, (error, loan_id) => {
      if (error) {
        return handleError(500, "Error fetching data from the database deposit_acc_no");
      }

      if (!loan_id) {
        return handleError(404, "Failed to create Loan");
      }

      res.status(200).send({ message: "Loan created successfully", loan_id });
    });
  };

  CustomerModel.getCustomerByCustomer_id(customer_id, (error, customerResults) => {
    if (error) {
      return handleError(500, "Error fetching data from the database customer_nic");
    }

    if (customerResults.length === 0) {
      return handleError(409, "This customer does not found");
    }

    depositAccModel.getdepositAccBycustId(customer_id, (error, depositresults) => {
      if (error) {
        return handleError(500, "Error fetching data from the database");
      }

      if (depositresults.length === 0) {
        return handleError(409, "This customer does not have a Deposit Account");
      }

      const depositId = depositresults[0].deposit_acc_no;

      if (guarantor.guarantor_id && guarantor.guarantor_id !== "") {
        GuarantorModel.getGuarantorByGuarantor_id(guarantor.guarantor_id, (error, guarantorResults) => {
          if (error) {
            return handleError(500, "Error fetching data from the database");
          }

          if (guarantorResults.length === 0) {
            return handleError(409, "This Guarantor does not found. Please try again with correct data");
          }

          createNewLoan(customer_id, depositId, guarantor.guarantor_id, (loan_id) => {
            res.status(200).send({ message: "Loan created successfully", loan_id });
          });
        });
      } else {
        createNewGuarantor(guarantor, (guarantor_id) => {
          createNewLoan(customer_id, depositId, guarantor_id, (loan_id) => {
            res.status(200).send({ message: "Loan created successfully", loan_id });
          });
        });
      }
    });
  });
};

module.exports = {
  addLoan,
  getAllLoans,
  getLoanById,
  addContinueLoan
};
