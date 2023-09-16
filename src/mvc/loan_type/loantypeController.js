const loantypeModel = require("./loantypeModel");

const getAllTypes = (req, res) => {
    loantypeModel.getAllTypes((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getTypeById = (req, res) => {
    const { loantype_id } = req.params;
    loantypeModel.getTypeById(loantype_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Loan Type not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addType = (req, res) => {
    const type = req.body;
  
    loantypeModel.getTypeByName(type.loantype_name, (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (results.length > 0) {
        res.status(409).send({ error: "This Loan Type is already exists" });
        return;
      }
  
      loantypeModel.addloantype(type, (error, loantype_id) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (!loantype_id) {
          res.status(404).send({ error: "Failed to create Loan Type" });
          return;
        }
  
        res.status(200).send({ message: "Loan Type created successfully", loantype_id });
      });
    });
  };

  const updateType = (req, res) => {
    const { loantype_id } = req.params;
    const type = req.body;
  
    loantypeModel.getTypeById(loantype_id, (error, existingtype) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (!existingtype[0]) {
        res.status(404).send({ error: "Loan Type not found" });
        return;
      }
  
      if (type.loantype_name && type.loantype_name !== existingtype[0].loantype_name) {
        loantypeModel.getTypeByName(type.loantype_name, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }
  
          if (results.length > 0) {
            res.status(409).send({ error: "This Loan Type is already exists" });
            return;
          }
  
          updateExistingType(type, loantype_id);
        });
      } else {
        updateExistingType(type, loantype_id);
      }
    });
  
    function updateExistingType(type, loantype_id) {
      loantypeModel.updateLoanType(type, loantype_id, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (results.affectedRows === 0) {
          res.status(404).send({ error: "Loan Type not found or no changes made" });
          return;
        }
  
        res.status(200).send({ message: "Loan Type updated successfully" });
      });
    }
  };

  const deleteType = (req, res) => {
    const { loantype_id } = req.params;

    loantypeModel.getTypeById(loantype_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Loan Type not found' });
            return;
        }

        loantypeModel.deleteLoanType(loantype_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Loan Type deleted successfully' });
        });
    });
};

const deleteTypes = (req, res) => {
    const { typeIds } = req.body;

    if (!Array.isArray(typeIds) || typeIds.length === 0) {
        res.status(400).send({ error: 'Invalid Loan Type IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const loantype_id of typeIds) {
        loantypeModel.getTypeById(loantype_id, (error, results) => {
            if (error) {
                console.error(`Error fetching loan type with ID ${loantype_id}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Loan type with ID ${loantype_id} not found`);
                failCount++;
            } else {
                loantypeModel.deleteLoanType(loantype_id, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting Loan Type with ID ${loantype_id}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Loan Type with ID ${loantype_id} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === typeIds.length) {
                        const totalCount = typeIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === typeIds.length) {
                const totalCount = typeIds.length;
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
    addType,
    updateType,
    deleteType,
    deleteTypes,
    getAllTypes,
    getTypeById,
}