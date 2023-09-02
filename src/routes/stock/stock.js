const express = require('express');
const {
  getAllStocks,
  getStockById,
  deleteStock,
  getAllStocksBranch,
  permanentDeleteStock,
} = require('../../mvc/stock/StockController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.get('/all/comon', authenticateToken, getAllStocks);
  router.get('/branch/all/:branch_id', authenticateToken, getAllStocksBranch);
  router.get('/:stockId', authenticateToken, getStockById);
  router.put('/delete/:stockId', authenticateToken, deleteStock);
  router.delete('/permanent-delete/:stockId', authenticateToken, permanentDeleteStock);

  return router;
};
