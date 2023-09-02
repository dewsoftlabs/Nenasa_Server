const { connection } = require('../../../config/connection');

const customerModel = {

      getCustomerById(customer_id, callback) {
        connection.query('SELECT * FROM customer WHERE customer_id = ? AND is_delete = 0', [customer_id], callback);
      },
    
      getAllCustomers(callback) {
        connection.query('SELECT * FROM customer WHERE is_delete = 0', callback);
      },

      getCustomerByphone(customer_phone, callback) {
        connection.query('SELECT * FROM customer WHERE customer_phone = ? AND is_delete = 0', [customer_phone], callback);
      },
    
      getCustomerByemail(customer_email, callback) {
        connection.query('SELECT * FROM customer WHERE customer_email = ? AND is_delete = 0', [customer_email], callback);
      },
    

    addCustomer(customer, callback) {
        const { customer_name,customer_phone,customer_email } = customer;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = 'INSERT INTO customer (customer_name, customer_phone, customer_email, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [customer_name,customer_phone,customer_email, trndate, activeValues, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const customer_id = results.insertId;
          callback(null, customer_id);
        });
      },

      updateCustomer(customer, customer_id, callback) {
        const { customer_name, customer_phone, customer_email, status } = customer;
        const query = 'UPDATE customer SET customer_name = ?, customer_phone = ?, customer_email = ?, status = ? WHERE customer_id = ?';
        const values = [customer_name, customer_phone, customer_email, status, customer_id];
    
        connection.query(query, values, callback);
      },

      deleteCustomer(customer_id, value, callback) {
        const query = 'UPDATE customer SET is_delete = ? WHERE customer_id = ?';
        const values = [value, customer_id];
    
        connection.query(query, values, callback);
      },



      deleteCustomers(customer_id, callback) {
        if (!Array.isArray(customer_id)) {
            customerid = [customer_id]; // Convert to array if it's a single customer ID
        }
      
        let successCount = 0;
        let failCount = 0;
        
        for (const brandId of brandIds) {
          BrandModel.getBrandById(brandId, (error, results) => {
            if (error || results.length === 0) {
              failCount++;
              checkCompletion();
            } else {
              BrandModel.deleteBrand(brandId, 1, (deleteError, deleteResult) => {
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
          const totalCount = brandIds.length;
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

module.exports = customerModel;