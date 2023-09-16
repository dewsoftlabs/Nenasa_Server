const DepositTypeModel = require("./DepositTypeModel");

const getAllDepositTypes = (req, res) => {
    DepositTypeModel.getAllDepositTypes((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getDepositTypeById = (req, res) => {
    const { depositType_id } = req.params;
    DepositTypeModel.getDepositTypeById(depositType_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Deposit Type not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addDepositTypes = (req, res) => {
    const depo_types = req.body;
  
    DepositTypeModel.getDepositTypeByName(depo_types.depositType_name, (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (results.length > 0) {
        res.status(409).send({ error: "This Deposit Type is already exists" });
        return;
      }
  
      DepositTypeModel.addDepositTypes(depo_types, (error, depositType_id) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (!depositType_id) {
          res.status(404).send({ error: "Failed to create Deposit Type" });
          return;
        }
  
        res.status(200).send({ message: "Deposit Type created successfully", depositType_id });
      });
    });
  };

  const updateDepositTypes = (req, res) => {
    const { depositType_id } = req.params;
    const depo_types = req.body;
  
    DepositTypeModel.getDepositTypeById(depositType_id, (error, existingdepotypes) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (!existingdepotypes[0]) {
        res.status(404).send({ error: "Deposit Type not found" });
        return;
      }
  
      if (depo_types.depositType_name && depo_types.depositType_name !== existingdepotypes[0].depositType_name) {
        DepositTypeModel.getDepositTypeByName(depo_types.depositType_name, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }
  
          if (results.length > 0) {
            res.status(409).send({ error: "This Deposit Type is already exists" });
            return;
          }
  
          updateExistingDepositTypes(depo_types, depositType_id);
        });
      } else {
        updateExistingDepositTypes(depo_types, depositType_id);
      }
    });
  
    function updateExistingDepositTypes(depo_types, depositType_id) {
      DepositTypeModel.updateDepositTypes(depo_types, depositType_id, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (results.affectedRows === 0) {
          res.status(404).send({ error: "Deposit Type not found or no changes made" });
          return;
        }
  
        res.status(200).send({ message: "Deposit Type updated successfully" });
      });
    }
  };

  const deleteDepositType = (req, res) => {
    const { depositType_id } = req.params;

    DepositTypeModel.getDepositTypeById(depositType_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Deposit Type not found' });
            return;
        }

        DepositTypeModel.deleteDepositType(depositType_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Deposit Type deleted successfully' });
        });
    });
};

const deleteDepositTypes = (req, res) => {
    const { depoTypeIds } = req.body;

    if (!Array.isArray(depoTypeIds) || depoTypeIds.length === 0) {
        res.status(400).send({ error: 'Invalid Deposit Type IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const depoTypes_id of depoTypeIds) {
        DepositTypeModel.getDepositTypeById(depoTypes_id, (error, results) => {
            if (error) {
                console.error(`Error fetching deposit type with ID ${depoTypes_id}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Deposit Type with ID ${depoTypes_id} not found`);
                failCount++;
            } else {
                DepositTypeModel.deleteDepositType(depoTypes_id, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting deposit type with ID ${depoTypes_id}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Deposit Type with ID ${depoTypes_id} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === depoTypeIds.length) {
                        const totalCount = depoTypeIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === depoTypeIds.length) {
                const totalCount = depoTypeIds.length;
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
    getAllDepositTypes,
    getDepositTypeById,
    addDepositTypes,
    updateDepositTypes,
    deleteDepositType,
    deleteDepositTypes,
}