const express = require('express');
const {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
  permanentDeleteCategory,
  deleteCategories
} = require('../../mvc/category/CategoryController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addCategory);
  router.get('/all', authorizeAccessControll, getAllCategories);
  router.get('/:categoryId', authorizeAccessControll, getCategoryById);
  router.put('/status/:categoryId', authorizeAccessControll, updateCategoryStatus);
  router.put('/delete/:categoryId', authorizeAccessControll, deleteCategory);
  router.put('/delete', authorizeAccessControll, deleteCategories);
  router.put('/update/:categoryId', authorizeAccessControll, updateCategory);

  return router;
};
