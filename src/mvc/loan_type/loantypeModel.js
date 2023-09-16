const { connection } = require("../../../config/connection");

const loantypeModel = {

    getTypeByName(loantype_name, callback) {
        connection.query("SELECT * FROM loan_type WHERE loantype_name = ? AND is_delete = 0",[loantype_name],callback);
    },

    getTypeById(loantype_id, callback) {
        connection.query("SELECT * FROM loan_type WHERE loantype_id = ? AND is_delete = 0",[loantype_id], callback );
      },

    getAllTypes(callback) {
        connection.query("SELECT * FROM loan_type WHERE is_delete = 0", callback);
    },

    addloantype(type,callback){

        const { loantype_name} = type;
        const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const defaultValues = 0;

        const query = "INSERT INTO loan_type (loantype_name ,trndate, is_delete) VALUES (?, ?, ?)";
        const values = [loantype_name , trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
              callback(error, null);
              return;
            }
      
            const loantype_id = results.insertId;
            callback(null, loantype_id);
        });

    },

    updateLoanType(type, loantype_id, callback) {
        const { loantype_name } = type;
        const query = "UPDATE loan_type SET loantype_name = ? WHERE loantype_id = ?";
        const values = [loantype_name, loantype_id];
        connection.query(query, values, callback);
      },

      deleteLoanType(loantype_id, value, callback) {
        const query = "UPDATE loan_type SET is_delete = ? WHERE loantype_id = ?";
        const values = [value, loantype_id];
    
        connection.query(query, values, callback);
      },

}

module.exports = loantypeModel;