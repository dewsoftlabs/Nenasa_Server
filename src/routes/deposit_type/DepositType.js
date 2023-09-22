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
  
    router.post('/create', authorizeAccessControll, addDepositTypes);
    router.get('/all', authorizeAccessControll, getAllDepositTypes);
    router.get('/:depositType_id', authorizeAccessControll, getDepositTypeById);
    router.put('/delete/:depositType_id', authorizeAccessControll, deleteDepositType);
    router.delete('/delete', authorizeAccessControll, deleteDepositTypes);
    router.put('/update/:depositType_id', authorizeAccessControll, updateDepositTypes);
  
    return router;
  };