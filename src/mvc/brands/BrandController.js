const BrandModel = require('./BrandsModel');

const getAllBrands = (req, res) => {
  BrandModel.getAllBrands((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getBrandById = (req, res) => {
  const { brandId } = req.params;
  BrandModel.getBrandById(brandId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Brand not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addBrand = (req, res) => {
  const brand = req.body;

  BrandModel.getBrandByName(brand.brandname, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length > 0) {
      res.status(409).send({ error: 'This Brand already exists' });
      return;
    }

    BrandModel.addBrand(brand, (error, brandId) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (!brandId) {
        res.status(404).send({ error: 'Failed to create brand' });
        return;
      }

      res.status(200).send({ message: 'Brand created successfully', brandId });
    });
  });
};

const updateBrand = (req, res) => {
  const { brandId } = req.params;
  const brand = req.body;

  BrandModel.getBrandById(brandId, (error, existingBrand) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingBrand[0]) {
      res.status(404).send({ error: 'Brand not found' });
      return;
    }

    if (brand.brandname && brand.brandname !== existingBrand[0].brandname) { 


      BrandModel.getBrandByName(brand.brandname, (error, results) => {
          if (error) {
              res.status(500).send({ error: 'Error fetching data from the database' });
              return;
          }

          if (results.length > 0) {
              res.status(409).send({ error: 'this brand name is already exists' });
              return;
          }

          updateExistingBrand(brand, brandId);
      });
  } else {
      updateExistingBrand(brand, brandId);
  }
});

function updateExistingBrand(brand, brandId) {
  BrandModel.updateBrand(brand, brandId, (error, results) => {
      if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
      }

      if (results.affectedRows === 0) {
          res.status(404).send({ error: 'brand not found or no changes made' });
          return;
      }

      res.status(200).send({ message: 'brand updated successfully' });
  });
}
};
const updateBrandStatus = (req, res) => {
  const { brandId } = req.params;
  const { status } = req.body;

  BrandModel.getBrandById(brandId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Brand not found' });
      return;
    }

    BrandModel.updateBrandStatus(brandId, status, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating status in the database' });
        return;
      }

      res.status(200).send({ message: 'Status updated successfully' });
    });
  });
};

const deleteBrand = (req, res) => {
  const { brandId } = req.params;

  BrandModel.getBrandById(brandId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Brand not found' });
      return;
    }

    BrandModel.deleteBrand(brandId, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Brand deleted successfully' });
    });
  });
};

const deleteBrands = (req, res) => {
  const { brandIds } = req.body;

  if (!Array.isArray(brandIds) || brandIds.length === 0) {
    res.status(400).send({ error: 'Invalid brand IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const brandId of brandIds) {
    BrandModel.getBrandById(brandId, (error, results) => {
      if (error) {
        console.error(`Error fetching brand with ID ${brandId}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Brand with ID ${brandId} not found`);
        failCount++;
      } else {
        BrandModel.deleteBrand(brandId, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting brand with ID ${brandId}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Brand with ID ${brandId} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === brandIds.length) {
            const totalCount = brandIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all brands have been processed
      if (successCount + failCount === brandIds.length) {
        const totalCount = brandIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

const permanentDeleteBrand = (req, res) => {
  const { brandId } = req.params;

  BrandModel.permanentDeleteBrand(brandId, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error deleting brand from the database' });
      return;
    }

    res.status(200).send({ message: 'Brand permanently deleted successfully' });
  });
};

module.exports = {
  getAllBrands,
  getBrandById,
  addBrand,
  updateBrand,
  updateBrandStatus,
  deleteBrand,
  permanentDeleteBrand,
  deleteBrands,
};
