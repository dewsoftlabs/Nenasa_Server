const CategoryModel = require('./CategoryModel');
// const categoryView = require('../views/categoryView');

const getAllCategories = (req, res) => {
    CategoryModel.getAllCategories((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results);
    });
};

const getCategoryById = (req, res) => {
    const { categoryId } = req.params;
    CategoryModel.getCategoryById(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const addCategory = (req, res) => {
    const category = req.body;

    CategoryModel.getCategoryByName(category.cat_name, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'This Category is already exists' });
            return;
        }

        CategoryModel.addCategory(category, (error, categoryId) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (!categoryId) {
                res.status(404).send({ error: 'Failed to create category' });
                return;
            }

            res.status(200).send({ message: 'Category created successfully', categoryId });
        });
    });
};


const updateCategory = (req, res) => {
    const { categoryId } = req.params;
    const category = req.body;

    CategoryModel.getCategoryById(categoryId, (error,existingcategory) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingcategory[0]) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        if (category.cat_name && category.cat_name  !== existingcategory[0].cat_name) { 


            CategoryModel.getCategoryByName(category.cat_name, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }
      
                if (results.length > 0) {
                    res.status(409).send({ error: 'this category name is already exists' });
                    return;
                }
      
                updateExistingCategory(category, categoryId);
            });
        } else {
            updateExistingCategory(category, categoryId);
        }
      });
      
      function updateExistingCategory(category, categoryId) {
        CategoryModel.updateCategory(category, categoryId, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
      
            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'category not found or no changes made' });
                return;
            }
      
            res.status(200).send({ message: 'category updated successfully' });
        });
      }
      };


const updateCategoryStatus = (req, res) => {
    const { categoryId } = req.params;
    const { status } = req.body;

    CategoryModel.getCategoryById(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        CategoryModel.updateCategoryStatus(categoryId, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status updated successfully' });
        });
    });
};


const deleteCategory = (req, res) => {
    const { categoryId } = req.params;

    CategoryModel.getCategoryById(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Category not found' });
            return;
        }

        CategoryModel.deleteCategory(categoryId, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating deletion in the database' });
                return;
            }

            res.status(200).send({ message: 'Category deleted successfully' });
        });
    });
};


const deleteCategories = (req, res) => {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        res.status(400).send({ error: 'Invalid category IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const categoryId of categoryIds) {
        CategoryModel.getCategoryById(categoryId, (error, results) => {
            if (error) {
                console.error(`Error fetching category with ID ${categoryId}: ${error}`);
                failCount++;
            } else if (results.length === 0) {
                console.log(`Category with ID ${categoryId} not found`);
                failCount++;
            } else {
                CategoryModel.deleteCategory(categoryId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error(`Error deleting category with ID ${categoryId}: ${deleteError}`);
                        failCount++;
                    } else {
                        successCount++;
                        console.log(`Category with ID ${categoryId} deleted successfully`);
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === categoryIds.length) {
                        const totalCount = categoryIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all categories have been processed
            if (successCount + failCount === categoryIds.length) {
                const totalCount = categoryIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};

const permanentDeleteCategory = (req, res) => {
    const { categoryId } = req.params;

    CategoryModel.permanentDeleteCategory(categoryId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting category from the database' });
            return;
        }

        res.status(200).send({ message: 'Category permanently deleted successfully' });
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
    permanentDeleteCategory,
    deleteCategories
};
