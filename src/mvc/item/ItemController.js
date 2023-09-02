const ItemModel = require('./ItemModel');
const branchItemView  = require('./branchItemView');
const ComonItemView = require('./ComonItemView');
const ItempriceView = require('./ItempriceView');

const getAllItemsBybranch = (req, res) => {
    const { branch_id } = req.params;
    ItemModel.getAllItemsBybranch(branch_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const modifiedItemsArray = branchItemView.renderbranchItemsArray(results);
            res.status(200).send(modifiedItemsArray);
        } else {
            // Handle empty results case
            res.status(404).send({ message: "not found" });
        }
    });
};

module.exports = { getAllItemsBybranch };


const getAllComonItems = (req, res) => {
    const items = req.body;
    ItemModel.getAllItems((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const renderedComonItemsArray = ComonItemView.renderComonItemsArray(results);
            res.status(200).send(renderedComonItemsArray);
            return;
        }

        // Handle empty results case
        res.status(404).send({ message: "not found" });
    });
};


const getAllItemsWithPrice = (req, res) => {
    ItemModel.getAllItemsWithPrice((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const renderedItempriceView = ItempriceView.renderItempricesArray(results);
            res.status(200).send(renderedItempriceView);
            return;
        }

        // Handle empty results case
        res.status(404).send({ message: "not found" });
    });
};

module.exports = { getAllItemsWithPrice };

const getItemById = (req, res) => {
    const { itemId } = req.params;
    ItemModel.getItemById(itemId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Item not found' });
            return;
        }

        res.status(200).send(results);
    });
};

const getPriceBybranchId = (req, res) => {
    const price = req.body;
    console.log(price.itemId);

    ItemModel.getPriceBybranchId(price.itemId, price.branch_id, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }
        console.log(results.length);

        if (results.length === 0) {
            console.log(results.length);
            res.status(404).send({ error: 'Item not found sfd sdjjjjjjjjj' });
            return;
        }

        res.status(200).send(results);
    });
};




const addItem = (req, res) => {
    const item = req.body; // Retrieve the item data from the request body
    const filePath = req.file.filename;
    console.log(req.file)

    ItemModel.getItemByName(item.item_name, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'This item name is already exists' });
            return;
        }
        
        ItemModel.getItemByCode(item.item_code, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'This item code is already exists' });
                return;
            }

            ItemModel.addItem(item, filePath, (error, itemId) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (!itemId) {
                    res.status(404).send({ error: 'Failed to create item' });
                    return;
                }

                res.status(200).send({ message: 'Item created successfully', itemId });
            });
        });
    });
};

const addNewitemPrice = (req, res) => {
    const price = req.body;

    ItemModel.getPriceBybranchId(price.itemid, price.branch_id, (error, results) => {
       
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        console.log(results.length);

        if (results.length > 0) {
            res.status(409).send({ error: 'This item price is already exists' });
            return;
        }
        
            ItemModel.addNewitemPrice(price, (error,item_priceid) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (!item_priceid) {
                    res.status(404).send({ error: 'Failed to create item price' });
                    return;
                }

                res.status(200).send({ message: 'Item price created successfully', item_priceid });
            });
        });
};


const updateItem = (req, res) => {
    const { itemId } = req.params;
    const item = req.body;

    // Check if the item exists before updating
    ItemModel.getItemById(itemId, (error, existingItem) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (existingItem.length === 0) {
            res.status(404).send({ error: 'Item not found' });
            return;
        }

        // Check if the provided item_code is already associated with another item
        if (item.item_code && item.item_code !== existingItem[0].item_code) {
            ItemModel.getItemByCode(item.item_code, (error, codeResults) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (codeResults.length > 0) {
                    res.status(409).send({ error: 'This item code is already associated with another item' });
                    return;
                }

                // Call the next check
                checkItemName(item, existingItem, itemId);
            });
        } else {
            // Call the next check
            checkItemName(item, existingItem, itemId);
        }
    });

    function checkItemName(item, existingItem, itemId) {
        if (item.item_name && item.item_name !== existingItem[0].item_name) {
            ItemModel.getItemByName(item.item_name, (error, nameResults) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (nameResults.length > 0) {
                    res.status(409).send({ error: 'This item name is already associated with another item' });
                    return;
                }

                // Proceed with the update
                updateExistingItem(item, itemId);
            });
        } else {
            // Proceed with the update
            updateExistingItem(item, itemId);
        }
    }

    function updateExistingItem(item, itemId) {
        ItemModel.updateItem(item, itemId, (updateError, updateResults) => {
            if (updateError) {
                res.status(500).send({ error: 'Error updating item in the database' });
                return;
            }
    
            if (updateResults.affectedRows === 0) {
                res.status(404).send({ error: 'Item not found or no changes made' });
                return;
            }
    
            res.status(200).send({ message: 'Item updated successfully' });
        });
    }
};



const updateItemImage = (req, res) => {
    const { itemId } = req.params;
    const filePath = req.file.filename;

    // Check if the item exists before updating
    ItemModel.getItemById(itemId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }



        if (results.length === 0) {
            console.log(itemId);
            console.log(results.length);
            res.status(404).send({ error: 'Item not found' });
            return;
        }

        // Item exists, proceed with the update
        ItemModel.updateItemImage(filePath, itemId, (updateError, updateResults) => {
            if (updateError) {
                res.status(500).send({ error: 'Error updating item in the database' });
                return;
            }

            if (updateResults.affectedRows === 0) {
                res.status(404).send({ error: 'Item not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'Item Image Uploaded successfully' });
        });
    });
};

const deleteItem = (req, res) => {
    const { itemId } = req.params;

    // Check if the item exists before deleting
    ItemModel.getItemById(itemId, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'Item not found' });
            return;
        }

        // Item exists, proceed with the deletion
        ItemModel.deleteItem(itemId, 1, (deleteError, deleteResults) => {
            if (deleteError) {
                res.status(500).send({ error: 'Error deleting item from the database' });
                return;
            }

            res.status(200).send({ message: 'Item deleted successfully' });
        });
    });
};

const deleteItems = (req, res) => {
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
        return;

    }

    let successCount = 0;
    let failCount = 0;

    for (const itemId of itemIds) {
        ItemModel.getItemById(itemId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                ItemModel.deleteItem(itemId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === itemIds.length) {
                        const totalCount = itemIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all items have been processed
            if (successCount + failCount === itemIds.length) {
                const totalCount = itemIds.length;
                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};


module.exports = {

    getItemById,
    addItem,
    getPriceBybranchId,
    getAllItemsBybranch,
    getAllItemsWithPrice,
    updateItem,
    addNewitemPrice,
    deleteItem,
    getAllComonItems,
    deleteItems,
    updateItemImage
};
