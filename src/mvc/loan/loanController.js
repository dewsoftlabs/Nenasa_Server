const loanModel = require("./loanModel");
const CustomerModel = require("../customer/CustomerModel");
const depositAccModel = require("../deposit_acc/depositAccModel");
const GuarantorModel = require("../guarantor/GuarantorModel");
const CollectionModal = require("../collection/CollectionModal");
const InstallementModal = require("../installement/InstallementModal");
const async = require("async");

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
  const handleErrorAndRollback = (
    statusCode,
    errorMessage,
    customer_id,
    deposit_acc_no,
    guarantor_id,
    loan_id,
    collection_id
  ) => {
    console.error(errorMessage);
    rollback(customer_id, deposit_acc_no, guarantor_id, loan_id, collection_id);
    res.status(statusCode).send({ error: errorMessage });
  };

  if (!loan || !customer || !guarantor || !collection) {
    return handleErrorAndRollback(500, "Incomplete data provided", null, null, null, null, null);
  }

  // Function to delete customer and associated data
  const deleteCustomer = (customer_id, callback) => {
    CustomerModel.perma_deleteCustomer(customer_id, (error) => {
      callback(error);
    });
  };

  // Function to delete guarantor
  const deleteGuarantor = (guarantor_id, callback) => {
    GuarantorModel.perma_deleteGuarantor(guarantor_id, (error) => {
      callback(error);
    });
  };

  // Function to delete deposit account
  const deleteDepositAccount = (deposit_acc_no, callback) => {
    depositAccModel.perma_deletedepositAcc(deposit_acc_no, (error) => {
      callback(error);
    });
  };

  // Function to delete loan
  const deleteLoan = (loan_id, callback) => {
    loanModel.perma_deleteLoan(loan_id, (error) => {
      callback(error);
    });
  };

  // Function to delete collection
  const deleteCollection = (collection_id, callback) => {
    CollectionModal.perma_deleteCollection(collection_id, (error) => {
      callback(error);
    });
  };

  // Function to delete installments
  const deleteInstallments = (collection_id, callback) => {
    InstallementModal.perma_deleteInstallement(collection_id, (error) => {
      callback(error);
    });
  };

  // Function to perform rollback
  const rollback = (customer_id, deposit_acc_no, guarantor_id, loan_id, collection_id) => {
    const tasks = [];

    if (collection_id) {
      tasks.push((callback) => deleteInstallments(collection_id, callback));
      tasks.push((callback) => deleteCollection(collection_id, callback));
    }

    if (loan_id) {
      tasks.push((callback) => deleteLoan(loan_id, callback));
    }

    if (guarantor_id) {
      tasks.push((callback) => deleteGuarantor(guarantor_id, callback));
    }

    if (deposit_acc_no) {
      tasks.push((callback) => deleteDepositAccount(deposit_acc_no, callback));
    }

    if (customer_id) {
      tasks.push((callback) => deleteCustomer(customer_id, callback));
    }

    async.parallel(tasks, () => {
      console.log("Rollback completed");
    });
  };

  // Function to create a new customer
  const createNewCustomer = (callback) => {
    CustomerModel.addCustomer(customer, (error, customer_id) => {
      if (error) {
        return handleErrorAndRollback(500, "Error creating customer", null, null, null, null, null);
      }

      if (!customer_id) {
        return handleErrorAndRollback(500, "Failed to create customer", null, null, null, null, null);
      }

      callback(customer_id);
    });
  };

  // Function to create a new guarantor
  const createNewGuarantor = (callback) => {
    GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
      if (error) {
        return handleErrorAndRollback(500, "Error creating guarantor", null, null, null, null, null);
      }

      if (!guarantor_id) {
        return handleErrorAndRollback(500, "Failed to create Guarantor", null, null, null, null, null);
      }

      callback(guarantor_id);
    });
  };

  // Function to create a new deposit account
  const createDepositAccount = (customer_id, callback) => {
    depositAccModel.adddepositAcc(customer_id, deposit, (error, deposit_acc_no) => {
      if (error) {
        return handleErrorAndRollback(500, "Error creating deposit account", customer_id, null, null, null, null);
      }

      if (!deposit_acc_no) {
        return handleErrorAndRollback(500, "Failed to create Deposit Account", customer_id, null, null, null, null);
      }

      callback(deposit_acc_no);
    });
  };

  // Function to create a new loan
  const createNewLoan = (customer_id, deposit_acc_no, guarantor_id, callback) => {
    loanModel.addLoan(customer_id, deposit_acc_no, guarantor_id, loan, (error, loan_id) => {
      if (error) {
        return handleErrorAndRollback(500, "Error creating loan", customer_id, deposit_acc_no, guarantor_id, null, null);
      }

      if (!loan_id) {
        return handleErrorAndRollback(500, "Failed to create Loan", customer_id, deposit_acc_no, guarantor_id, null, null);
      }

      callback(loan_id);
    });
  };

  // Function to create a new collection
  const createNewCollection = (loan_id, callback) => {
    CollectionModal.addCollection(loan_id, loan.userid, (error, collection_id) => {
      if (error) {
        return handleErrorAndRollback(500, "Error creating collection", loan.customer_id, loan.deposit_acc_no, loan.guarantor_id, loan_id, null);
      }

      if (!collection_id) {
        return handleErrorAndRollback(500, "Failed to create Collection", loan.customer_id, loan.deposit_acc_no, loan.guarantor_id, loan_id, null);
      }

      callback(collection_id);
    });
  };

  // Function to create installments
  const createInstallments = (collection_id, callback) => {
    if (loan.loan_period === "day") {
      const tasks = [];

      collection.forEach((value) => {
        tasks.push((cb) => {
          InstallementModal.addInstallement(collection_id, value, loan.installments, loan.userid, (error, result) => {
            if (error) {
              return handleErrorAndRollback(500, "Error creating installment", loan.customer_id, loan.deposit_acc_no, loan.guarantor_id, loan.loan_id, collection_id);
            }

            if (!result) {
              return handleErrorAndRollback(500, "Failed to create Installment", loan.customer_id, loan.deposit_acc_no, loan.guarantor_id, loan.loan_id, collection_id);
            }

            cb(null, result);
          });
        });
      });

      async.parallel(tasks, (err, results) => {
        if (err) {
          return handleErrorAndRollback(500, "Error creating installments", loan.customer_id, loan.deposit_acc_no, loan.guarantor_id, loan.loan_id, collection_id);
        }

        callback(results);
      });
    } else {
      callback(null);
    }
  };

  createNewCustomer((customer_id) => {
    if (!deposit.deposithas) {
      createNewGuarantor((guarantor_id) => {
        createNewLoan(customer_id, null, guarantor_id, (loan_id) => {
          createNewCollection(loan_id, (collection_id) => {
            createInstallments(collection_id, (installments) => {
              res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, installments });
            });
          });
        });
      });
    } else {
      createDepositAccount(customer_id, (deposit_acc_no) => {
        createNewGuarantor((guarantor_id) => {
          createNewLoan(customer_id, deposit_acc_no, guarantor_id, (loan_id) => {
            createNewCollection(loan_id, (collection_id) => {
              createInstallments(collection_id, (installments) => {
                res.status(200).send({ message: "Loan created successfully", loan_id, collection_id, installments });
              });
            });
          });
        });
      });
    }
  });
};

module.exports = {
  addLoan,
  getAllLoans,
  getLoanById,
};
