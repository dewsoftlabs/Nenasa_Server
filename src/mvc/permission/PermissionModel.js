const { connection } = require('../../../config/connection');

const PermissionModel = {
  getPermissionById(permissionId, callback) {
    connection.query('SELECT * FROM permission WHERE permissionid = ?', [permissionId], callback);
  },

  getAllPermissions(callback) {
    connection.query('SELECT * FROM permission', callback);
  },

  getPermissionByCode(permissionCode, callback) {
    connection.query('SELECT * FROM permission WHERE permission_code = ?', [permissionCode], callback);
  },

  addPermission(permission, callback) {
    const { permission_code, permission_description } = permission;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = 'INSERT INTO permission (permission_code, permission_description, trndate) VALUES (?, ?, ?)';
    const values = [permission_code, permission_description, trndate];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const permissionId = results.insertId;
      callback(null, permissionId);
    });
  },

  updatePermission(permission, permissionId, callback) {
    const { permission_code, permission_description } = permission;
    const query = 'UPDATE permission SET permission_code = ?, permission_description = ? WHERE permissionid = ?';
    const values = [permission_code, permission_description, permissionId];

    connection.query(query, values, callback);
  },

  deletePermission(permissionId, callback) {
    const query = 'DELETE FROM permission WHERE permissionid = ?';
    const values = [permissionId];

    connection.query(query, values, callback);
  },

  permissionById(permissionId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM permission WHERE permissionid = ?', [permissionId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = PermissionModel;
