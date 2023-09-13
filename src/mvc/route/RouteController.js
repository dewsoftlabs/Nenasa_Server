const RouteModel = require("./RouteModel");

const getAllRoutes = (req, res) => {
    RouteModel.getAllRoutes((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getRouteById = (req, res) => {
    const { routeId } = req.params;
    RouteModel.getRouteById(routeId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Route not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addRoute = (req, res) => {
  const route = req.body;

  RouteModel.getRouteByName(route.route_name, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ error: "This Route is already exists" });
      return;
    }

    RouteModel.addRoute(route, (error, routeId) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (!routeId) {
        res.status(404).send({ error: "Failed to create route" });
        return;
      }

      res.status(200).send({ message: "Route created successfully", routeId });
    });
  });
};

const updateRoute = (req, res) => {
  const { routeId } = req.params;
  const route = req.body;

  RouteModel.getRouteById(routeId, (error, existingroute) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!existingroute[0]) {
      res.status(404).send({ error: "Route not found" });
      return;
    }

    if (route.route_name && route.route_name !== existingroute[0].route_name) {
      RouteModel.getRouteByName(route.route_name, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: "This Route name is already exists" });
          return;
        }

        updateExistingRoute(route, routeId);
      });
    } else {
      updateExistingRoute(route, routeId);
    }
  });

  function updateExistingRoute(route, routeId) {
    RouteModel.updateRoute(route, routeId, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: "Route not found or no changes made" });
        return;
      }

      res.status(200).send({ message: "Route updated successfully" });
    });
  }
};

const deleteRoute = (req, res) => {
    const { routeId } = req.params;

    RouteModel.getRouteById(routeId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Route not found' });
            return;
        }

        RouteModel.deleteRoute(routeId, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Route deleted successfully' });
        });
    });
};

const deleteRoutes = (req, res) => {
    const { routeIds } = req.body;

    if (!Array.isArray(routeIds) || routeIds.length === 0) {
        res.status(400).send({ error: 'Invalid route IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const routeId of routeIds) {
        RouteModel.getRouteById(routeId, (error, results) => {
            if (error) {
                console.error(`Error fetching route with ID ${routeId}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Route with ID ${routeId} not found`);
                failCount++;
            } else {
                RouteModel.deleteRoute(routeId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting route with ID ${routeId}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Route with ID ${routeId} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === routeIds.length) {
                        const totalCount = routeIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === routeIds.length) {
                const totalCount = routeIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};

const permanentDeleteRoute = (req, res) => {
    const { routeId } = req.params;

    RouteModel.permanentDeleteRoute(routeId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting route from the database' });
            return;
        }

        res.status(200).send({ message: 'Route permanently deleted successfully' });
    });
};

module.exports = {
  addRoute,
  updateRoute,
  deleteRoute,
  deleteRoutes,
  permanentDeleteRoute,
  getAllRoutes,
  getRouteById
};
