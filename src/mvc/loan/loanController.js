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
    const { loan } = req.body;
    const { customer } = req.body;
    const { deposit } = req.body;
    const { guarantor } = req.body;

    CustomerModel.getCustomerBynic(customer.customer_nic, (error, customerResults) => {

        if (error) {
            res.status(500).send({ error: "Error fetching data from the database" });
            return;
          }

          if (customerResults.length === 0) { //customer not found

            customerModel.addCustomer(customer, (error, customer_id) => {
                if (error) {
                  return res.status(500).send({ error: "Error fetching data from the database" });
                }
            
                if (!customer_id) {
                  return res.status(500).send({ error: "Failed to create customer" });
                }
            
                depositAccModel.adddepositAcc(customer_id, deposit, (error, deposit_acc_no) => {
                  if (error) {
                    return res.status(500).send({ error: "Error fetching data from the database" });
                  }
            
                  if (!deposit_acc_no) {
                    return res.status(404).send({ error: "Failed to create Deposit Account" });
                  }
            
                  GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {

                    if (error) {
                        res.status(500).send({ error: "Error fetching data from the database" });
                        return;
                      }

                        if (guarantorResults.length === 0) { //guarantor not found
                      
                            GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
                                if (error) {
                                  return res.status(500).send({ error: "Error fetching data from the database" });
                                }
                        
                                if (!guarantor_id) {
                                  return res.status(500).send({ error: "Failed to create Guarantor" });
                                }
                        
                                loanModel.getloanBybusinessName(loan.business_name, (error, results) => {
                                  if (error) {
                                    return res.status(500).send({ error: "Error fetching data from the database" });
                                  }
                        
                                  if (results.length > 0) {
                                    return res.status(409).send({ error: "This Business Name already has a Loan" });
                                  }
                        
                                  loanModel.addLoan(customer_id, deposit_acc_no, guarantor_id, loan, (error, loan_id) => {
                                    if (error) {
                                      return res.status(500).send({ error: "Error fetching data from the database" });
                                    }
                        
                                    if (!loan_id) {
                                      return res.status(404).send({ error: "Failed to create Loan" });
                                    }
                        
                                    return res.status(200).send({ message: "Loan created successfully", loan_id });
                                  });
                                });
                              });
                    
                        }else{ //guarantor found
                            
                                const guarantorId = guarantorResults[0].guarantor_id;
                            
                                loanModel.getloanBybusinessName(loan.business_name, (error, results) => {

                                    if (error) {
                                      return res.status(500).send({ error: "Error fetching data from the database" });
                                    }
                          
                                    if (results.length > 0) {
                                      return res.status(409).send({ error: "This Business Name already has a Loan" });
                                    }
                          
                                    loanModel.addLoan(customer_id, deposit_acc_no, guarantorId , loan, (error, loan_id) => {
                                      if (error) {
                                        return res.status(500).send({ error: "Error fetching data from the database" });
                                      }
                          
                                      if (!loan_id) {
                                        return res.status(404).send({ error: "Failed to create Loan" });
                                      }
                          
                                      return res.status(200).send({ message: "Loan created successfully", loan_id });
                                    });
                                });                               
                        }
                });
                });
              });

          }else{ //customer found
                
            const customerId = customerResults[0].customer_id;
                    
            depositAccModel.getdepositAccBycustId(customerId, (error, depositresults) => {

                if (error) {
                  res.status(500).send({ error: "Error fetching data from the database" });
                  return;
                }

                if (depositresults.length === 0) {
                    res.status(409).send({ error: "This customer not having Deposit Account" });
                    return;
                  }
            
                const depositId = depositresults[0].deposit_acc_no;

                GuarantorModel.getGuarantorBynic(guarantor.guarantor_nic, (error, guarantorResults) => {

                    if (error) {
                        res.status(500).send({ error: "Error fetching data from the database" });
                        return;
                      }

                        if (guarantorResults.length === 0) { //guarantor not found
                      
                            GuarantorModel.addGuarantor(guarantor, (error, guarantor_id) => {
                                if (error) {
                                  return res.status(500).send({ error: "Error fetching data from the database" });
                                }
                        
                                if (!guarantor_id) {
                                  return res.status(500).send({ error: "Failed to create Guarantor" });
                                }
                        
                                loanModel.getloanBybusinessName(loan.business_name, (error, results) => {
                                  if (error) {
                                    return res.status(500).send({ error: "Error fetching data from the database" });
                                  }
                        
                                  if (results.length > 0) {
                                    return res.status(409).send({ error: "This Business Name already has a Loan" });
                                  }
                        
                                  loanModel.addLoan(customerId, depositId, guarantor_id, loan, (error, loan_id) => {
                                    if (error) {
                                      return res.status(500).send({ error: "Error fetching data from the database" });
                                    }
                        
                                    if (!loan_id) {
                                      return res.status(404).send({ error: "Failed to create Loan" });
                                    }
                        
                                    return res.status(200).send({ message: "Loan created successfully", loan_id });
                                  });
                                });
                              });
                    
                        }else{ //guarantor found
                            
                                const guarantorId = guarantorResults[0].guarantor_id;
                            
                                loanModel.getloanBybusinessName(loan.business_name, (error, results) => {

                                    if (error) {
                                      return res.status(500).send({ error: "Error fetching data from the database" });
                                    }
                          
                                    if (results.length > 0) {
                                      return res.status(409).send({ error: "This Business Name already has a Loan" });
                                    }
                          
                                    loanModel.addLoan(customerId, depositId, guarantorId, loan, (error, loan_id) => {
                                      if (error) {
                                        return res.status(500).send({ error: "Error fetching data from the database" });
                                      }
                          
                                      if (!loan_id) {
                                        return res.status(404).send({ error: "Failed to create Loan" });
                                      }
                          
                                      return res.status(200).send({ message: "Loan created successfully", loan_id });
                                    });
                                });                               
                        }
                });
            });               
          }
    });
}
  

// const updateLoan = (req, res) => {
//     const { loan_id } = req.params;
//     const loan = req.body;

//     loanModel.getloanById(loan_id, (error,existingloan) => {
//         if (error) {
//             res.status(500).send({ error: 'Error fetching data from the database' });
//             return;
//         }

//         if (!existingloan[0]) {
//             res.status(404).send({ error: 'Loan Details not found' });
//             return;
//         }

//         if (loan.business_name && loan.business_name  !== existingloan[0].business_name) { 


//             loanModel.getloanBybusinessName(loan.business_name, (error, results) => {
//                 if (error) {
//                     res.status(500).send({ error: 'Error fetching data from the database' });
//                     return;
//                 }
      
//                 if (results.length > 0) {
//                     res.status(409).send({ error: 'This Business name is already exists' });
//                     return;
//                 }
      
//                 updateExistingLoan(loan, loan_id);
//             });
//         } else {
//             updateExistingLoan(loan, loan_id);
//         }
//       });
      
//       function updateExistingLoan(loan, loan_id) {
//         loanModel.updateLoan(loan, loan_id, (error, results) => {
//             if (error) {
//                 res.status(500).send({ error: 'Error fetching data from the database' });
//                 return;
//             }
      
//             if (results.affectedRows === 0) {
//                 res.status(404).send({ error: 'Loan Details not found or no changes made' });
//                 return;
//             }
      
//             res.status(200).send({ message: 'Loan updated successfully' });
//         });
//       }};

module.exports = {
    addLoan,
    getAllLoans,
    getLoanById,
}