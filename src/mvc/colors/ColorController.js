const ColorModel = require('./ColorModel');

const getAllColors = (req, res) => {
  ColorModel.getAllColors((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getColorById = (req, res) => {
  const { colorId } = req.params;
  ColorModel.getColorById(colorId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Color not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addColor = (req, res) => {

  const color = req.body;

  ColorModel.getColorByName(color.colorname, (error, results) => {
    if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
    }

    if (results.length > 0) {
        res.status(409).send({ error: 'This Color is already exists' });
        return;
    }

  ColorModel.addColor(color, (error, colorId) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!colorId) {
      res.status(404).send({ error: 'Failed to create color' });
      return;
    }

    res.status(200).send({ message: 'Color created successfully', colorId });
  });
});
};


const updateColor = (req, res) => {
  const { colorId } = req.params;
  const color = req.body;

  ColorModel.getColorById(colorId, (error, existingColor) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingColor[0]) {
      res.status(404).send({ error: 'Color not found' });
      return;
    }

    if (color.colorname && color.colorname !== existingColor[0].colorname) { 


      ColorModel.getColorByName(color.colorname, (error, results) => {
          if (error) {
              res.status(500).send({ error: 'Error fetching data from the database' });
              return;
          }

          if (results.length > 0) {
              res.status(409).send({ error: 'this color name is already exists' });
              return;
          }

          updateExistingColor(color, colorId);
      });
  } else {
    updateExistingColor(color, colorId);
  }
});

function updateExistingColor(color, colorId) {
  ColorModel.updateColor(color, colorId, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send({ error: 'color not found or no changes made' });
          return;
      }

      res.status(200).send({ message: 'color updated successfully' });
  });
}
};

const updateColorStatus = (req, res) => {
  const { colorId } = req.params;
  const { status } = req.body;

  ColorModel.getColorById(colorId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Color not found' });
      return;
    }

    ColorModel.updateColorStatus(colorId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteColor = (req, res) => {
  const { colorId } = req.params;

  ColorModel.getColorById(colorId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Color not found' });
      return;
    }

    ColorModel.deleteColor(colorId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Color deleted successfully' });
    });
  });
};

const deleteColors = (req, res) => {
  const { colorIds } = req.body;

  if (!Array.isArray(colorIds) || colorIds.length === 0) {
    res.status(400).send({ error: 'Invalid color IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const colorId of colorIds) {
    ColorModel.getColorById(colorId, (error, results) => {
      if (error) {
        console.error(`Error fetching color with ID ${colorId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Color with ID ${colorId} not found`);
        failCount++;
      } else {
        ColorModel.deleteColor(colorId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting color with ID ${colorId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Color with ID ${colorId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === colorIds.length) {
            const totalCount = colorIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all colors have been processed
      if (successCount + failCount === colorIds.length) {
        const totalCount = colorIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteColor = (req, res) => {
  const { colorId } = req.params;

  ColorModel.permanentDeleteColor(colorId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting color from the database' });
      return;
    }

    res.status(200).send({ message: 'Color permanently deleted successfully' });
  });
};

module.exports = {
  getAllColors,
  getColorById,
  addColor,
  updateColor,
  updateColorStatus,
  deleteColor,
  permanentDeleteColor,
  deleteColors,
};
