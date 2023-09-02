const { connection } = require('../../../config/connection');

const SubcategoryModel = {
  getAllSubcategories(callback) {
    connection.query('SELECT * FROM subcategory WHERE is_delete = 0', callback);
  },

  getSubcategoryById(subcategoryId, callback) {
    connection.query('SELECT * FROM subcategory WHERE subcatid = ? AND is_delete = 0', [subcategoryId], callback);
  },

  getSubcathByName(subcat_name, callback) {
    connection.query('SELECT * FROM subcategory WHERE subcat_name = ? AND is_delete = 0', [subcat_name], callback);
  },

  addSubcategory(subcategory, callback) {
    const { subcat_name, catid } = subcategory;
    const adddate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO subcategory (subcat_name, catid, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [subcat_name, catid, adddate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const subcategoryId = results.insertId;
      callback(null, subcategoryId);
    });
  },

  updateSubcategory(subcategory, subcategoryId, callback) {
    const { subcat_name, catid, status } = subcategory;

    const query = 'UPDATE subcategory SET subcat_name = ?, catid = ?, status = ? WHERE subcatid = ?';
    const values = [subcat_name, catid, status, subcategoryId];

    connection.query(query, values, callback);
  },

  updateSubcategoryStatus(subcategoryId, status, callback) {
    const query = 'UPDATE subcategory SET status = ? WHERE subcatid = ?';
    const values = [status, subcategoryId];

    connection.query(query, values, callback);
  },

  deleteSubcategory(subcategoryId, is_delete, callback) {
    const query = 'UPDATE subcategory SET is_delete = ? WHERE subcatid = ?';
    const values = [is_delete, subcategoryId];

    connection.query(query, values, callback);
  },

  deleteSubcategories(subcategoryIds, callback) {
    if (!Array.isArray(subcategoryIds)) {
      subcategoryIds = [subcategoryIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const subcategoryId of subcategoryIds) {
      SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          SubcategoryModel.deleteSubcategory(subcategoryId, 1, (deleteError, deleteResult) => {
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
      const totalCount = subcategoryIds.length;
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

  permanentDeleteSubcategory(subcategoryId, callback) {
    const query = 'DELETE FROM subcategory WHERE subcatid = ?';
    const values = [subcategoryId];

    connection.query(query, values, callback);
  },
};

module.exports = SubcategoryModel;
