const { connection } = require("../../../config/connection");

const depositAccModel = {
  getdepositAccByAccNo(deposit_acc_no, callback) {
    connection.query("SELECT * FROM deposit_acc WHERE deposit_acc_no = ? AND is_delete = 0",[deposit_acc_no], callback );
  },

  getAlldepositAccs(callback) {
    connection.query("SELECT * FROM deposit_acc WHERE is_delete = 0", callback);
  },

  getdepositAccBycustId(customer_id, callback) {
    connection.query("SELECT * FROM deposit_acc WHERE customer_id = ? AND is_delete = 0",[customer_id],callback);
  },

  adddepositAcc(deposit_acc, callback) {
    const { customer_id, hold_startDate, hold_period } = deposit_acc;
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;
    const activeValues = 1;

    const query = "INSERT INTO deposit_acc ( customer_id , status ,hold_startDate , hold_period ,trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [customer_id, activeValues ,hold_startDate, hold_period , trndate,  defaultValues];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const depositAccId = results.insertId;
      callback(null, depositAccId);
    });
  },

  updatedepositAcc(deposit_acc, deposit_acc_no, callback) {
    const { hold_startDate, hold_period , customer_id } = deposit_acc;
    const query = "UPDATE deposit_acc SET hold_startDate = ? ,  hold_period = ? , customer_id = ? WHERE deposit_acc_no = ?";
    const values = [hold_startDate, hold_period, deposit_acc_no , customer_id];
    connection.query(query, values, callback);
  },

  updatestatus(deposit_acc_no, status, callback) {
    const query = 'UPDATE deposit_acc SET status = ? WHERE deposit_acc_no = ?';
    const values = [status, deposit_acc_no];

    connection.query(query, values, callback);
  },

  deletedepositAcc(deposit_acc_no, value, callback) {
    const query = "UPDATE deposit_acc SET is_delete = ? WHERE deposit_acc_no = ?";
    const values = [value, deposit_acc_no];

    connection.query(query, values, callback);
  },

  deletedepositAccounts(depositAccIds, callback) {
    if (!Array.isArray(depositAccIds)) {
      depositAccIds = [depositAccIds]; // Convert to array if it's a single user ID
    }

    let successCount = 0;
    let failCount = 0;

    for (const deposit_acc_no of depositAccIds) {
      depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, results) => {
        if (error || results.length === 0) {
          failCount++;
          checkCompletion();
        } else {
          depositAccModel.deletedepositAcc(deposit_acc_no, 1, (deleteError, deleteResult) => {
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
      const totalCount = depositAccIds.length;
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

  permanentDeletedepoAcc(deposit_acc_no, callback) {
    const query = "DELETE FROM deposit_acc WHERE deposit_acc_no = ?";
    const values = [deposit_acc_no];

    connection.query(query, values, callback);
  },

  depoAccById(deposit_acc_no) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM deposit_acc WHERE deposit_acc_no = ?",
        [deposit_acc_no],
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

module.exports = depositAccModel;
