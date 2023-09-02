const express = require('express');
const {
  getAllColors,
  getColorById,
  addColor,
  updateColor,
  updateColorStatus,
  deleteColor,
  permanentDeleteColor,
  deleteColors
} = require('../../mvc/colors/ColorController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addColor);
  router.get('/all', authorizeAccessControll, getAllColors);
  router.get('/:colorId', authorizeAccessControll, getColorById);
  router.put('/status/:colorId', authorizeAccessControll, updateColorStatus);
  router.put('/delete/:colorId', authorizeAccessControll, deleteColor);
  router.put('/delete', authorizeAccessControll, deleteColors);
  router.put('/update/:colorId', authorizeAccessControll, updateColor);

  return router;
};
