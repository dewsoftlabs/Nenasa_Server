const express = require('express');
const {
    addStorage,
    getAllStorages,
    getStorageById,
    updateStorage,
    updateStorageStatus,
    deleteStorage,
    deleteStorages
} = require('../../mvc/storage/StorageController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessControll, addStorage);
  router.get('/all', authorizeAccessControll, getAllStorages);
  router.get('/:storageid', authorizeAccessControll, getStorageById);
  router.put('/status/:storageid', authorizeAccessControll, updateStorageStatus);
  router.put('/delete/:storageid', authorizeAccessControll, deleteStorage);
  router.put('/delete', authorizeAccessControll, deleteStorages);
  router.put('/update/:storageid', authorizeAccessControll, updateStorage);

  return router;
};
