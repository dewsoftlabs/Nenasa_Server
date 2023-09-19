const { connection } = require('../../../config/connection');

const AssignPermissionModel = {
  getAllAssignPermissions(callback) {
    connection.query('SELECT * FROM assign_permission WHERE is_delete = 0', callback);
  },

  getAllUserRolePermissions(callback) {
    connection.query('SELECT * FROM userrole JOIN assign_permission ON userrole.userroleid = assign_permission.userroleid JOIN permission ON permission.permission_code = assign_permission.permission_code WHERE assign_permission.is_delete = 0', callback);
  },

  getAssignPermissionById(assignPermissionId, callback) {
    connection.query('SELECT * FROM assign_permission WHERE assignpermissionid = ? AND is_delete = 0', [assignPermissionId], callback);
  },

  getPermissionByCode(permission_code, callback) {
    connection.query('SELECT * FROM assign_permission WHERE permission_code = ?', [permission_code], callback);
  },

  getUserRoleById(userRoleId, callback) {
    connection.query('SELECT * FROM userrole WHERE userroleid = ? AND is_delete = 0', [userRoleId], callback);
  },

  addAssignPermission(userroleid , permission_code,  callback) {
    const adddate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO assign_permission (permission_code, userroleid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?)';
    const values = [permission_code, userroleid, activeValues, adddate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const assignPermissionId = results.insertId;
      callback(null, assignPermissionId);
    });
  },

  getAssignPermissionByCode(assignPermissioncode, callback) {
    connection.query('SELECT * FROM assign_permission WHERE permission_code = ? AND is_delete = 0', [assignPermissioncode], callback);
  },

  updateAssignPermission(assignPermission, assignPermissionId, callback) {
    const { permission_code, status } = assignPermission;

    const query = 'UPDATE assign_permission SET permission_code = ?, status = ? WHERE assignpermissionid = ?';
    const values = [permission_code, status, assignPermissionId];

    connection.query(query, values, callback);
  },

  updateAssignPermissionStatus(assignPermissionId, status, callback) {
    const query = 'UPDATE assign_permission SET status = ? WHERE assignpermissionid = ?';
    const values = [status, assignPermissionId];

    connection.query(query, values, callback);
  },

  deleteAssignPermission(assignPermissionId, callback) {
    const query = 'DELETE FROM assign_permission WHERE assignpermissionid = ?';
    const values = [assignPermissionId];

    connection.query(query, values, callback);
  },

  deleteAssignPermissionByRoleId(userroleid, callback) {
    const query = 'DELETE FROM assign_permission WHERE userroleid = ?';
    const values = [userroleid];

    connection.query(query, values, callback);
  },


  deleteAssignPermissions(assignPermissionIds, callback) {
    if (!Array.isArray(assignPermissionIds)) {
      assignPermissionIds = [assignPermissionIds]; // Convert to array if it's a single assignPermissionId
    }

    let successCount = 0;
    let failCount = 0;

    for (const assignPermissionId of assignPermissionIds) {
      AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          AssignPermissionModel.deleteAssignPermission(assignPermissionId, 1, (deleteError, deleteResult) => {
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
      const totalCount = assignPermissionIds.length;
      if (successCount + failCount === totalCount) {
        if (typeof callback === 'function') {
          callback(null, {
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    }
  },

  permanentDeleteAssignPermission(assignPermissionId, callback) {
    const query = 'DELETE FROM assign_permission WHERE assignpermissionid = ?';
    const values = [assignPermissionId];

    connection.query(query, values, callback);
  },
};

module.exports = AssignPermissionModel;
