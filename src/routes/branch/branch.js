const express = require('express');
const {
  getAllBranches,
  getBranchById,
  addBranch,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
  permanentDeleteBranch,
  deleteBranches
} = require('../../mvc/branch/BranchController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
  const router = express.Router();

  //admin only
  router.post('/create', authorizeAccessControll, addBranch);
  router.get('/all', authorizeAccessControll, getAllBranches);
  router.get('/:branchId', authorizeAccessControll, getBranchById);
  router.put('/status/:branchId', authorizeAccessControll, updateBranchStatus);
  router.put('/delete/:branchId', authorizeAccessControll, deleteBranch);
  router.put('/delete', authorizeAccessControll, deleteBranches);
  router.put('/update/:branchId', authorizeAccessControll, updateBranch);

  return router;
};
