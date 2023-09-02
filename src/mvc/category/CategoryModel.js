const { connection } = require('../../../config/connection');

const CategoryModel = {
  getCategoryById(categoryId, callback) {
    connection.query('SELECT * FROM category WHERE catid = ? AND is_delete = 0', [categoryId], callback);
  },

  getAllCategories(callback) {
    connection.query('SELECT * FROM category WHERE is_delete = 0', callback);
  },

  getCategoryByName(cat_name, callback) {
    connection.query('SELECT * FROM category WHERE cat_name = ? AND is_delete = 0', [cat_name], callback);
  },

  addCategory(category, callback) {
    const { cat_name } = category;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO category (cat_name, trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [cat_name, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const categoryId = results.insertId;
      callback(null, categoryId);
    });
  },

  updateCategory(category, categoryId, callback) {
    const { cat_name, status } = category;
    const query = 'UPDATE category SET cat_name = ?, status = ? WHERE catid = ?';
    const values = [cat_name, status ,categoryId];
    connection.query(query, values, callback);
  },

 

  updateCategoryStatus(categoryId, status, callback) {
    const query = 'UPDATE category SET status = ? WHERE catid = ?';
    const values = [status, categoryId];

    connection.query(query, values, callback);
  },

  deleteCategory(categoryId, value, callback) {
    const query = 'UPDATE category SET is_delete = ? WHERE catid = ?';
    const values = [value, categoryId];

    connection.query(query, values, callback);
  },

  deleteCategories(categoryIds, callback) {
    if (!Array.isArray(categoryIds)) {
      categoryIds = [categoryIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const categoryId of categoryIds) {
      CategoryModel.getCategoryById(categoryId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          CategoryModel.deleteCategory(categoryId, 1, (deleteError, deleteResult) => {
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
      const totalCount = categoryIds.length;
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

  permanentDeleteCategory(categoryId, callback) {
    const query = 'DELETE FROM category WHERE catid = ?';
    const values = [categoryId];

    connection.query(query, values, callback);
  },

  categoryById(categoryId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM category WHERE catid = ?', [categoryId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = CategoryModel;
