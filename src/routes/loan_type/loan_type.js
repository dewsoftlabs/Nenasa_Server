const express = require('express');

const {
    addType,
    updateType,
    deleteType,
    deleteTypes,
    getAllTypes,
    getTypeById,
} = require("../../mvc/loan_type/loantypeController");
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken, addType);
    router.get('/all', authenticateToken, getAllTypes);
    router.get('/:loantype_id', authenticateToken, getTypeById);
    router.delete('/delete/:loantype_id', authenticateToken, deleteType);
    router.put('/delete', authenticateToken, deleteTypes);
    router.put('/update/:loantype_id', authenticateToken, updateType);
  
    return router;
  };