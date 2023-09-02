const StockModel = require('./StockModel');

const getAllStocks = (req, res) => {
  StockModel.getAllStocks((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Stocks not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const getAllStocksBranch = (req, res) => {
  const { branch_id } = req.params;

  StockModel.getAllStocksInBranch(branch_id, (error, results) => {

    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }
    if (results.length === 0) {
      res.status(404).send({ error: 'Stock not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const getStockById = (req, res) => {
  const { stockId } = req.params;
  StockModel.getStockById(stockId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Stock not found' });
      return;
    }

    res.status(200).send(results);
  });
};


const deleteStock = (req, res) => {
  const { stockId } = req.params;

  StockModel.deleteStock(stockId, 1, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error updating deletion in the database' });
      return;
    }

    res.status(200).send({ message: 'Stock deleted successfully' });
  });
};

const permanentDeleteStock = (req, res) => {
  const { stockId } = req.params;

  StockModel.permanentDeleteStock(stockId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting stock from the database' });
      return;
    }

    res.status(200).send({ message: 'Stock permanently deleted successfully' });
  });
};

module.exports = {
  getAllStocks,
  getAllStocksBranch,
  getStockById,
  deleteStock,
  permanentDeleteStock,
};
