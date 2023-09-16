const { connection } = require("../../../config/connection");

const DepositTypeModel = {

    getDepositTypeByName(depositType_name, callback) {
        connection.query("SELECT * FROM deposit_type WHERE depositType_name = ? AND is_delete = 0",[depositType_name],callback);
    },

    getDepositTypeById(depositType_id, callback) {
        connection.query("SELECT * FROM deposit_type WHERE depositType_id = ? AND is_delete = 0",[depositType_id], callback );
      },

    getAllDepositTypes(callback) {
        connection.query("SELECT * FROM deposit_type WHERE is_delete = 0", callback);
    },

    addDepositTypes(depo_types,callback){

        const { depositType_name , depositType_rate} = depo_types;
        const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const defaultValues = 0;

        const query = "INSERT INTO deposit_type (depositType_name ,depositType_rate , trndate, is_delete) VALUES (?, ?, ? , ?)";
        const values = [depositType_name , depositType_rate , trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
              callback(error, null);
              return;
            }
      
            const depositType_id = results.insertId;
            callback(null, depositType_id);
        });

    },

    updateDepositTypes(depo_types, depositType_id, callback) {
        const { depositType_name , depositType_rate } = depo_types;
        const query = "UPDATE deposit_type SET depositType_name = ? , depositType_rate = ? WHERE depositType_id = ?";
        const values = [depositType_name , depositType_rate, depositType_id];
        connection.query(query, values, callback);
      },

      deleteDepositType(depositType_id, value, callback) {
        const query = "UPDATE deposit_type SET is_delete = ? WHERE depositType_id = ?";
        const values = [value, depositType_id];
    
        connection.query(query, values, callback);
      },
}

module.exports = DepositTypeModel;