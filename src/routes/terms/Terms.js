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
  
    router.post('/create', authorizeAccessControll, addTerms);
    router.get('/all', authorizeAccessControll, getAllTerms);
    router.get('/:terms_id', authorizeAccessControll, getTermsById);
    router.delete('/delete/:terms_id', authorizeAccessControll, deleteTerm);
    router.put('/delete', authorizeAccessControll, deleteTerms);
    router.put('/update/:terms_id', authorizeAccessControll, updateTerms);
  
    return router;
  };