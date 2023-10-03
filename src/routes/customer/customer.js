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
    getAllCustomersbyBranch,
    getcustomersSearch

} = require ('../../mvc/customer/CustomerController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken,addCustomer);
    router.get('/all', authenticateToken,getAllCustomers);
    router.get('/search/:keyword', authenticateToken,getcustomersSearch);
    router.get('/branch/all/:branchid', authenticateToken,getAllCustomersbyBranch);
    router.get('/:customer_id', authenticateToken,getCustomerById);
    router.put('/status/:customer_id', authenticateToken, updateCustomerStatus);
    router.put('/update/:customer_id', authenticateToken,updateCustomer);
    router.delete('/delete/:customer_id', authenticateToken,deleteCustomer);
    router.put('/delete', authenticateToken,deleteCustomers);
    router.get('/customerDetails/:customer_nic', authenticateToken , getCustomerDetailsByNIC);
  
    return router;
  };