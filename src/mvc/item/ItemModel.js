const { connection } = require('../../../config/connection');

const ItemModel = {
  getAllItemsBybranch(branch_id, callback) {
    connection.query('SELECT * FROM item JOIN item_price ON item.itemid = item_price.itemid WHERE item.is_delete = 0 AND item_price.is_delete = 0 AND item_price.branch_id = ?',[branch_id], callback);
  },

  getAllItemsWithPrice(callback) {
    connection.query('SELECT * FROM item JOIN item_price ON item.itemid = item_price.itemid WHERE item.is_delete = 0 AND item_price.is_delete = 0',callback);
  },
    

  getAllItems(callback) {
    connection.query('SELECT * FROM item WHERE is_delete = 0', callback);
  },

  getItemById(itemId, callback) {
    connection.query('SELECT * FROM item WHERE itemid = ? AND is_delete = 0', [itemId], callback);
  },

  getPriceBybranchId(itemid, branch_id, callback) {
    connection.query('SELECT item_priceid FROM item_price WHERE itemId = ? AND branch_id = ? AND is_delete = 0', [itemid, branch_id], callback);
},



  getItemByName(item_name, callback) {
    connection.query('SELECT * FROM item WHERE item_name = ? AND is_delete = 0', [item_name], callback);
  },

  getItemByCode(item_code, callback) {
    connection.query('SELECT * FROM item WHERE item_code = ? AND is_delete = 0', [item_code], callback);
  },

  addItem(item, itemimage, callback) {
    const { item_code, item_name, item_description, catid, subcatid, storageid, sale_warranty, condition_type, brandid, serial, sell_price, purchase_price, wholesale_price, discount} = item;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;
    const activeValues = 1;

    const query = 'INSERT INTO item (item_code, item_name, item_description, catid, subcatid, storageid, sale_warranty, condition_type, brandid, serial_status, item_image, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?)';
    const values = [item_code, item_name, item_description, catid, subcatid, storageid, sale_warranty, condition_type, brandid, serial, itemimage, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
        if (error) {
            callback(error, null);
            return;
        }

        const itemId = results.insertId;
        callback(null, itemId);

    });
},

addNewitemPrice(price, callback) {
  const { itemid, sell_price, purchase_price, wholesale_price, discount, branch_id } = price;
  const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const defaultValues = 0;
  const activeValues = 1;

  const query = 'INSERT INTO item_price (itemid, sell_price, purchase_price, wholesale_price, discount, branch_id, status, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [itemid, sell_price, purchase_price, wholesale_price, discount, branch_id, activeValues, trndate, defaultValues];

  connection.query(query, values, (error2, results) => {
      if (error2) {
          callback(error2, null);
          return;
      }

      const itempriceId = results.insertId;
  callback(null,itempriceId);

});
},


  updateItem(item, itemId, callback) {
    
    const { item_code, item_name, item_description, catid, subcatid, storageid, sale_warranty, condition_type, brandid, serial_status, status } = item;
    const query = 'UPDATE item SET item_code = ?, item_name = ?, item_description = ?, catid = ?, subcatid = ?, storageid = ?, sale_warranty = ?, condition_type = ?, brandid = ?, serial_status = ?, status = ? WHERE itemid = ?';
    const values = [item_code, item_name, item_description, catid, subcatid, storageid, sale_warranty, condition_type, brandid, serial_status, status, itemId];

    connection.query(query, values, callback);
    
  },

  updateItemImage(itemimage, itemId, callback) {
    const query = 'UPDATE item SET item_image = ? WHERE itemid = ?';
    const values = [itemimage, itemId];
    connection.query(query, values, callback);
  },

  deleteItem(itemId, is_delete, callback) {
    const query1 = 'UPDATE item SET is_delete = ? WHERE itemid = ?';
    const values1 = [is_delete, itemId];

    connection.query(query1, values1, (error1, results1) => {
      if (error1) {
          callback(error1, null);
          return;
      }
      
      const query2 = 'UPDATE item_price SET is_delete = ? WHERE itemid = ?';
      const values2 = [is_delete, itemId];
  
      connection.query(query2, values2, (error2, results2) => {
          if (error2) {
              callback(error2, null);
              return;
          }

      callback(null,null);

  });

  });
},

  deleteItems(itemIds, callback) {
    if (!Array.isArray(itemIds)) {
      itemIds = [itemIds]; // Convert to array if it's a single user ID
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const itemId of itemIds) {
      ItemModel.getItemById(itemId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          ItemModel.getItemById(itemId, 1, (deleteError, deleteResult) => {
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
      const totalCount = itemIds.length;
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

};

module.exports = ItemModel;
