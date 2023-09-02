const express = require('express');
const {
  getAllAssignPermissions,
  getAssignPermissionById,
  addAssignPermission,
  updateAssignPermission,
  updateAssignPermissionStatus,
  deleteAssignPermission,
  permanentDeleteAssignPermission,
  deleteAssignPermissions,
} = require('../../mvc/permission_group/PermissionGroupController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessSupoerAdmin } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessSupoerAdmin, addAssignPermission);
  router.get('/all', authorizeAccessSupoerAdmin, getAllAssignPermissions);
  router.get('/:assignPermissionId', authorizeAccessSupoerAdmin, getAssignPermissionById);
  router.put('/status/:assignPermissionId', authorizeAccessSupoerAdmin, updateAssignPermissionStatus);
  router.put('/delete/:assignPermissionId', authorizeAccessSupoerAdmin, deleteAssignPermission);
  router.put('/delete', authorizeAccessSupoerAdmin, deleteAssignPermissions);
  router.put('/update/:assignPermissionId', authorizeAccessSupoerAdmin, updateAssignPermission);

  return router;
};
