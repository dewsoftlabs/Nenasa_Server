const loanModel = require("./loanModel");
const CustomerModel = require("../customer/CustomerModel");
const customerModel = require("../customer/CustomerModel");
const depositAccModel = require("../deposit_acc/depositAccModel");
const GuarantorModel = require("../guarantor/GuarantorModel");

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
  const { loan, customer, deposit, guarantor } = req.body;

  console.log(loan);
  console.log(customer);
  console.log('deposit' ,deposit);
  console.log(guarantor);

  // Function to handle errors and send responses
  const handleError = (statusCode, errorMessage) => {
    res.status(statusCode).send({ error: errorMessage });
  };

  // Function to create a new customer if not found
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

  // Function to create a new deposit account
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

  // Function to create a new loan
  const createNewLoan = (customer_id, deposit_acc_no, guarantor_id) => {
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

  //model
  console.log(customer.customer_nic)
  CustomerModel.getCustomerBynic(customer.customer_nic, (error, customerResults) => {
    if (error) {
      return handleError(500, "Error fetching data from the database customer_nic");
    }

    if (customerResults.length === 0) {
      createNewCustomer(customer, (customer_id) => {
        createDepositAccount(customer_id, deposit, (deposit_acc_no) => {
          GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
            if (error) {
              return handleError(500, "Error fetching data from the database guarantor_nic");
            }

            if (guarantorResults.length === 0) {
              createNewGuarantor(guarantor, (guarantor_id) => {
                checkAndCreateLoan(customer_id, deposit_acc_no, guarantor_id);
              });
            } else {
              checkAndCreateLoan(customer_id, deposit_acc_no, guarantorResults[0].guarantor_id);
            }
          });
        });
      });
    } else {
      const customerId = customerResults[0].customer_id;
      depositAccModel.getdepositAccBycustId(customerId, (error, depositresults) => {
        if (error) {
          return handleError(500, "Error fetching data from the database");
        }

        if (depositresults.length === 0) {
          return handleError(409, "This customer does not have a Deposit Account");
        }

        const depositId = depositresults[0].deposit_acc_no;

        GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {
          if (error) {
            return handleError(500, "Error fetching data from the database");
          }

          if (guarantorResults.length === 0) {
            createNewGuarantor(guarantor, (guarantor_id) => {
              checkAndCreateLoan(customerId, depositId, guarantor_id);
            });
          } else {
            checkAndCreateLoan(customerId, depositId, guarantorResults[0].guarantor_id);
          }
        });
      });
    }
  });

  // Function to check and create a loan
  const checkAndCreateLoan = (customer_id, deposit_acc_no, guarantor_id) => {
    loanModel.getloanBybusinessName(loan.business_name, (error, results) => {
      if (error) {
        return handleError(500, "Error fetching data from the database checkAndCreateLoan");
      }

      if (results.length > 0) {
        return handleError(409, "This Business Name already has a Loan");
      }

      createNewLoan(customer_id, deposit_acc_no, guarantor_id);
    });
  };
};


module.exports = {
  addLoan,
  getAllLoans,
  getLoanById,
}