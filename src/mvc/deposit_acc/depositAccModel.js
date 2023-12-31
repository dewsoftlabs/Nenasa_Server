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

  getdepositAccByNIC(customer_nic, callback) {
    connection.query("SELECT * FROM customer AS c INNER JOIN deposit_acc AS d ON c.customer_id = d.customer_id WHERE c.customer_nic = ? AND d.is_delete = 0",[customer_nic],callback);
  },

  adddepositAcc(customer_id, deposit_acc, callback) {
    const {
      depositType_id,
      hold_startDate,
      hold_endDate,
      branchid
    } = deposit_acc;
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;
    const activeValues = 1;
  
    const query =
      "INSERT INTO deposit_acc (customer_id, depositType_id, deposit_status, depositbalance, hold_startDate, hold_endDate, branchid, lastUpdate, trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)";
    const values = [
      customer_id,
      depositType_id,
      defaultValues,
      defaultValues,
      hold_startDate,
      hold_endDate,
      branchid
    ];
  
    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }
  
      const depositAccId = results.insertId;
      callback(null, depositAccId);
    });
  },
  

  adddepositAccDirect(customer_id, deposit_acc, callback) {
    const { depositType_id , branchid } = deposit_acc;
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;
    const activeValues = 1;
    const holdPeriod = null;
    const holdStart = null;

    const query = "INSERT INTO deposit_acc ( customer_id , depositType_id , deposit_status ,hold_startDate , hold_period , branchid , trndate, is_delete) VALUES (?, ?, ?, ?, ?, ?, ? , ?)";
    const values = [customer_id, depositType_id , activeValues ,holdStart, holdPeriod , branchid , trndate,  defaultValues];

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
    const { hold_startDate, hold_period , customer_id , depositType_id , branchid} = deposit_acc;
    const query = "UPDATE deposit_acc SET hold_startDate = ? ,  hold_period = ? , customer_id = ? , depositType_id = ? , branchid = ? WHERE deposit_acc_no = ?";
    const values = [hold_startDate, hold_period, deposit_acc_no , customer_id , depositType_id , branchid];
    connection.query(query, values, callback);
  },

  updatestatus(deposit_acc_no, deposit_status, callback) {
    const query = 'UPDATE deposit_acc SET deposit_status = ? WHERE deposit_acc_no = ?';
    const values = [deposit_status, deposit_acc_no];

    connection.query(query, values, callback);
  },

  deletedepositAcc(deposit_acc_no, value, callback) {
    const query = "UPDATE deposit_acc SET is_delete = ? WHERE deposit_acc_no = ?";
    const values = [value, deposit_acc_no];

    connection.query(query, values, callback);
  },
  
  perma_deletedepositAcc(deposit_acc_no, callback) {
    const query = "DELETE FROM deposit_acc WHERE deposit_acc_no = ?";
    const values = [deposit_acc_no];
  
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
