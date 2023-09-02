const SupplierModel = require('./SupplierModel');
const supplierView = require('./supplierView');

const getAllSuppliers = (req, res) => {
    SupplierModel.getAllSuppliers((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

const getSupplierById = (req, res) => {
    const { supplierId } = req.params;
    SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const addSupplier = (req, res) => {
    const supplier = req.body; // Retrieve the supplier data from the request body

    SupplierModel.getUserByEmail(supplier.supplier_email, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'Email already exists' });
            return;
        }

        SupplierModel.getSupplierByEmail(supplier.supplier_email, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'Email already exists' });
                return;
            }

            SupplierModel.getSupplierByPhonenumber(supplier.supplier_phone, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone Number is already exists' });
                    return;
                }
                SupplierModel.getUserByPhonenumber(supplier.supplier_phone, (error, results) => {
                    if (error) {
                        res.status(500).send({ error: 'Error fetching data from the database' });
                        return;
                    }

                    if (results.length > 0) {
                        res.status(409).send({ error: 'Phone Number is already exists' });
                        return;
                    }

                    SupplierModel.addSupplier(supplier, (error, supplierId) => {
                        if (error) {
                            res.status(500).send({ error: 'Error fetching data from the database' });
                            return;
                        }

                        if (!supplierId) {
                            res.status(404).send({ error: 'Failed to create supplier' });
                            return;
                        }

                        res.status(200).send({ message: 'Supplier created successfully', supplierId });
                    });

                });
            });
        });
    });
};

const updateSupplier = (req, res) => {
    const { supplierId } = req.params;
    const supplier = req.body;

    SupplierModel.getSupplierById(supplierId, (error, existingSuplier) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingSuplier[0]) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        if (supplier.supplier_phone && supplier.supplier_phone !== existingSuplier[0].supplier_phone) { 


            SupplierModel.getSupplierByPhonenumber(supplier.supplier_phone, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }
      
                if (results.length > 0) {
                    res.status(409).send({ error: 'This supplier phone number is already exists' });
                    return;
                }
      
                updateExistingSuplier(supplier, supplierId);
            });
        } else {
            updateExistingSuplier(supplier, supplierId);
        }
      });
      
      function updateExistingSuplier(supplier, supplierId) {
        SupplierModel.updateSupplier(supplier, supplierId, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
      
            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'supllier not found or no changes made' });
                return;
            }
      
            res.status(200).send({ message: 'supllier updated successfully' });
        });
      }
      };


const updateSupplierStatus = (req, res) => {
    const { supplierId } = req.params;
    const { status } = req.body;

    SupplierModel.getSupplierById(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        SupplierModel.updateSupplierStatus(supplierId, status, (error, updateResult) => {
            if (error) {
                res.status(500).send({ error: 'Error updating supplier status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status updated successfully' });
        });
    });
};


const deleteSupplier = (req, res) => {
    const { supplierId } = req.params;

    SupplierModel.getSupplierById(supplierId, (error, supplier) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!supplier[0]) {
            res.status(404).send({ error: 'Supplier not found' });
            return;
        }

        SupplierModel.deleteSupplier(supplierId, 1, (deleteError, deleteResult) => {
            if (deleteError) {
                res.status(500).send({ error: 'Error updating Deleting in the database' });
                return;
            }

            res.status(200).send({ message: 'Supplier deleted successfully' });
        });
    });
};
//delete suppliers controler

const deleteSuppliers = (req, res) => {
    const { supplierIds } = req.body;

    if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
        res.status(400).send({ error: 'Invalid supplier IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const supplierId of supplierIds) {
        SupplierModel.getSupplierById(supplierId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                SupplierModel.deleteSupplier(supplierId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === supplierIds.length) {
                        const totalCount = supplierIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all suppliers have been processed
            if (successCount + failCount === supplierIds.length) {
                const totalCount = supplierIds.length;


                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};




// Additional methods for your requirements

const permanentDeleteSupplier = (req, res) => {
    const { supplierId } = req.params;

    SupplierModel.permanentDeleteSupplier(supplierId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error deleting supplier from the database' });
            return;
        }

        res.status(200).send({ message: 'Supplier permanently deleted successfully' });
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    updateSupplierStatus,
    deleteSupplier,
    permanentDeleteSupplier,
    deleteSuppliers
};
