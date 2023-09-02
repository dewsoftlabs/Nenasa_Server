const { connection } = require('../../../config/connection');

const StockModel = {
    getStockById(stockId, callback) {
        connection.query('SELECT * FROM stock WHERE stockid = ? AND is_delete = 0', [stockId], callback);
    },

    getAllStocksInBranch(branch_id, callback) {
        connection.query('SELECT * FROM stock WHERE is_delete = 0 AND branch_id = ?', [branch_id], callback);
    },

    getAllStocks(callback) {
        connection.query('SELECT * FROM stock WHERE is_delete = 0 ', callback);
    },

    getStockByItemAndBranch(itemid, branch_id, callback) {
        const query = 'SELECT * FROM stock WHERE itemid = ? AND branch_id = ? AND is_delete = 0';
        const values = [itemid, branch_id];

        connection.query(query, values, callback);
    },

    deleteStock(stockId, value, callback) {
        const query = 'UPDATE stock SET is_delete = ? WHERE stockid = ?';
        const values = [value, stockId];

        connection.query(query, values, callback);
    },
    permanentDeleteStock(stockId, callback) {
        const query = 'DELETE FROM stock WHERE stockid = ?';
        const values = [stockId];

        connection.query(query, values, callback);
    },

    getStockByIdPromise(stockId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM stock WHERE stockid = ?', [stockId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },
};

module.exports = StockModel;
