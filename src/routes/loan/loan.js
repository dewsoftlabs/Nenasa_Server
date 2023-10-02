const express = require('express');

const {
    addLoan,
    getAllLoans,
    getLoanById,
    

} = require ('../../mvc/loan/loanController');

const { authenticateToken } = require('../../middlewares/userAuth');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken,addLoan);
    router.get('/all', authenticateToken,getAllLoans);
    router.get('/:loan_id', authenticateToken,getLoanById);
    // router.put('/status/:guarantor_id', authenticateToken, updateGuarantorStatus);
    // router.put('/update/:guarantor_id', authenticateToken,updateGuarantor);
    // router.put('/delete/:guarantor_id', authenticateToken,deleteGuarantor);
    // router.put('/delete', authenticateToken,deleteGuarantors);

  
    return router;
  };