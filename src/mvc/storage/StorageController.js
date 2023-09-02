const StorageModel = require('./StorageModel');

const getAllStorages = (req, res) => {
    StorageModel.getAllStorages((error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
      if(results.length === 0){
        res.status(404).send({ error: 'storages not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };
  
  const getStorageById = (req, res) => {
    const { storageid } = req.params;
    StorageModel.getStorageById(storageid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'storage not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

const addStorage = (req, res) => {

    const storage = req.body;
  
    StorageModel.getStorageBySize(storage.storage_size, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }
  
      if (results.length > 0) {
          res.status(409).send({ error: 'This storage is already exists' });
          return;
      }
  
      StorageModel.addStorage(storage, (error, storageId) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (!storageId) {
        res.status(404).send({ error: 'Failed to create storage' });
        return;
      }
  
      res.status(200).send({ message: 'storage created successfully', storageId });
    });
  });
  };

  const updateStorage = (req, res) => {
    const { storageid } = req.params;
    const storage = req.body;
  
    StorageModel.getStorageById(storageid, (error, existingStorage) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (!existingStorage[0]) {
        res.status(404).send({ error: 'storage not found' });
        return;
      }
  
      if (storage.storage_size && storage.storage_size !== existingStorage[0].storage_size) { 
  
  
        StorageModel.getStorageBySize(storage.storage_size, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
  
            if (results.length > 0) {
                res.status(409).send({ error: 'this this storage size is already exists' });
                return;
            }
  
            updateExistingStorage(storage, storageid);
        });
    } else {
        updateExistingStorage(storage, storageid);
    }
  });
  
  function updateExistingStorage(storage, storageid) {
    StorageModel.updateStorage(storage, storageid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }
  
        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'color not found or no changes made' });
            return;
        }
  
        res.status(200).send({ message: 'storeage updated successfully' });
    });
  }
  };
  
  const updateStorageStatus = (req, res) => {
    const { storageid } = req.params;
    const { status } = req.body;
  
    StorageModel.getStorageById(storageid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'storage not found' });
        return;
      }
  
      StorageModel.updateStorageStatus(storageid, status, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error updating status in the database' });
          return;
        }
  
        res.status(200).send({ message: 'Status updated successfully' });
      });
    });
  };
  
  const deleteStorage = (req, res) => {
    const { storageid } = req.params;
  
    StorageModel.getStorageById(storageid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'storage not found' });
        return;
      }
  
      StorageModel.deleteStorage(storageid, 1, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error updating deletion in the database' });
          return;
        }
  
        res.status(200).send({ message: 'storage deleted successfully' });
      });
    });
  };
  
  const deleteStorages = (req, res) => {
    const { storageids } = req.body;
  
    if (!Array.isArray(storageids) || storageids.length === 0) {
      res.status(400).send({ error: 'Invalid storage IDs' });
      return;
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const storageid of storageids) {
      StorageModel.getStorageById(storageid, (error, results) => {
        if (error) {
          console.error(`Error fetching storage with ID ${storageid}: ${error}`);
          failCount++;
        } else if (results.length === 0) {
          console.log(`storage with ID ${storageid} not found`);
          failCount++;
        } else {
          StorageModel.deleteStorage(storageid, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              console.error(`Error deleting storage with ID ${storageid}: ${deleteError}`);
              failCount++;
            } else {
              successCount++;
              console.log(`storage with ID ${storageid} deleted successfully`);
            }
  
            // Check if all deletions have been processed
            if (successCount + failCount === storageids.length) {
              const totalCount = storageids.length;
              res.status(200).send({
                totalCount,
                successCount,
                failCount,
              });
            }
          });
        }
  
        // Check if all colors have been processed
        if (successCount + failCount === storageids.length) {
          const totalCount = storageids.length;
          res.status(200).send({
            totalCount,
            successCount,
            failCount,
          });
        }
      });
    }
  };

module.exports = {
    addStorage,
    getAllStorages,
    getStorageById,
    updateStorage,
    updateStorageStatus,
    deleteStorage,
    deleteStorages
  };