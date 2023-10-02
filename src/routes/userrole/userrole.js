const express = require('express');
const {
  getAllUserRoles,
  getUserRoleById,
  addUserRole,
  updateUserRole,
  updateUserRoleStatus,
  deleteUserRole,
  permanentDeleteUserRole,
  deleteRoles,
  addPermissiontoUserRole,
  getAllAvailableUserRoles,
  permissionByroleid,
} = require('../../mvc/userrole/UserroleController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessSupoerAdmin, authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.get('/permissionByroleid/:userid/:userroleid', authenticateToken, permissionByroleid);

  //super admin only
  router.post('/create', authorizeAccessControll, addUserRole);
  router.put('/addpermissions/:userRoleId', authorizeAccessControll, addPermissiontoUserRole);
  router.get('/all', authenticateToken, getAllUserRoles);
  router.get('/availble/all', authorizeAccessControll, getAllAvailableUserRoles);
  router.get('/:userRoleId', authorizeAccessControll, getUserRoleById);
  router.put('/status/:userRoleId', authorizeAccessControll, updateUserRoleStatus);
  router.delete('/delete/:userRoleId', authorizeAccessControll, deleteUserRole);
  router.put('/delete', authorizeAccessControll, deleteRoles);
  router.put('/update/:userRoleId', authorizeAccessControll, updateUserRole);

  return router;
};
