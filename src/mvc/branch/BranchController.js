const BranchModel = require('./BranchModel');

const getAllBranches = (req, res) => {
  BranchModel.getAllBranches((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getBranchById = (req, res) => {
  const { branchId } = req.params;
  BranchModel.getBranchById(branchId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Branch not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addBranch = (req, res) => {
  const branch = req.body;

  BranchModel.getBranchByName(branch.branch_name, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ error: 'This Branch is already exists' });
      return;
    }

    BranchModel.addBranch(branch, (error, branchId) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (!branchId) {
        res.status(404).send({ error: 'Failed to create branch' });
        return;
      }

      res.status(200).send({ message: 'Branch created successfully', branchId });
    });
  });
};

const updateBranch = (req, res) => {
  const { branchId } = req.params;
  const branch = req.body;

  BranchModel.getBranchById(branchId, (error, existingBranch) => {

    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingBranch[0]) {
      res.status(404).send({ error: 'branch not found' });
      return;
    }

    // Check if the provided phone number is already associated with another user
    if (branch.branch_name && branch.branch_name !== existingBranch[0].branch_name) { 


      BranchModel.getBranchByName(branch.branch_name, (error, results) => {
          if (error) {
              res.status(500).send({ error: 'Error fetching data from the database' });
              return;
          }

          if (results.length > 0) {
              res.status(409).send({ error: 'this branch name is already exists' });
              return;
          }

          updateExistingBranch(branch, branchId);
      });
  } else {
      updateExistingBranch(branch, branchId);
  }
});

function updateExistingBranch(branch, branchId) {
  BranchModel.updateBranch(branch, branchId, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send({ error: 'branch not found or no changes made' });
          return;
      }

      res.status(200).send({ message: 'branch updated successfully' });
  });
}
};


const updateBranchStatus = (req, res) => {
  const { branchId } = req.params;
  const { status } = req.body;

  BranchModel.getBranchById(branchId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Branch not found' });
      return;
    }

    BranchModel.updateBranchStatus(branchId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteBranch = (req, res) => {
  const { branchId } = req.params;

  BranchModel.getBranchById(branchId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Branch not found' });
      return;
    }

    BranchModel.deleteBranch(branchId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Branch deleted successfully' });
    });
  });
};

const deleteBranches = (req, res) => {
  const { branchIds } = req.body;

  if (!Array.isArray(branchIds) || branchIds.length === 0) {
    res.status(400).send({ error: 'Invalid branch IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const branchId of branchIds) {
    BranchModel.getBranchById(branchId, (error, results) => {
      if (error) {
        console.error(`Error fetching branch with ID ${branchId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Branch with ID ${branchId} not found`);
        failCount++;
      } else {
        BranchModel.deleteBranch(branchId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting branch with ID ${branchId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Branch with ID ${branchId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === branchIds.length) {
            const totalCount = branchIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all branches have been processed
      if (successCount + failCount === branchIds.length) {
        const totalCount = branchIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteBranch = (req, res) => {
  const { branchId } = req.params;

  BranchModel.permanentDeleteBranch(branchId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting branch from the database' });
      return;
    }

    res.status(200).send({ message: 'Branch permanently deleted successfully' });
  });
};

module.exports = {
  getAllBranches,
  getBranchById,
  addBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
  permanentDeleteBranch,
  deleteBranches,
};
