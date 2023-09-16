const { connection } = require("../../../config/connection");

const TermsModel = {

    getTermsByAmount(no_of_terms, callback) {
        connection.query("SELECT * FROM terms WHERE no_of_terms = ? AND is_delete = 0",[no_of_terms],callback);
    },

    getTermsById(terms_id, callback) {
        connection.query("SELECT * FROM terms WHERE terms_id = ? AND is_delete = 0",[terms_id], callback );
      },

    getAllTerms(callback) {
        connection.query("SELECT * FROM terms WHERE is_delete = 0", callback);
    },

    addTerms(terms,callback){

        const { no_of_terms} = terms;
        const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const defaultValues = 0;

        const query = "INSERT INTO terms (no_of_terms ,trndate, is_delete) VALUES (?, ?, ?)";
        const values = [no_of_terms , trndate, defaultValues];

        connection.query(query, values, (error, results) => {
            if (error) {
              callback(error, null);
              return;
            }
      
            const terms_id = results.insertId;
            callback(null, terms_id);
        });

    },

    updateTerms(terms, terms_id, callback) {
        const { no_of_terms } = terms;
        const query = "UPDATE terms SET no_of_terms = ? WHERE terms_id = ?";
        const values = [no_of_terms, terms_id];
        connection.query(query, values, callback);
      },

      deleteTerm(terms_id, value, callback) {
        const query = "UPDATE terms SET is_delete = ? WHERE terms_id = ?";
        const values = [value, terms_id];
    
        connection.query(query, values, callback);
      },
}

module.exports = TermsModel;