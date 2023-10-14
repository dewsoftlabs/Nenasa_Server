const { connection } = require('../../../config/connection');

const loanModel = {

    getloanById(loan_id, callback) {
        connection.query('SELECT * FROM loan WHERE loan_id = ? AND is_delete = 0', [loan_id], callback);
      },
    
      getAllLoans(callback) {
        connection.query('SELECT * FROM loan WHERE is_delete = 0', callback);
      },
    
      getloanBybusinessName(business_name, callback) {
        connection.query('SELECT * FROM loan WHERE business_name = ? AND status != 4 AND is_delete = 0', [business_name], callback);
      },

      addLoan(customer_id, deposit_acc_no , guarantor_id ,loan, callback) {

        const { business_name, business_type, userid, loan_amount,
             rate, loan_category, loantype_id, terms_id, installments, total_payable, startDate, endDate, 
             document_charge, service_charge, hold_period, deposit_amount, total_payamount
            } = loan;

        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = `INSERT INTO loan 
                        (customer_id, deposit_acc_no, guarantor_id, business_name, business_type, 
                        userid, loan_amount, rate, loan_category, loantype_id, terms_id, installments, 
                        total_payable, startDate, endDate, document_charge, service_charge, hold_period, 
                        deposit_amount, total_payamount, status ,trndate, is_delete) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `;

        const values = [customer_id, deposit_acc_no, guarantor_id, business_name, business_type, userid, loan_amount,
             rate, loan_category, loantype_id, terms_id, installments, total_payable, startDate, endDate, 
             document_charge, service_charge, total_payamount, hold_period, deposit_amount,activeValues
            ,trndate, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const loanId = results.insertId;
          callback(null, loanId);
        });
      },

      updateLoan(loan, loan_id, callback) {
        const {
          customer_id, deposit_acc_no, guarantor_id, business_name, business_type, userid, loan_amount,
          rate, loan_category, loantype_id, terms_id, installments, total_payable, startDate, endDate, 
          document_charge, service_charge, hold_period, deposit_amount , status
        } = loan;


      
        const query = `
          UPDATE loan 
          SET customer_id = ?, deposit_acc_no = ?, guarantor_id = ?, business_name = ?, business_type = ?, 
          userid = ?, loan_amount = ?, rate = ?, loan_category = ?, loantype_id = ?, terms_id = ?, 
          installments = ?, total_payable = ?, startDate = ?, endDate = ?, document_charge = ?, 
          service_charge = ?, hold_period = ?, deposit_amount = ? , status = ?
          WHERE loan_id = ?
        `;
      
        const values = [
          customer_id, deposit_acc_no, guarantor_id, business_name, business_type, userid, loan_amount,
          rate, loan_category, loantype_id, terms_id, installments, total_payable, startDate, endDate, 
          document_charge, service_charge, hold_period, deposit_amount, status ,loan_id
        ];
      
        connection.query(query, values, callback);
      },
      
      deleteLoan(loan_id, value, callback) {
        const query = 'UPDATE loan SET is_delete = ? WHERE loan_id = ?';
        const values = [value, loan_id];
    
        connection.query(query, values, callback);
      },

      deleteLoans(loanIds, callback) {
        if (!Array.isArray(loanIds)) {
          loanIds = [loanIds]; // Convert to array if it's a single user ID
        }
      
        let successCount = 0;
        let failCount = 0;
      
        for (const loan_id of loanIds) {
          loanModel.getloanById(loan_id, (error, results) => {
            if (error || results.length === 0) {
              failCount++;
              checkCompletion();
            } else {
              loanModel.deleteLoan(loan_id, 1, (deleteError, deleteResult) => {
                if (deleteError) {
                  failCount++;
                } else {
                  successCount++;
                }
      
                checkCompletion();
              });
            }
          });
        }
      
        function checkCompletion() {
          const totalCount = loanIds.length;
          if (successCount + failCount === totalCount) {
            if (typeof callback === 'function') { // Check if callback is provided and is a function
              callback(null, {
                totalCount,
                successCount,
                failCount,
              });
            }
          }
        }
      },

}

module.exports = loanModel;