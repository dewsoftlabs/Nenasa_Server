const { connection } = require("../../../config/connection");

const customerModel = {
  getCustomerById(customer_id, callback) {
    connection.query(
      "SELECT * FROM customer WHERE customer_id = ? AND is_delete = 0",
      [customer_id],
      callback
    );
  },

  getCustomerByIdAll(customer_id, callback) {
    connection.query(
      "SELECT * FROM customer JOIN branch ON branch.branchid = customer.branchid JOIN route ON route.routeid = customer.routeid WHERE customer.customer_id = ? AND customer.is_delete = 0",
      [customer_id],
      callback
    );
  },

  getAllCustomers(callback) {
    connection.query("SELECT * FROM customer WHERE is_delete = 0", callback);
  },

  getCustomersSearch(keyword, callback) {
    const searchKeyword = `%${keyword}%`; // Assuming you want to perform a partial match
    connection.query(
      "SELECT * FROM customer WHERE (customer_name LIKE ? OR customer_nic LIKE ?) AND is_delete = 0",
      [searchKeyword, searchKeyword],
      callback
    );
  },

  getCustomersbyBranch(branchid, callback) {
    connection.query(
      "SELECT * FROM customer JOIN branch ON branch.branchid = customer.branchid  WHERE customer.is_delete = 0 AND customer.branchid = ?",
      [branchid],
      callback
    );
  },

  getCustomerByphone(customer_phone, callback) {
    connection.query(
      "SELECT * FROM customer WHERE customer_phone = ? AND is_delete = 0",
      [customer_phone],
      callback
    );
  },

  getCustomerByemail(customer_email, callback) {
    connection.query(
      "SELECT * FROM customer WHERE customer_email = ? AND is_delete = 0",
      [customer_email],
      callback
    );
  },

  getCustomerBynic(customer_nic, callback) {
    connection.query(
      "SELECT * FROM customer WHERE customer_nic = ? AND is_delete = 0",
      [customer_nic],
      callback
    );
  },

  getCustomerByCustomer_id(customer_id, callback) {
    connection.query(
      "SELECT * FROM customer WHERE customer_id = ? AND is_delete = 0",
      [customer_id],
      callback
    );
  },

  getCustomerDetailsByID(customer_id, callback) {
    const query = `
            SELECT
              c.*,
              d.*,
              l.*,
              g.*,
              b.*
            FROM customer AS c
            LEFT JOIN deposit_acc AS d ON c.customer_id = d.customer_id
            LEFT JOIN loan AS l ON c.customer_id = l.customer_id
            LEFT JOIN guarantor AS g ON l.guarantor_id = g.guarantor_id
            LEFT JOIN branch AS b ON c.branchid = b.branchid
            WHERE c.customer_id = ? 
              AND c.is_delete = 0 ;
          `;

    connection.query(query, [customer_id], callback);
  },

  addCustomer(customer, callback) {
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_gender,
      customer_nic,
      branchid,
      routeid,
    } = customer;
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;
    const activeValues = 1;
    const branchIdInt = parseInt(branchid, 10);

    const query =
      "INSERT INTO customer (customer_name, customer_phone, customer_email, customer_address , customer_gender , customer_nic , branchid , trndate, customer_status, is_delete, routeid) VALUES (?, ?, ?, ?, ?, ?, ? , ?, ? , ?, ?)";
    const values = [
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_gender,
      customer_nic,
      branchIdInt,
      trndate,
      activeValues,
      defaultValues,
      routeid,
    ];

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
    const {
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_gender,
      customer_nic,
      branchid,
      customer_status,
      routeid,
    } = customer;
    const query =
      "UPDATE customer SET customer_name = ?, customer_phone = ?, customer_email = ?, customer_address = ?, customer_gender = ? , customer_nic = ? , branchid = ?,  routeid = ? , customer_status = ? WHERE customer_id = ?";
    const values = [
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      customer_gender,
      customer_nic,
      branchid,
      routeid,
      customer_status,
      customer_id,
    ];

    connection.query(query, values, callback);
  },

  deleteCustomer(customer_id, value, callback) {
    const query = "UPDATE customer SET is_delete = ? WHERE customer_id = ?";
    const values = [value, customer_id];

    connection.query(query, values, callback);
  },

  perma_deleteCustomer(customer_id, callback) {
    const query = "DELETE FROM customer WHERE customer_id = ?";
    const values = [customer_id]; // Corrected values array
  
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
          CustomerModel.deleteCustomer(
            customerId,
            1,
            (deleteError, deleteResult) => {
              if (deleteError) {
                failCount++;
              } else {
                successCount++;
              }

              checkCompletion();
            }
          );
        }
      });
    }

    function checkCompletion() {
      const totalCount = customerIds.length;
      if (successCount + failCount === totalCount) {
        if (typeof callback === "function") {
          // Check if callback is provided and is a function
          callback(null, {
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    }
  },

  updateCustomerstatus(customerid, customer_status, callback) {
    const query =
      "UPDATE customer SET customer_status = ? WHERE customer_id = ?";
    const values = [customer_status, customerid];

    connection.query(query, values, callback);
  },
};

module.exports = customerModel;
