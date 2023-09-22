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
  
    router.post('/create', authorizeAccessControll, addType);
    router.get('/all', authorizeAccessControll, getAllTypes);
    router.get('/:loantype_id', authorizeAccessControll, getTypeById);
    router.put('/delete/:loantype_id', authorizeAccessControll, deleteType);
    router.delete('/delete', authorizeAccessControll, deleteTypes);
    router.put('/update/:loantype_id', authorizeAccessControll, updateType);
  
    return router;
  };