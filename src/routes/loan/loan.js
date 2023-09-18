const express = require('express');

const {
    addLoan,
    getAllLoans,
    getLoanById,
    

} = require ('../../mvc/loan/loanController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll,addLoan);
    router.get('/all', authorizeAccessControll,getAllLoans);
    router.get('/:loan_id', authorizeAccessControll,getLoanById);
    // router.put('/status/:guarantor_id', authorizeAccessControll, updateGuarantorStatus);
    // router.put('/update/:guarantor_id', authorizeAccessControll,updateGuarantor);
    // router.put('/delete/:guarantor_id', authorizeAccessControll,deleteGuarantor);
    // router.put('/delete', authorizeAccessControll,deleteGuarantors);

  
    return router;
  };