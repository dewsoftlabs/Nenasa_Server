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

      getCustomerBynic(customer_nic, callback) {
        connection.query('SELECT * FROM customer WHERE customer_nic = ? AND is_delete = 0', [customer_nic], callback);
      },
    

    addCustomer(customer, callback) {
        const { customer_name,customer_phone,customer_email , customer_address ,customer_gender , customer_nic } = customer;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = 'INSERT INTO customer (customer_name, customer_phone, customer_email, customer_address , customer_gender , customer_nic ,trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ? , ? , ?)';
        const values = [customer_name,customer_phone,customer_email, customer_address , customer_gender , customer_nic , trndate, activeValues, defaultValues];
    
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
        const { customer_name, customer_phone, customer_email, customer_address , customer_gender , customer_nic , status } = customer;
        const query = 'UPDATE customer SET customer_name = ?, customer_phone = ?, customer_email = ?, customer_address = ?, customer_gender = ? , customer_nic = ? , status = ? WHERE customer_id = ?';
        const values = [customer_name, customer_phone, customer_email, customer_address , customer_gender , customer_nic , status, customer_id];
    
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
        
        for (const customerId of customerIds) {
          CustomerModel.getCustomerById(customerId, (error, results) => {
            if (error || results.length === 0) {
              failCount++;
              checkCompletion();
            } else {
              CustomerModel.deleteCustomer(customerId, 1, (deleteError, deleteResult) => {
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
          const totalCount = customerIds.length;
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

      updateCustomerstatus(customerid, status, callback) {
        const query = 'UPDATE customer SET status = ? WHERE customer_id = ?';
        const values = [status, customerid];
    
        connection.query(query, values, callback);
      },

}

module.exports = customerModel;