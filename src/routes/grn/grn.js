const express = require('express');
const {
  getAllGrns,
  getGrnById,
  addGrn,
  updateGrn,
  updateGrnStatus,
  deleteGrn,
  permanentDeleteGrn,
  deleteGrns,
  getAllGrnTemp,
  getGrnTempById,
  addGrnTemp,
  updateGrnTemp,
  updateGrnTempPurchaseprice,
  updateGrnTempSellPrice,
  updateGrnTempWholesaleprice,
  updateGrnTempGrnqty,
  updateGrnTempDiscount,
  deleteGrnTemp,
  permanentDeleteGrnTemp,
  getAllGrnTempBYGRNNO,
  deleteGrnTemps,
  finishGrn,
} = require('../../mvc/grn/GRNController');

const {
  getAllTempItemDetails,
  getTempItemDetailsById,
  addTempItemDetails,
  updateTempItemDetails,
  deleteTempItemDetails,
  permenentdeleteTempItemDetails,
  deletemultipleTempItemDetails,
  permenentdeletemultipleTempItemDetails
} = require('../../mvc/grn/ItemDetailsController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  // Routes for Grn Model
  router.get('/all', authenticateToken, getAllGrns);
  router.get('/:grnId', authenticateToken, getGrnById);
  router.post('/create', authenticateToken, addGrn);
  router.put('/update/status/:grnId', authenticateToken, updateGrnStatus);
  router.put('/update/:grnId', authenticateToken, updateGrn);
  router.put('/delete/:grnId', authorizeAccessControll, deleteGrn);
  router.put('/delete', authorizeAccessControll, deleteGrns);
//   router.delete('/permanent-delete/:grnId', authorizeAccessControll, permanentDeleteGrn);

  // Routes for GrnTemp Model
  router.get('/temp/all', authenticateToken, getAllGrnTemp);
  router.get('/temp/all/:grnId', authenticateToken, getAllGrnTempBYGRNNO); //new //have to update
  router.get('/temp/:grnTempId', authenticateToken, getGrnTempById);
  router.post('/temp/create', authenticateToken, addGrnTemp);
//   router.put('/temp/update/:grnTempId', authenticateToken, updateGrnTemp);
//   router.put('/temp/update/:grnTempId/status', authenticateToken, updateGrnTempStatus);
  router.put('/temp/delete/:grntempid', authorizeAccessControll, deleteGrnTemp);
  router.delete('/temp/permanent-delete/:grntempid', authorizeAccessControll, permanentDeleteGrnTemp);
  router.put('/temp/delete', authenticateToken, deleteGrnTemps);
  router.put('/temp/UpdatePurchaseprice/:grntempid', authenticateToken, updateGrnTempPurchaseprice);
  router.put('/temp/UpdateSellprice/:grntempid', authenticateToken, updateGrnTempSellPrice);
  router.put('/temp/UpdateWholesaleprice/:grntempid', authenticateToken, updateGrnTempWholesaleprice);
  router.put('/temp/UpdateGrnqty/:grntempid', authenticateToken, updateGrnTempGrnqty);
  router.put('/temp/UpdateDiscount/:grntempid', authenticateToken, updateGrnTempDiscount);

  // Routes for  TempItemDetailsModel
  router.post('/tempitem/create', authenticateToken, addTempItemDetails);
  router.get('/tempitem/all', authenticateToken, getAllTempItemDetails);
  router.get('/tempitem/:temp_itemdetails_id', authenticateToken, getTempItemDetailsById);
  router.put('/tempitem/update/:temp_itemdetails_id', authenticateToken, updateTempItemDetails);
  router.put('/tempitem/delete/:temp_itemdetails_id', authenticateToken, deleteTempItemDetails);
  router.delete('/tempitem/delete/:temp_itemdetails_id', authenticateToken, permenentdeleteTempItemDetails);
  router.put('/tempitem/delete', authenticateToken, deletemultipleTempItemDetails);
  router.delete('/tempitem/delete', authenticateToken, permenentdeletemultipleTempItemDetails);

  
  //finalize grn
  router.put('/finish/:grnId', authenticateToken, finishGrn);



  return router;
};
