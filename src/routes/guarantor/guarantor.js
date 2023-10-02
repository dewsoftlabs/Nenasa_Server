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
  
    router.post('/create', authenticateToken,addGuarantor);
    router.get('/all', authenticateToken,getAllGuarantors);
    router.get('/branch/all', authenticateToken,getAllGuarantors);
    router.get('/:guarantor_id', authenticateToken,getGuarantorById);
    router.put('/status/:guarantor_id', authenticateToken, updateGuarantorStatus);
    router.put('/update/:guarantor_id', authenticateToken,updateGuarantor);
    router.delete('/delete/:guarantor_id', authenticateToken,deleteGuarantor);
    router.put('/delete', authenticateToken,deleteGuarantors);

  
    return router;
  };