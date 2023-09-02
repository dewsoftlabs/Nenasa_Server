const express = require('express');
const {
  getAllPermissions,
  getPermissionById,
  addPermission,
  updatePermission,
  permanentDeletePermission,
} = require('../../mvc/permission/PermissionController');
const { authorizeAccessSupoerAdmin } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  router.post('/create', authorizeAccessSupoerAdmin, addPermission);
  router.get('/all', authorizeAccessSupoerAdmin, getAllPermissions);
  router.get('/:permissionId', authorizeAccessSupoerAdmin, getPermissionById);
  router.put('/update/:permissionId', authorizeAccessSupoerAdmin, updatePermission);
  router.delete('/delete/permanent/:permissionId', authorizeAccessSupoerAdmin, permanentDeletePermission);

  return router;
};
