const { connection } = require('../../../config/connection');

const CollectionModel = {
  getCollectionById(collection_id, callback) {
    connection.query('SELECT * FROM collection WHERE collection_id = ? AND is_delete = 0', [collection_id], callback);
  },

  getAllCollections(callback) {
    connection.query('SELECT * FROM collection WHERE is_delete = 0', callback);
  },

  addCollection(loan_id, branchid, userid, callback) {
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;
  
    const query = 'INSERT INTO collection (loan_id, balance, paid_installements, branchid, userid, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [loan_id, defaultValues, defaultValues, branchid, userid, activeValues, trndate, defaultValues];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      const collection_id = results.insertId;
      callback(null, collection_id);
    });
  },
  

  updateCollection(collection, collection_id, callback) {
    const { loan_id, balance, paid_installements, branchid, userid, status } = collection;
    const query = 'UPDATE collection SET loan_id = ?, balance = ?, paid_installements = ?, branchid = ?, userid = ?, status = ? WHERE collection_id = ?';
    const values = [loan_id, balance, paid_installements, branchid, userid, status, collection_id];

    connection.query(query, values, callback);
  },

  deleteCollection(collection_id, value, callback) {
    const query = 'UPDATE collection SET is_delete = ? WHERE collection_id = ?';
    const values = [value, collection_id];

    connection.query(query, values, callback);
  },

  perma_deleteCollection(collection_id, callback) {
    const query = 'DELETE FROM collection WHERE collection_id = ?';
    const values = [collection_id];
  
    connection.query(query, values, callback);
  },
  

  updateCollectionStatus(collection_id, status, callback) {
    const query = 'UPDATE collection SET status = ? WHERE collection_id = ?';
    const values = [status, collection_id];

    connection.query(query, values, callback);
  },
};

module.exports = CollectionModel;
