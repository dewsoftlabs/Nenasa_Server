const express = require('express');
const userRoute = require('./user/user');
const categoryRoute = require('./category/category');
const shopRoute = require('./shop/shop');
const branchRoute = require('./branch/branch');
const userroleRoute = require('./userrole/userrole');
const permissionRoute = require('./permission/permission');
const permissionGroupRoute = require('./permission_group/permission_group');
const customerRoute = require('./customer/customer');
const guarantorRoute = require('./guarantor/guarantor');
const routeRoute = require('./route/route');
const targetRoute = require("./target/target");
const loantypeRoute = require("./loan_type/loan_type");
const termsRoute = require("./terms/Terms");
const depositTypeRoute = require("./deposit_type/DepositType");
const depositAccRoute = require("./deposit_acc/depositAcc");
const loanRoute = require("./loan/loan");

module.exports = (config) => {
  const router = express.Router();

  //access control routes
  router.use('/user', userRoute(config)); //admin user only
  router.use('/branch', branchRoute(config)); //admin user only
  router.use('/shop', shopRoute(config)); //admin user only
  
  router.use('/userrole', userroleRoute(config)); //super admin only
  
  //need routes
  router.use('/customer', customerRoute(config));   //any user
  router.use('/guarantor', guarantorRoute(config));

  //filter routes
  router.use('/category', categoryRoute(config)); //admin user only
  router.use('/route', routeRoute(config));
  router.use('/permission', permissionRoute(config)); //super admin only
  router.use('/permission_group', permissionGroupRoute(config)); //super admin only
  router.use('/target',targetRoute(config));
  router.use('/loan_type',loantypeRoute(config));
  router.use('/terms',termsRoute(config));
  router.use('/depositType',depositTypeRoute(config));
  router.use('/depositAcc',depositAccRoute(config));
  router.use('/loan', loanRoute(config));
  return router;
};