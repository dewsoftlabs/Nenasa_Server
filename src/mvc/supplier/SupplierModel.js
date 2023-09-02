const { connection } = require('../../../config/connection');

const SupplierModel = {
  getSupplierById(supplierId, callback) {
    connection.query('SELECT * FROM supplier WHERE supplier_id = ? AND is_delete = 0', [supplierId], callback);
  },

  getAllSuppliers(callback) {
    connection.query('SELECT * FROM supplier WHERE is_delete = 0', callback);
  },

  getSupplierByEmail(supplier_email, callback) {
    connection.query('SELECT * FROM supplier WHERE supplier_email = ? AND is_delete = 0', [supplier_email], callback);
  },

  getUserByEmail(email, callback) {
    connection.query('SELECT * FROM user WHERE email = ? AND is_delete = 0', [email], callback);
  },

  getSupplierByPhonenumber(supplier_phone, callback) {
    connection.query('SELECT * FROM supplier WHERE supplier_phone = ? AND is_delete = 0', [supplier_phone], callback);
  },

  getUserByPhonenumber(phonenumber, callback) {
    connection.query('SELECT * FROM user WHERE phonenumber = ? AND is_delete = 0', [phonenumber], callback);
  },


  addSupplier(supplier, callback) {
    const { supplier_name, supplier_address, supplier_email, supplier_phone } = supplier;
    const supplier_adddate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO supplier (supplier_name, supplier_address, supplier_email, supplier_phone, supplier_adddate, supplier_status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [supplier_name, supplier_address, supplier_email, supplier_phone, supplier_adddate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const supplierId = results.insertId;
      callback(null, supplierId);
    });
  },

  updateSupplier(supplier, supplierId, callback) {

    const { supplier_name, supplier_address, supplier_phone, supplier_status } = supplier;
    const query = 'UPDATE supplier SET supplier_name = ?, supplier_address = ?, supplier_phone = ?, supplier_status = ? WHERE supplier_id = ?';
    const values = [supplier_name, supplier_address, supplier_phone, supplier_status, supplierId];
    connection.query(query, values, callback);

  },

  updateSupplierStatus(supplierId, status, callback) {
    const query = 'UPDATE supplier SET supplier_status = ? WHERE supplier_id = ?';
    const values = [status, supplierId];

    connection.query(query, values, callback);
  },

  deleteSupplier(supplierId, value, callback) {
    const query = 'UPDATE supplier SET is_delete = ? WHERE supplier_id = ?';
    const values = [value, supplierId];

    connection.query(query, values, callback);
  },

  deleteSuppliers(supplierIds, callback) {
    if (!Array.isArray(supplierIds)) {
      supplierIds = [supplierIds]; // Convert to array if it's a single user ID
    }

    let successCount = 0;
    let failCount = 0;

    for (const supplierId of supplierIds) {
      SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          SupplierModel.deleteSupplier(supplierId, 1, (deleteError, deleteResult) => {
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
      const totalCount = supplierIds.length;
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
  }

  ,



  permanentDeleteSupplier(supplierId, callback) {
    const query = 'DELETE FROM supplier WHERE supplier_id = ?';
    const values = [supplierId];

    connection.query(query, values, callback);
  },

  supplierById(supplierId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM supplier WHERE supplier_id = ?', [supplierId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = SupplierModel;
