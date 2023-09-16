const TargetModel = require("./TargetModel");

const getAllTargets = (req, res) => {
    TargetModel.getAllTargets((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getTargetById = (req, res) => {
    const { target_id } = req.params;
    TargetModel.getTargetById(target_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Target not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addTarget = (req, res) => {
    const target = req.body;
  
    TargetModel.getTargetByAmount(target.target_amount, (error, results) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (results.length > 0) {
        res.status(409).send({ error: "This Target Amount is already exists" });
        return;
      }
  
      TargetModel.addTarget(target, (error, target_id) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (!target_id) {
          res.status(404).send({ error: "Failed to create Target" });
          return;
        }
  
        res.status(200).send({ message: "Target created successfully", target_id });
      });
    });
  };

  const updateTarget = (req, res) => {
    const { target_id } = req.params;
    const target = req.body;
  
    TargetModel.getTargetById(target_id, (error, existingtarget) => {
      if (error) {
        res.status(500).send({ error: "Error fetching data from the database" });
        return;
      }
  
      if (!existingtarget[0]) {
        res.status(404).send({ error: "Target not found" });
        return;
      }
  
      if (target.target_amount && target.target_amount !== existingtarget[0].target_amount) {
        TargetModel.getTargetByAmount(target.target_amount, (error, results) => {
          if (error) {
            res
              .status(500)
              .send({ error: "Error fetching data from the database" });
            return;
          }
  
          if (results.length > 0) {
            res.status(409).send({ error: "This Target Amount is already exists" });
            return;
          }
  
          updateExistingTarget(target, target_id);
        });
      } else {
        updateExistingTarget(target, target_id);
      }
    });
  
    function updateExistingTarget(target, target_id) {
      TargetModel.updateTarget(target, target_id, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }
  
        if (results.affectedRows === 0) {
          res.status(404).send({ error: "Target not found or no changes made" });
          return;
        }
  
        res.status(200).send({ message: "Target updated successfully" });
      });
    }
  };

  const deleteTarget = (req, res) => {
    const { target_id } = req.params;

    TargetModel.getTargetById(target_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Target not found' });
            return;
        }

        TargetModel.deleteTarget(target_id, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Target deleted successfully' });
        });
    });
};

const deleteTargets = (req, res) => {
    const { targetIds } = req.body;

    if (!Array.isArray(targetIds) || targetIds.length === 0) {
        res.status(400).send({ error: 'Invalid target IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const target_id of targetIds) {
        TargetModel.getTargetById(target_id, (error, results) => {
            if (error) {
                console.error(`Error fetching target with ID ${target_id}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Target with ID ${target_id} not found`);
                failCount++;
            } else {
                TargetModel.deleteTarget(target_id, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting target with ID ${target_id}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Target with ID ${target_id} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === targetIds.length) {
                        const totalCount = targetIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === targetIds.length) {
                const totalCount = targetIds.length;
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
    addTarget,
    getAllTargets,
    getTargetById,
    updateTarget,
    deleteTarget,
    deleteTargets,
}