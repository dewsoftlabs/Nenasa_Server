const { connection } = require('../../../config/connection');

const GuarantorModel = {

    getGuarantorById(guarantor_id, callback) {
        connection.query('SELECT * FROM guarantor WHERE guarantor_id = ? AND is_delete = 0', [guarantor_id], callback);
      },
    
      getAllGuarantors(callback) {
        connection.query('SELECT * FROM guarantor WHERE is_delete = 0', callback);
      },

      getGuarantorByphone(guarantor_phone, callback) {
        connection.query('SELECT * FROM guarantor WHERE guarantor_phone = ? AND is_delete = 0', [guarantor_phone], callback);
      },
    
      getGuarantorByemail(guarantor_email, callback) {
        connection.query('SELECT * FROM guarantor WHERE guarantor_email = ? AND is_delete = 0', [guarantor_email], callback);
      },

    addGuarantor(guarantor, callback) {
        const { guarantor_name,guarantor_phone,guarantor_email , guarantor_address , guarantor_nic } = guarantor;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = 'INSERT INTO guarantor (guarantor_name, guarantor_phone, guarantor_email, guarantor_address  , guarantor_nic ,trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ? , ? )';
        const values = [guarantor_name,guarantor_phone,guarantor_email, guarantor_address  , guarantor_nic , trndate, activeValues, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const guarantor_id = results.insertId;
          callback(null, guarantor_id);
        });
      },

      updateGuarantor(guarantor, guarantor_id, callback) {
        const { guarantor_name, guarantor_phone, guarantor_email , guarantor_address , guarantor_nic , status } = guarantor;
        const query = 'UPDATE guarantor SET guarantor_name = ?, guarantor_phone = ?, guarantor_email = ? , guarantor_address = ? , guarantor_nic = ? , status = ? WHERE guarantor_id = ?';
        const values = [guarantor_name, guarantor_phone, guarantor_email , guarantor_address , guarantor_nic , status, guarantor_id];
    
        connection.query(query, values, callback);
      },

      deleteGuarantor(guarantor_id, value, callback) {
        const query = 'UPDATE guarantor SET is_delete = ? WHERE guarantor_id = ?';
        const values = [value, guarantor_id];
    
        connection.query(query, values, callback);
      },

      deleteGuarantors(guarantor_id, callback) {
        if (!Array.isArray(guarantor_id)) {
            guarantorid = [guarantor_id]; // Convert to array if it's a single guarantor ID
        }
      
        let successCount = 0;
        let failCount = 0;
        
        for (const guarantorId of guarantorIds) {
            GuarantorModel.getGuarantorById(guarantorId, (error, results) => {
              if (error || results.length === 0) {
                failCount++;
                checkCompletion();
              } else {
                GuarantorModel.deleteGuarantor(guarantorId, 1, (deleteError, deleteResult) => {
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
            const totalCount = guarantorIds.length;
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
      } ,
}

module.exports = GuarantorModel;