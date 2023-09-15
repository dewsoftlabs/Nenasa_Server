const express = require('express');

const {
    addGuarantor,
    getAllGuarantors,
    getGuarantorById,
    updateGuarantor,
    deleteGuarantors,
    deleteGuarantor,
    updateGuarantorStatus,
    

} = require ('../../mvc/guarantor/GuarantorController');

const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authorizeAccessControll,addGuarantor);
    router.get('/all', authorizeAccessControll,getAllGuarantors);
    router.get('/:guarantor_id', authorizeAccessControll,getGuarantorById);
    router.put('/status/:guarantor_id', authorizeAccessControll, updateGuarantorStatus);
    router.put('/update/:guarantor_id', authorizeAccessControll,updateGuarantor);
    router.put('/delete/:guarantor_id', authorizeAccessControll,deleteGuarantor);
    router.put('/delete', authorizeAccessControll,deleteGuarantors);

  
    return router;
  };