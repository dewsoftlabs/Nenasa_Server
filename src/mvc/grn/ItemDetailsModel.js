const { connection } = require('../../../config/connection');

const TempItemDetailsModel = {

  getTempItemDetailsById(temp_itemdetails_id, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE temp_itemdetails_id = ? AND is_delete = 0', [temp_itemdetails_id], callback);
  },

  getTempItemDetailsBySerial(serial_no, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE serial_no = ? AND is_delete = 0', [serial_no], callback);
  },

  getTempItemDetailsByEmi(emi_number, callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE emi_number = ? AND is_delete = 0', [emi_number], callback);
  },
 
  getAllTempItemDetails(callback) {
    connection.query('SELECT * FROM temp_itemdetails WHERE is_delete = 0', callback);
  },

  addTempItemDetails(tempitemdetails, callback) {
    const { grntempid, serial_no, emi_number, colorid} = tempitemdetails;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    //const activeValues = 1;

    const query = 'INSERT INTO temp_itemdetails (grntempid, serial_no, emi_number, colorid, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [grntempid, serial_no, emi_number, colorid, trndate, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const temp_itemdetails_id = results.insertId;
      callback(null, temp_itemdetails_id);
    });
  },

  updateTempItemDetails(tempitemdetails, temp_itemdetails_id, callback) {
    const { serial_no, emi_number, colorid } = tempitemdetails;
    const query = 'UPDATE temp_itemdetails SET serial_no = ?, emi_number = ?, colorid = ? WHERE temp_itemdetails_id = ?';
    const values = [serial_no, emi_number, colorid, temp_itemdetails_id];

    connection.query(query, values, callback);
  },

  deleteTempItemDetails(temp_itemdetails_id, value, callback) {
    const query = 'UPDATE temp_itemdetails SET is_delete = ? WHERE temp_itemdetails_id = ?';
    const values = [value, temp_itemdetails_id];

    connection.query(query, values, callback);
  },

  permenentdeleteTempItemDetails(temp_itemdetails_id, callback) {
    const query = 'DELETE FROM temp_itemdetails WHERE temp_itemdetails_id = ?';
    const values = [temp_itemdetails_id];

    connection.query(query, values, callback);
  },


};

module.exports = TempItemDetailsModel;
