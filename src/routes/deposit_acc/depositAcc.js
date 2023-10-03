const express = require('express');
const {
    addDepositAcc,
    updateDepositAcc,
    deletedepositAcc,
    deleteDepositAccs,
    permanentDeleteDepoAcc,
    getAlldepositAccs,
    getdepositAccByAccNo,
    changeStatus,
    getdepositAccByCustomer
} = require('../../mvc/deposit_acc/depositAccController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken, addDepositAcc);
    router.get('/all', authenticateToken, getAlldepositAccs);
    router.get('/customer/:customer_id', authenticateToken, getdepositAccByCustomer);
    router.get('/:deposit_acc_no', authenticateToken, getdepositAccByAccNo);
    router.put('/status/:deposit_acc_no', authenticateToken, changeStatus);
    router.put('/delete/:deposit_acc_no', authenticateToken, deletedepositAcc);
    router.put('/delete', authenticateToken, deleteDepositAccs);
    router.put('/update/:deposit_acc_no', authenticateToken, updateDepositAcc);
  
    return router;
  };