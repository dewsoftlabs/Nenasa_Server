const express = require('express');
const {
  getAllBrands,
  getBrandById,
  addBrand,
  updateBrand,
  updateBrandStatus,
  deleteBrand,
  permanentDeleteBrand,
  deleteBrands
} = require('../../mvc/brands/BrandController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addBrand);
  router.get('/all', authorizeAccessControll, getAllBrands);
  router.get('/:brandId', authorizeAccessControll, getBrandById);
  router.put('/status/:brandId', authorizeAccessControll, updateBrandStatus);
  router.put('/delete/:brandId', authorizeAccessControll, deleteBrand);
  router.put('/delete', authorizeAccessControll, deleteBrands);
  router.put('/update/:brandId', authorizeAccessControll, updateBrand);

  return router;
};
