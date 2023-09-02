const { connection } = require('../../../config/connection');

const BranchModel = {
  
  getBranchById(branchid, callback) {
    connection.query('SELECT * FROM branch WHERE branchid = ? AND is_delete = 0', [branchid], callback);
  },

  getAllBranches(callback) {
    connection.query('SELECT * FROM branch WHERE is_delete = 0', callback);
  },

  getBranchByName(branchName, callback) {
    connection.query('SELECT * FROM branch WHERE branch_name = ? AND is_delete = 0', [branchName], callback);
  },

  addBranch(branch, callback) {
    const { branch_name, branch_location } = branch;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO branch (branch_name, branch_location, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [branch_name, branch_location, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const branchId = results.insertId;
      callback(null, branchId);
    });
  },

  updateBranch(branch, branchId, callback) {
    const { branch_name, branch_location, status } = branch;
    const query = 'UPDATE branch SET branch_name = ?, branch_location = ?, status = ? WHERE branchid = ?';
    const values = [branch_name, branch_location, status, branchId];

    connection.query(query, values, callback);
  },

  updateBranchStatus(branchId, status, callback) {
    const query = 'UPDATE branch SET status = ? WHERE branchid = ?';
    const values = [status, branchId];

    connection.query(query, values, callback);
  },

  deleteBranch(branchId, value, callback) {
    const query = 'UPDATE branch SET is_delete = ? WHERE branchid = ?';
    const values = [value, branchId];

    connection.query(query, values, callback);
  },

  deleteBranches(branchIds, callback) {
    if (!Array.isArray(branchIds)) {
      branchIds = [branchIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const branchId of branchIds) {
      BranchModel.getBranchById(branchId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          BranchModel.deleteBranch(branchId, 1, (deleteError, deleteResult) => {
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
      const totalCount = branchIds.length;
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



  permanentDeleteBranch(branchId, callback) {
    const query = 'DELETE FROM branch WHERE branchid = ?';
    const values = [branchId];

    connection.query(query, values, callback);
  },

  branchById(branchId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM branch WHERE branchid = ?', [branchId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = BranchModel;
