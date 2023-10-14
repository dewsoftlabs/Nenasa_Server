const { connection } = require("../../../config/connection");

const InstallementModel = {
  getInstallementById(installement_id, callback) {
    connection.query(
      "SELECT * FROM installement WHERE installement_id = ? AND is_delete = 0",
      [installement_id],
      callback
    );
  },

  getAllInstallements(callback) {
    connection.query(
      "SELECT * FROM installement WHERE is_delete = 0",
      callback
    );
  },

  addInstallement(
    collection_id,
    installment_desc,
    installement_amount,
    userid,
    callback
  ) {
    const trndate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = 0;

    const query =
      "INSERT INTO installement (collection_id, installment_desc, installement_amount, paid_amount, installement_status, installement_paidDate, userid, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      collection_id,
      installment_desc,
      installement_amount,
      defaultValues,
      defaultValues,
      trndate,
      userid,
      defaultValues,
    ];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const installement_id = results.insertId;
      callback(null, installement_id);
    });
  },

  updateInstallement(installement, installement_id, callback) {
    const {
      collection_id,
      installment_desc,
      installement_amount,
      paid_amount,
      installement_status,
      installement_paidDate,
      userid,
    } = installement;
    const query =
      "UPDATE installement SET collection_id = ?, installment_desc = ?, installement_amount = ?, paid_amount = ?, installement_status = ?, installement_paidDate = ?, userid = ? WHERE installement_id = ?";
    const values = [
      collection_id,
      installment_desc,
      installement_amount,
      paid_amount,
      installement_status,
      installement_paidDate,
      userid,
      installement_id,
    ];

    connection.query(query, values, callback);
  },

  deleteInstallement(installement_id, value, callback) {
    const query =
      "UPDATE installement SET is_delete = ? WHERE installement_id = ?";
    const values = [value, installement_id];

    connection.query(query, values, callback);
  },

  perma_deleteInstallement(installement_id, callback) {
    const query = "DELETE FROM installement WHERE installement_id = ?";
    const values = [installement_id];

    connection.query(query, values, callback);
  },

  updateInstallementStatus(installement_id, installement_status, callback) {
    const query =
      "UPDATE installement SET installement_status = ? WHERE installement_id = ?";
    const values = [installement_status, installement_id];

    connection.query(query, values, callback);
  },
};

module.exports = InstallementModel;
