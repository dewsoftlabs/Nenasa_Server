const { connection } = require("../../../config/connection");

const RouteModel = {
  getRouteById(routeId, callback) {
    connection.query("SELECT * FROM route WHERE routeid = ? AND is_delete = 0",[routeId], callback );
  },

  getAllRoutes(callback) {
    connection.query("SELECT * FROM route WHERE is_delete = 0", callback);
  },

  getRouteByName(route_name, callback) {
    connection.query("SELECT * FROM route WHERE route_name = ? AND is_delete = 0",[route_name],callback);
  },

  addRoute(route, callback) {
    const { route_name , userid } = route;
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;
    const activeValues = 0;

    const query = "INSERT INTO route (route_name, userid ,trndate, is_delete) VALUES (?, ?, ?,?)";
    const values = [route_name, userid, trndate, activeValues, defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const routeId = results.insertId;
      callback(null, routeId);
    });
  },

  updateRoute(route, routeId, callback) {
    const { route_name } = route;
    const query = "UPDATE route SET route_name = ? , userid = ? WHERE routeid = ?";
    const values = [route_name, routeId];
    connection.query(query, values, callback);
  },

  deleteRoute(routeId, value, callback) {
    const query = "UPDATE route SET is_delete = ? WHERE routeid = ?";
    const values = [value, routeId];

    connection.query(query, values, callback);
  },

  deleteRoutes(routeIds, callback) {
    if (!Array.isArray(routeIds)) {
      routeIds = [routeIds]; // Convert to array if it's a single user ID
    }

    let successCount = 0;
    let failCount = 0;

    for (const routeId of routeIds) {
      RouteModel.getRouteById(routeId, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          RouteModel.deleteCategory(routeId, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              failCount++;
            } else {
              successCount++;
            }

            checkCompletion();
          });
        }
      });
    }

    function checkCompletion() {
      const totalCount = routeIds.length;
      if (successCount + failCount === totalCount) {
        if (typeof callback === "function") {
          // Check if callback is provided and is a function
          callback(null, {
            totalCount,
            successCount,
            failCount,
          });
        }
      }
    }
  },

  permanentDeleteRoute(routeId, callback) {
    const query = "DELETE FROM route WHERE routeid = ?";
    const values = [routeId];

    connection.query(query, values, callback);
  },

  routeById(routeId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM route WHERE routeid = ?",
        [routeId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};

module.exports = RouteModel;
