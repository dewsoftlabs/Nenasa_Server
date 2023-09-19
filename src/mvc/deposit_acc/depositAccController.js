const depositAccModel = require("./depositAccModel");

const getAlldepositAccs = (req, res) => {
    depositAccModel.getAlldepositAccs((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getdepositAccByAccNo = (req, res) => {
    const { deposit_acc_no } = req.params;
    depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Deposit Account not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addDepositAcc = (req, res) => {
  const deposit_acc = req.body;

  depositAccModel.getdepositAccBycustId(deposit_acc.customer_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ error: "This Deposit Account is already exists" });
      return;
    }

    depositAccModel.adddepositAccDirect(deposit_acc, (error, deposit_acc_no) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (!deposit_acc_no) {
        res.status(404).send({ error: "Failed to create Deposit Account" });
        return;
      }

      res.status(200).send({ message: "Deposit Account created successfully", deposit_acc_no });
    });
  });
};

const updateDepositAcc = (req, res) => {
  const { deposit_acc_no } = req.params;
  const deposit_acc = req.body;

  depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, existingdepoacc) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!existingdepoacc[0]) {
      res.status(404).send({ error: "Deposit Account not found" });
      return;
    }

    if (deposit_acc.customer_id && deposit_acc.customer_id !== existingdepoacc[0].customer_id) {
      depositAccModel.getdepositAccBycustId(deposit_acc.customer_id, (error, results) => {
        if (error) {
          res
            .status(500)
            .send({ error: "Error fetching data from the database" });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: "This Deposit Account is already exists" });
          return;
        }

        updateExistingDepositAcc(deposit_acc, deposit_acc_no);
      });
    } else {
      updateExistingDepositAcc(deposit_acc, deposit_acc_no);
    }
  });

  function updateExistingDepositAcc(deposit_acc, deposit_acc_no) {
    depositAccModel.updatedepositAcc(deposit_acc, deposit_acc_no, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error fetching data from the database" });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: "Deposit Account not found or no changes made" });
        return;
      }

      res.status(200).send({ message: "Deposit Account updated successfully" });
    });
  }
};

const deletedepositAcc = (req, res) => {
    const { deposit_acc_no } = req.params;

    depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Deposit Account not found' });
            return;
        }

        depositAccModel.deletedepositAcc(deposit_acc_no, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Deposit Account deleted successfully' });
        });
    });
};

const deleteDepositAccs = (req, res) => {
    const { depoAccIds } = req.body;

    if (!Array.isArray(depoAccIds) || depoAccIds.length === 0) {
        res.status(400).send({ error: 'Invalid deposit account IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const deposit_acc_no of depoAccIds) {
        depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, results) => {
            if (error) {
                console.error(`Error fetching deposit account with ID ${deposit_acc_no}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Deposit Account with ID ${deposit_acc_no} not found`);
                failCount++;
            } else {
                depositAccModel.deletedepositAcc(deposit_acc_no, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting Deposit Account with ID ${deposit_acc_no}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Deposit Account with ID ${deposit_acc_no} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === depoAccIds.length) {
                        const totalCount = depoAccIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === depoAccIds.length) {
                const totalCount = depoAccIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};

const permanentDeleteDepoAcc = (req, res) => {
    const { deposit_acc_no } = req.params;

    depositAccModel.permanentDeletedepoAcc(deposit_acc_no, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting deposit account from the database' });
            return;
        }

        res.status(200).send({ message: 'Deposit Account permanently deleted successfully' });
    });
};

const changeStatus = (req, res) => {
  const { deposit_acc_no } = req.params;
  const { deposit_status } = req.body;

  if (deposit_status === null) {
    res.status(400).send({ error: "Status is required" });
    return;
  }

  depositAccModel.getdepositAccByAccNo(deposit_acc_no, (error, deposit_acc) => {
    if (error) {
      res.status(500).send({ error: "Error fetching data from the database" });
      return;
    }

    if (!deposit_acc[0]) {
      res.status(404).send({ error: "Deposit Account not found" });
      return;
    }

    depositAccModel.updatestatus(deposit_acc_no, deposit_status, (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: "Error updating Status in the database" });
        return;
      }

      res.status(200).send({ message: "Status Updated successfully" });
    });
  });
};

module.exports = {
  addDepositAcc,
  updateDepositAcc,
  deletedepositAcc,
  deleteDepositAccs,
  permanentDeleteDepoAcc,
  getAlldepositAccs,
  getdepositAccByAccNo,
  changeStatus,
};
