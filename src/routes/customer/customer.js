const express = require('express');

const {
    addCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomers
    

} = require ('../../mvc/customer/CustomerController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll,addCustomer);
    router.get('/all', authorizeAccessControll,getAllCustomers);
    router.get('/:customer_id', authorizeAccessControll,getCustomerById);
    router.put('/update/:customer_id', authorizeAccessControll,updateCustomer);
    router.put('/delete', authorizeAccessControll,deleteCustomers);

  
    return router;
  };