const express = require('express');
const {
  getAllSubcategories,
  getSubcategoryById,
  addSubcategory,
  updateSubcategory,
  updateSubcategoryStatus,
  deleteSubcategory,
  permanentDeleteSubcategory,
  deleteSubcategories
} = require('../../mvc/subcategory/SubcategoryController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addSubcategory);
  router.get('/all', authorizeAccessControll, getAllSubcategories);
  router.get('/:subcategoryId', authorizeAccessControll, getSubcategoryById);
  router.put('/status/:subcategoryId', authorizeAccessControll, updateSubcategoryStatus);
  router.put('/delete/:subcategoryId', authorizeAccessControll, deleteSubcategory);
  router.put('/delete', authorizeAccessControll, deleteSubcategories);
  router.put('/update/:subcategoryId', authorizeAccessControll, updateSubcategory);

  return router;
};
