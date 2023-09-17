const express = require('express');
const {
    addDepositAcc,
    updateDepositAcc,
    deletedepositAcc,
    deleteDepositAccs,
    permanentDeleteDepoAcc,
    getAlldepositAccs,
    getdepositAccByAccNo
} = require('../../mvc/deposit_acc/depositAccController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll, addDepositAcc);
    router.get('/all', authorizeAccessControll, getAlldepositAccs);
    router.get('/:deposit_acc_no', authorizeAccessControll, getdepositAccByAccNo);
    router.put('/delete/:deposit_acc_no', authorizeAccessControll, deletedepositAcc);
    router.put('/delete', authorizeAccessControll, deleteDepositAccs);
    router.put('/update/:deposit_acc_no', authorizeAccessControll, updateDepositAcc);
  
    return router;
  };