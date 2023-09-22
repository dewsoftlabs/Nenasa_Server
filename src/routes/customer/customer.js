const express = require('express');

const {
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomers,
    deleteCustomer,
    updateCustomerStatus,
    getCustomerDetailsByNIC,
    getAllCustomersbyBranch

} = require ('../../mvc/customer/CustomerController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll,addCustomer);
    router.get('/all', authorizeAccessControll,getAllCustomers);
    router.get('/branch/all/:branchid', authorizeAccessControll,getAllCustomersbyBranch);
    router.get('/:customer_id', authorizeAccessControll,getCustomerById);
    router.put('/status/:customer_id', authorizeAccessControll, updateCustomerStatus);
    router.put('/update/:customer_id', authorizeAccessControll,updateCustomer);
    router.put('/delete/:customer_id', authorizeAccessControll,deleteCustomer);
    router.put('/delete', authorizeAccessControll,deleteCustomers);
    router.get('/customerDetails/:customer_nic', authorizeAccessControll , getCustomerDetailsByNIC);
  
    return router;
  };