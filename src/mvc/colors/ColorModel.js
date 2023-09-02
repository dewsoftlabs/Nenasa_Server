const { connection } = require('../../../config/connection');

const ColorModel = {
  getColorById(colorId, callback) {
    connection.query('SELECT * FROM colors WHERE colorid = ? AND is_delete = 0', [colorId], callback);
  },

  getColorByName(colorname, callback) {
    connection.query('SELECT * FROM colors WHERE colorname = ? AND is_delete = 0', [colorname], callback);
  },

  getAllColors(callback) {
    connection.query('SELECT * FROM colors WHERE is_delete = 0', callback);
  },

  addColor(color, callback) {
    const { colorname} = color;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO colors (colorname,trndate, status, is_delete) VALUES (?, ?, ?, ?)';
    const values = [colorname, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const colorId = results.insertId;
      callback(null, colorId);
    });
  },

  updateColor(color, colorId, callback) {
    const { colorname, status } = color;
    const query = 'UPDATE colors SET colorname = ?,status = ? WHERE colorid = ?';
    const values = [colorname,status, colorId];

    connection.query(query, values, callback);
  },

  updateColorStatus(colorId, status, callback) {
    const query = 'UPDATE colors SET status = ? WHERE colorid = ?';
    const values = [status, colorId];

    connection.query(query, values, callback);
  },

  deleteColor(colorId, value, callback) {
    const query = 'UPDATE colors SET is_delete = ? WHERE colorid = ?';
    const values = [value, colorId];

    connection.query(query, values, callback);
  },

  deleteColors(colorIds, callback) {
    if (!Array.isArray(colorIds)) {
      colorIds = [colorIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const colorId of colorIds) {
      ColorModel.getColorById(colorId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          ColorModel.getColorById(colorId, 1, (deleteError, deleteResult) => {
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
      const totalCount = colorIds.length;
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

  permanentDeleteColor(colorId, callback) {
    const query = 'DELETE FROM colors WHERE colorid = ?';
    const values = [colorId];

    connection.query(query, values, callback);
  },

  getColorByIdPromise(colorId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM colors WHERE colorid = ?', [colorId], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  },
};

module.exports = ColorModel;
