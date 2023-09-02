const UserRoleModel = require('./UserroleModel');
const PermissionGroupView = require('../permission_group/PermissionGroupView');

const getAllUserRoles = (req, res) => {
  UserRoleModel.getAllUserRoles((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const permissionByroleid = (req, res) => {
  const { userid, userroleid } = req.params;
  
  UserRoleModel.getUserById(userid, (error, results) => {
    if (error) {
      console.error('Error fetching data from the database:', error);
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }
    
    if (results.length === 0) {
      res.status(404).send({ error: 'User not found' });
      return;
    }
    
    // Access the user role ID from the results object
    const userRoleIds = results[0].userroleid;
    console.log("userRoleId", userRoleIds)
    console.log("userroleid", userroleid)

    // Check if the user has the correct user role
    if (userRoleIds != userroleid) {
      res.status(404).send({ error: 'UserRole is wrong. This user does not have this role' });
      return;
    }

    UserRoleModel.getUserPermission(userRoleIds, userid, (error, permissionResults) => {
      if (error) {
        console.error('Error fetching data from the database:', error);
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (permissionResults.length === 0) {
        res.status(404).send({ error: 'User permissions not found' });
        return;
      }

      if (Array.isArray(permissionResults) && permissionResults.length > 0) {
        const renderpermissionGroupArray = PermissionGroupView.renderpermissionGroup(permissionResults);
        res.status(200).send(renderpermissionGroupArray);
        return;
    }
    

      res.status(200).send({ message: "not found" });

      // // Assuming you want to render and send the first permission in the results
      // const userPermission = permissionResults[0];
      // console.log(userPermission);

      // // Render the permission using the PermissionGroupView
      // const permissionData = PermissionGroupView.renderPermission(userPermission);

      // // Instead of sending directly, use a view to respond with the data
      // PermissionGroupView.renderPermission(res, permissionData);
    });
  });
};



const getUserRoleById = (req, res) => {
  const { userRoleId } = req.params;
  UserRoleModel.getUserRoleById(userRoleId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'UserRole not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addUserRole = (req, res) => {
  const userRole = req.body;

  UserRoleModel.addUserRole(userRole, (error, userRoleId) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!userRoleId) {
      res.status(404).send({ error: 'Failed to create user role' });
      return;
    }

    res.status(200).send({ message: 'UserRole created successfully', userRoleId });
  });
};

const updateUserRole = (req, res) => {
  const { userRoleId } = req.params;
  const userRole = req.body;

  UserRoleModel.getUserRoleById(userRoleId, (error, existingUserrole) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingUserrole[0]) {
      res.status(404).send({ error: 'UserRole not found' });
      return;
    }

    if (userRole.role && userRole.role !== existingUserrole[0].role) { 


      UserRoleModel.getUserByname(userRole.role, (error, results) => {

          if (error) {
              res.status(500).send({ error: 'Error fetching data from the database' });
              return;
          }

          if (results.length > 0) {
              res.status(409).send({ error: 'this user role is already exists' });
              return;
          }

          updateExistingUserrole(userRole, userRoleId);
      });
  } else {
      updateExistingUserrole(userRole, userRoleId);
  }
});

function updateExistingUserrole(userRole, userRoleId) {
  UserRoleModel.updateUserRole(userRole, userRoleId, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send({ error: 'user role not found or no changes made' });
          return;
      }

      res.status(200).send({ message: 'user role updated successfully' });
  });
}
};

const updateUserRoleStatus = (req, res) => {
  const { userRoleId } = req.params;
  const { status } = req.body;

  UserRoleModel.getUserRoleById(userRoleId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'UserRole not found' });
      return;
    }

    UserRoleModel.updateUserRoleStatus(userRoleId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteUserRole = (req, res) => {
  const { userRoleId } = req.params;

  UserRoleModel.getUserRoleById(userRoleId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'UserRole not found' });
      return;
    }

    UserRoleModel.deleteUserRole(userRoleId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'UserRole deleted successfully' });
    });
  });
};

const deleteRoles = (req, res) => {
  const { userRoleIds } = req.body;

  if (!Array.isArray(userRoleIds) || userRoleIds.length === 0) {
    res.status(400).send({ error: 'Invalid user role IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const userRoleId of userRoleIds) {
    UserRoleModel.getUserRoleById(userRoleId, (error, results) => {
      if (error) {
        console.error(`Error fetching user role with ID ${userRoleId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`User role with ID ${userRoleId} not found`);
        failCount++;
      } else {
        UserRoleModel.deleteUserRole(userRoleId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting user role with ID ${userRoleId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`User role with ID ${userRoleId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === userRoleIds.length) {
            const totalCount = userRoleIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all user roles have been processed
      if (successCount + failCount === userRoleIds.length) {
        const totalCount = userRoleIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteUserRole = (req, res) => {
  const { userRoleId } = req.params;

  UserRoleModel.permanentDeleteUserRole(userRoleId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting user role from the database' });
      return;
    }

    res.status(200).send({ message: 'UserRole permanently deleted successfully' });
  });
};

module.exports = {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  deleteUserRole,
  permanentDeleteUserRole,
  deleteRoles,
  permissionByroleid,
};
