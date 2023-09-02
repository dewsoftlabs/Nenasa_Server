const express = require('express');
const {
  getAllComonItems,
  getItemById,
  getAllItemsBybranch,
  getAllItemsWithPrice,
  addItem,
  addNewitemPrice,
  updateItem,
  deleteItem,
  deleteItems,
  getPriceBybranchId,
  updateItemImage
} = require('../../mvc/item/ItemController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { uploadItem } = require('../../../config/fileUpload');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', uploadItem.single('item_image'), authenticateToken, addItem);
  router.post('/upload/:itemId', uploadItem.single('item'), authenticateToken, updateItemImage);
  router.use('/getitem', express.static('src/uploads/item/'));
  router.get('/withPriceBybranch/:branch_id', authenticateToken, getAllItemsBybranch);
  router.get('/all/comon', authenticateToken, getAllComonItems);
  router.get('/all/withPrice', authenticateToken, getAllItemsWithPrice);
  router.get('/:itemId', authenticateToken, getItemById);
  router.put('/update/:itemId', authenticateToken, updateItem);
  router.put('/delete/:itemId', authenticateToken, deleteItem);
  router.put('/delete', authenticateToken, deleteItems);
  router.post('/createPrice', authenticateToken, addNewitemPrice);

  router.get('/pricee/getp', authenticateToken, getPriceBybranchId);
  
  


  return router;
};
