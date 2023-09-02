const { connection } = require('../../../config/connection');

const StorageModel = {

  getStorageById(storageid, callback) {
    connection.query('SELECT * FROM storage WHERE storageid = ? AND is_delete = 0', [storageid], callback);
  },

  getStorageBySize(storage_size, callback) {
    connection.query('SELECT * FROM storage WHERE storage_size = ? AND is_delete = 0', [storage_size], callback);
  },

  getAllStorages(callback) {
    connection.query('SELECT * FROM storage WHERE is_delete = 0', callback);
  },

  addStorage(storage, callback) {
    const { storage_size} = storage;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO storage (storage_size,trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [storage_size, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const storageid = results.insertId;
      callback(null, storageid);
    });
  },

  updateStorage(storage, storageid, callback) {
    const { storage_size, status } = storage;
    const query = 'UPDATE storage SET storage_size = ?,status = ? WHERE storageid = ?';
    const values = [storage_size,status, storageid];

    connection.query(query, values, callback);
  },

  updateStorageStatus(storageid, status, callback) {
    const query = 'UPDATE storage SET status = ? WHERE storageid = ?';
    const values = [status, storageid];

    connection.query(query, values, callback);
  },

  deleteStorage(storageid, value, callback) {
    const query = 'UPDATE storage SET is_delete = ? WHERE storageid = ?';
    const values = [value, storageid];

    connection.query(query, values, callback);
  },


};

module.exports = StorageModel;
