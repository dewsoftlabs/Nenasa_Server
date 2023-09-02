const SubcategoryModel = require('./SubcategoryModel');
// const subcategoryView = require('../views/subcategoryView');

const getAllSubcategories = (req, res) => {
    SubcategoryModel.getAllSubcategories((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getSubcategoryById = (req, res) => {
    const { subcategoryId } = req.params;
    SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Subcategory not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addSubcategory = (req, res) => {
    const subcategory = req.body;

    SubcategoryModel.addSubcategory(subcategory, (error, subcategoryId) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!subcategoryId) {
            res.status(404).send({ error: 'Failed to create subcategory' });
            return;
        }

        res.status(200).send({ message: 'Subcategory created successfully', subcategoryId });
    });
};

const updateSubcategory = (req, res) => {
    const { subcategoryId } = req.params;
    const subcategory = req.body;

    SubcategoryModel.getSubcategoryById(subcategoryId, (error, existigsubcat) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existigsubcat[0]) {
            res.status(404).send({ error: 'Subcategory not found' });
            return;
        }

        if (subcategory.subcat_name && subcategory.subcat_name !== existigsubcat[0].subcat_name) { 


            SubcategoryModel.getSubcathByName(subcategory.subcat_name, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }
      
                if (results.length > 0) {
                    res.status(409).send({ error: 'this branch name is already exists' });
                    return;
                }
      
                updateExistingsubCat(subcategory, subcategoryId);
            });
        } else {
            updateExistingsubCat(subcategory, subcategoryId);
        }
      });
      
      function updateExistingsubCat(subcategory, subcategoryId) {
        SubcategoryModel.updateSubcategory(subcategory, subcategoryId, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
      
            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'subcategorry not found or no changes made' });
                return;
            }
      
            res.status(200).send({ message: 'subcategorry updated successfully' });
        });
      }
      };


const updateSubcategoryStatus = (req, res) => {
    const { subcategoryId } = req.params;
    const { status } = req.body;

    SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Subcategory not found' });
            return;
        }

        SubcategoryModel.updateSubcategoryStatus(subcategoryId, status, (error, updateResult) => {
            if (error) {
                res.status(500).send({ error: 'Error updating status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status updated successfully' });
        });
    });
};


const deleteSubcategory = (req, res) => {
    const { subcategoryId } = req.params;

    SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Subcategory not found' });
            return;
        }

        SubcategoryModel.deleteSubcategory(subcategoryId, 1, (error, deleteResult) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Subcategory deleted successfully' });
        });
    });
};


const deleteSubcategories = (req, res) => {
    const { subcategoryIds } = req.body;

    if (!Array.isArray(subcategoryIds) || subcategoryIds.length === 0) {
        res.status(400).send({ error: 'Invalid subcategory IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const subcategoryId of subcategoryIds) {
        SubcategoryModel.getSubcategoryById(subcategoryId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                SubcategoryModel.deleteSubcategory(subcategoryId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === subcategoryIds.length) {
                        const totalCount = subcategoryIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all subcategories have been processed
            if (successCount + failCount === subcategoryIds.length) {
                const totalCount = subcategoryIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};


const permanentDeleteSubcategory = (req, res) => {
    const { subcategoryId } = req.params;

    SubcategoryModel.permanentDeleteSubcategory(subcategoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting subcategory from the database' });
            return;
        }

        res.status(200).send({ message: 'Subcategory permanently deleted successfully' });
    });
};

module.exports = {
    getAllSubcategories,
    getSubcategoryById,
    addSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    deleteSubcategory,
    permanentDeleteSubcategory,
    deleteSubcategories
};
