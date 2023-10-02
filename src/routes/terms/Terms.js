const express = require('express');

const {
    getAllTerms,
    getTermsById,
    addTerms,
    updateTerms,
    deleteTerm,
    deleteTerms,
} = require("../../mvc/terms/TermsController");
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken, addTerms);
    router.get('/all', authenticateToken, getAllTerms);
    router.get('/:terms_id', authenticateToken, getTermsById);
    router.delete('/delete/:terms_id', authenticateToken, deleteTerm);
    router.put('/delete', authenticateToken, deleteTerms);
    router.put('/update/:terms_id', authenticateToken, updateTerms);
  
    return router;
  };