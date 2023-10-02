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
  
    router.post('/create', authenticateToken, addTarget);
    router.get('/all', authenticateToken, getAllTargets);
    router.get('/:target_id', authenticateToken, getTargetById);
    router.delete('/delete/:target_id', authenticateToken, deleteTarget);
    router.put('/delete', authenticateToken, deleteTargets);
    router.put('/update/:target_id', authenticateToken, updateTarget);
  
    return router;
  };