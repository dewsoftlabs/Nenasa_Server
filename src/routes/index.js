const express = require('express');
const userRoute = require('./user/user');
const categoryRoute = require('./category/category');
const shopRoute = require('./shop/shop');
const branchRoute = require('./branch/branch');
const userroleRoute = require('./userrole/userrole');
const permissionRoute = require('./permission/permission');
const permissionGroupRoute = require('./permission_group/permission_group');
const customerRoute = require('./customer/customer');


module.exports = (config) => {
  const router = express.Router();

  //access control routes
  router.use('/user', userRoute(config)); //admin user only
  router.use('/branch', branchRoute(config)); //admin user only
  router.use('/shop', shopRoute(config)); //admin user only
  
  router.use('/userrole', userroleRoute(config)); //super admin only
  
  //need routes
  router.use('/customer', customerRoute(config));   //any user
  
  //filter routes
  router.use('/category', categoryRoute(config)); //admin user only
  router.use('/permission', permissionRoute(config)); //super admin only
  router.use('/permission_group', permissionGroupRoute(config)); //super admin only

  return router;
};