const AssignPermissionModel = require('./PermissionGroupModel');

const getAllAssignPermissions = (req, res) => {
  AssignPermissionModel.getAllAssignPermissions((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getAssignPermissionById = (req, res) => {
  const { assignPermissionId } = req.params;
  AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    res.status(200).send(results);
  });
};



const addAssignPermission = (req, res) => {
  const assignpermission = req.body;

    AssignPermissionModel.addAssignPermission(assignpermission, (error, assignPermissionId) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (!assignPermissionId) {
        res.status(404).send({ error: 'Failed to assign permission' });
        return;
      }

      res.status(200).send({ message: 'permission assign successfully', assignPermissionId });
    });

};
//fghidslflhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
const updateAssignPermission = (req, res) => {
  const { assignPermissionId } = req.params;
  const assignPermission = req.body;

  AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, existingPermission) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingPermission[0]) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    if (assignPermission.permission_code && assignPermission.permission_code !== existingPermission[0].permission_code) { 


      AssignPermissionModel.getPermissionByCode(assignPermission.permission_code, (error, results) => {
          if (error) {
              res.status(500).send({ error: 'Error fetching data from the database' });
              return;
          }

          if (results.length > 0) {
              res.status(409).send({ error: 'this permission name is already exists' });
              return;
          }

          updateExistingPermission(assignPermission, assignPermissionId);
      });
  } else {
      updateExistingPermission(assignPermission, assignPermissionId);
  }
});

function updateExistingPermission(assignPermission, assignPermissionId) {
  AssignPermissionModel.updateAssignPermission(assignPermission, assignPermissionId, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send({ error: 'permission not found or no changes made' });
          return;
      }

      res.status(200).send({ message: 'permission updated successfully' });
  });
}
};

//////////////////////////////////////////////////////////////

const updateAssignPermissionStatus = (req, res) => {
  const { assignPermissionId } = req.params;
  const { status } = req.body;

  AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    AssignPermissionModel.updateAssignPermissionStatus(assignPermissionId, status, (error, updateResult) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteAssignPermission = (req, res) => {
  const { assignPermissionId } = req.params;

  AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Assign permission not found' });
      return;
    }

    AssignPermissionModel.deleteAssignPermission(assignPermissionId, 1, (error, deleteResult) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Assign permission deleted successfully' });
    });
  });
};

const deleteAssignPermissions = (req, res) => {
  const { assignPermissionIds } = req.body;

  if (!Array.isArray(assignPermissionIds) || assignPermissionIds.length === 0) {
    res.status(400).send({ error: 'Invalid assign permission IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const assignPermissionId of assignPermissionIds) {
    AssignPermissionModel.getAssignPermissionById(assignPermissionId, (error, results) => {
      if (error || results.length === 0) {
        failCount++;
      } else {
        AssignPermissionModel.deleteAssignPermission(assignPermissionId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            failCount++;
          } else {
            successCount++;
          }

          // Check if all deletions have been processed
          if (successCount + failCount === assignPermissionIds.length) {
            const totalCount = assignPermissionIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all assign permissions have been processed
      if (successCount + failCount === assignPermissionIds.length) {
        const totalCount = assignPermissionIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteAssignPermission = (req, res) => {
  const { assignPermissionId } = req.params;

  AssignPermissionModel.permanentDeleteAssignPermission(assignPermissionId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting assign permission from the database' });
      return;
    }

    res.status(200).send({ message: 'Assign permission permanently deleted successfully' });
  });
};

module.exports = {
  getAllAssignPermissions,
  getAssignPermissionById,
  addAssignPermission,
  updateAssignPermission,
  updateAssignPermissionStatus,
  deleteAssignPermission,
  permanentDeleteAssignPermission,
  deleteAssignPermissions,
};
