const express = require('express');

const {
    getAllDepositTypes,
    getDepositTypeById,
    addDepositTypes,
    updateDepositTypes,
    deleteDepositType,
    deleteDepositTypes,
} = require("../../mvc/deposit_type/DepositTypeController");
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken, addDepositTypes);
    router.get('/all', authenticateToken, getAllDepositTypes);
    router.get('/:depositType_id', authenticateToken, getDepositTypeById);
    router.delete('/delete/:depositType_id', authenticateToken, deleteDepositType);
    router.put('/delete', authenticateToken, deleteDepositTypes);
    router.put('/update/:depositType_id', authenticateToken, updateDepositTypes);
  
    return router;
  };