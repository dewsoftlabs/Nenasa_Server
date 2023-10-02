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
  
    router.post('/create', authorizeAccessControll, addRoute);
    router.get('/all', authenticateToken, getAllRoutes);
    router.get('/:routeId', authorizeAccessControll, getRouteById);
    router.delete('/delete/:routeId', authorizeAccessControll, deleteRoute);
    router.put('/delete', authorizeAccessControll, deleteRoutes);
    router.put('/update/:routeId', authorizeAccessControll, updateRoute);
  
    return router;
  };