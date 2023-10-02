const express = require('express');

const {
    addTarget,
    getAllTargets,
    getTargetById,
    updateTarget,
    deleteTarget,
    deleteTargets,
} = require("../../mvc/target/TargetController");
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll, addTarget);
    router.get('/all', authenticateToken, getAllTargets);
    router.get('/:target_id', authorizeAccessControll, getTargetById);
    router.delete('/delete/:target_id', authorizeAccessControll, deleteTarget);
    router.put('/delete', authorizeAccessControll, deleteTargets);
    router.put('/update/:target_id', authorizeAccessControll, updateTarget);
  
    return router;
  };