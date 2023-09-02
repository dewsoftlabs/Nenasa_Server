const express = require('express');
const {
  GrnModel,
  GrnTempModel
} = require('./GRNModel');

//

const finishGrn = (req, res) => {
  GrnModel.getAllGrns((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

// Controller functions for Grn Model
const getAllGrns = (req, res) => {
  GrnModel.getAllGrns((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getGrnById = (req, res) => {
  const { grnId } = req.params;
  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addGrn = (req, res) => {
  const grn = req.body;

  GrnModel.addGrn(grn, (error, grnId) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!grnId) {
      res.status(404).send({ error: 'Failed to create grn' });
      return;

    }

    res.status(200).send({ message: 'Grn created successfully', grnId });
  });
};

const updateGrn = (req, res) => {
  const { grnId } = req.params;
  const grn = req.body;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.updateGrn(grn, grnId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: 'Grn not found or no changes made' });
        return;
      }

      res.status(200).send({ message: 'Grn updated successfully' });
    });
  });
};

const updateGrnStatus = (req, res) => {
  const { grnId } = req.params;
  const { status } = req.body;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.updateGrnStatus(grnId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteGrn = (req, res) => {
  const { grnId } = req.params;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Grn not found' });
      return;
    }

    GrnModel.deleteGrn(grnId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Grn deleted successfully' });
    });
  });
};

const deleteGrns = (req, res) => {
  const { grnIds } = req.body;

  if (!Array.isArray(grnIds) || grnIds.length === 0) {
    res.status(400).send({ error: 'Invalid grn IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const grnId of grnIds) {
    GrnModel.getGrnById(grnId, (error, results) => {
      if (error) {
        console.error(`Error fetching grn with ID ${grnId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Grn with ID ${grnId} not found`);
        failCount++;
      } else {
        GrnModel.deleteGrn(grnId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting grn with ID ${grnId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Grn with ID ${grnId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === grnIds.length) {
            const totalCount = grnIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all grns have been processed
      if (successCount + failCount === grnIds.length) {
        const totalCount = grnIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteGrn = (req, res) => {
  const { grnId } = req.params;

  GrnModel.permanentDeleteGrn(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting grn from the database' });
      return;
    }

    res.status(200).send({ message: 'Grn permanently deleted successfully' });
  });
};

// Controller functions for GrnTemp Model//////////////////////////////////////////
const getAllGrnTemp = (req, res) => {
  GrnTempModel.getAllGrnTemp((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getAllGrnTempBYGRNNO = (req, res) => {
  const { grnId } = req.params;

  GrnModel.getGrnById(grnId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GRN not found' });
      return;
    }
    GrnTempModel.getAllGrnTempBYGRNNO(grnId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      res.status(200).send(results);
    });
  });
};

const getGrnTempById = (req, res) => {
  const { grnTempId } = req.params;
  GrnTempModel.getGrnTempById(grnTempId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addGrnTemp = (req, res) => {
  const grnTemp = req.body;

  GrnTempModel.getItemBybranch(grnTemp.itemid, grnTemp.branch_id, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Prices not found' });
      return;
    }

    const pricedetails = results[0];

    GrnTempModel.addGrnTemp(grnTemp, pricedetails, (error, grnTempId) => {
      if (error) {
        res.status(500).send({ error: 'Error inserting data into the database' });
        return;
      }

      if (!grnTempId) {
        res.status(404).send({ error: 'Failed to create grnTemp' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp created successfully', grnTempId });
    });
  });
};

const updateGrnTemp = (req, res) => {
  const { grnTempId } = req.params;
  const grnTemp = req.body;

  GrnTempModel.getGrnTempById(grnTempId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTemp(grnTemp, grnTempId, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: 'GrnTemp not found or no changes made' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp updated successfully' });
    });
  });
};

const updateGrnTempPurchaseprice = (req, res) => {
  const { grntempid } = req.params;
  const { purchase_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempPurchaseprice(grntempid, purchase_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Purchase Price updated successfully' });
    });
  });
};

const updateGrnTempSellPrice = (req, res) => {
  const { grntempid } = req.params;
  const { sell_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempSellPrice(grntempid, sell_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Sell Price updated successfully' });
    });
  });
};

const updateGrnTempWholesaleprice = (req, res) => {
  const { grntempid } = req.params;
  const { wholesale_price } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempWholesaleprice(grntempid, wholesale_price, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'wholesale price updated successfully' });
    });
  });
};

const updateGrnTempGrnqty = (req, res) => {
  const { grntempid } = req.params;
  const { grnqty } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempGrnqty(grntempid, grnqty, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Qty updated successfully' });
    });
  });
};

const updateGrnTempDiscount = (req, res) => {
  const { grntempid } = req.params;
  const { discount } = req.body;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.updateGrnTempDiscount(grntempid, discount, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Discount updated successfully' });
    });
  });
};

const deleteGrnTemp = (req, res) => {
  const { grntempid } = req.params;

  GrnTempModel.getGrnTempById(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'GrnTemp not found' });
      return;
    }

    GrnTempModel.deleteGrnTemp(grntempid, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'GrnTemp deleted successfully' });
    });
  });
};

const deleteGrnTemps = (req, res) => {
  const { grntempids } = req.body;

  if (!Array.isArray(grntempids) || grntempids.length === 0) {
    res.status(400).send({ error: 'Invalid grnTemp IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const grntempid of grntempids) {
    GrnTempModel.getGrnTempById(grntempid, (error, results) => {
      if (error) {
        console.error(`Error fetching grnTemp with ID ${grntempid}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`GrnTemp with ID ${grntempid} not found`);
        failCount++;
      } else {
        GrnTempModel.deleteGrnTemp(grntempid, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting grnTemp with ID ${grntempid}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`GrnTemp with ID ${grntempid} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === grntempids.length) {
            const totalCount = grntempids.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all grnTemps have been processed
      if (successCount + failCount === grntempids.length) {
        const totalCount = grntempids.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteGrnTemp = (req, res) => {
  const { grntempid } = req.params;


  GrnTempModel.permanentDeleteGrnTemp(grntempid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting grnTemp from the database' });
      return;
    }

    res.status(200).send({ message: 'GrnTemp permanently deleted successfully' });
  });
};

module.exports = {
  // Grn Model
  getAllGrns,
  getGrnById,
  addGrn,
  updateGrn,
  updateGrnStatus,
  deleteGrn,
  permanentDeleteGrn,
  deleteGrns,

  // GrnTemp Model
  getAllGrnTemp,
  getGrnTempById,
  addGrnTemp,
  updateGrnTemp,
  updateGrnTempPurchaseprice,
  updateGrnTempSellPrice,
  updateGrnTempWholesaleprice,
  updateGrnTempGrnqty,
  updateGrnTempDiscount,
  deleteGrnTemp,
  permanentDeleteGrnTemp,
  deleteGrnTemps,
  getAllGrnTempBYGRNNO,
  addGrnTemp,
  finishGrn
};
