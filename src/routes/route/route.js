const express = require('express');
const {
    getAllRoutes,
    getRouteById,
    addRoute,
    updateRoute,
    deleteRoute,
    permanentDeleteRoute,
    deleteRoutes
} = require('../../mvc/route/RouteController');
const { authenticateToken } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();
  
    router.post('/create', authenticateToken, addRoute);
    router.get('/all', authenticateToken, getAllRoutes);
    router.get('/:routeId', authenticateToken, getRouteById);
    router.delete('/delete/:routeId', authenticateToken, deleteRoute);
    router.put('/delete', authenticateToken, deleteRoutes);
    router.put('/update/:routeId', authenticateToken, updateRoute);
  
    return router;
  };