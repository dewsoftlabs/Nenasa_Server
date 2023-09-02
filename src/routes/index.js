const express = require('express');
const userRoute = require('./user/user');
const supplierRoute = require('./supplier/supplier');
const categoryRoute = require('./category/category');
const subcategoryRoute = require('./subcategory/subcategory');
const itemRoute = require('./item/item'); 
const shopRoute = require('./shop/shop');
const branchRoute = require('./branch/branch');
const userroleRoute = require('./userrole/userrole');
const colorRoute = require('./color/color');
const brandRoute = require('./brands/brands');
const permissionRoute = require('./permission/permission');
const permissionGroupRoute = require('./permission_group/permission_group');
const GRNRoute = require('./grn/grn');
const customerRoute = require('./customer/customer');
const stockRoute = require('./stock/stock');
const storageRoute = require('./storage/storage');


module.exports = (config) => {
  const router = express.Router();

  //access control routes
  router.use('/user', userRoute(config)); //admin user only
  router.use('/branch', branchRoute(config)); //admin user only
  router.use('/shop', shopRoute(config)); //admin user only
  
  router.use('/userrole', userroleRoute(config)); //super admin only
  
  //need routes
  router.use('/supplier', supplierRoute(config));   //any user
  router.use('/item', itemRoute(config));   //any user
  router.use('/grn', GRNRoute(config));   //any user
  router.use('/stock', stockRoute(config));   //any user
  router.use('/customer', customerRoute(config));   //any user
  
  //filter routes
  router.use('/category', categoryRoute(config)); //admin user only
  router.use('/subcategory', subcategoryRoute(config)); //admin user only
  router.use('/color', colorRoute(config)); //admin user only
  router.use('/brand', brandRoute(config)); //admin user only
  router.use('/storage', storageRoute(config)); //admin user only

  router.use('/permission', permissionRoute(config)); //super admin only
  router.use('/permission_group', permissionGroupRoute(config)); //super admin only

  return router;
};

