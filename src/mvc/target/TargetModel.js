const { connection } = require("../../../config/connection");

const TargetModel = {

    getTargetByAmount(target_amount, callback) {
        connection.query("SELECT * FROM target WHERE target_amount = ? AND is_delete = 0",[target_amount],callback);
    },

    getTargetById(target_id, callback) {
        connection.query("SELECT * FROM target WHERE target_id = ? AND is_delete = 0",[target_id], callback );
      },

    getAllTargets(callback) {
        connection.query("SELECT * FROM target WHERE is_delete = 0", callback);
    },

    addTarget(target,callback){

        const {target_amount , target_period} = target;
        const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const defaultValues = 0;

        const query = "INSERT INTO target (target_amount, target_period ,trndate, is_delete) VALUES (?, ?, ?,?)";
        const values = [target_amount, target_period, trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
              callback(error, null);
              return;
            }
      
            const target_id = results.insertId;
            callback(null, target_id);
        });

    },

    updateTarget(target, target_id, callback) {
        const { target_amount, target_period } = target;
        const query = "UPDATE target SET target_amount = ? , target_period = ? WHERE target_id = ?";
        const values = [target_amount, target_period, target_id];
        connection.query(query, values, callback);
      },

      deleteTarget(target_id, value, callback) {
        const query = "UPDATE target SET is_delete = ? WHERE target_id = ?";
        const values = [value, target_id];
    
        connection.query(query, values, callback);
      },
}

module.exports = TargetModel;