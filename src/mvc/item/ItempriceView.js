const ItempriceView = {
    renderItemWithPrices(item) {
        const {
            item_code,
            itemid,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            sale_warranty,
            condition_type,
            brandid,
            item_image,
            serial_status,
            trndate,
            status,
            is_delete,
            prices // Prices array for different branches
        } = item;

        const data = {
            itemid,
            item_code,
            item_name,
            item_description,
            catid,
            subcatid,
            storageid,
            sale_warranty,
            condition_type,
            brandid,
            item_image,
            serial_status,
            trndate,
            status,
            is_delete,
            price: prices // Prices array
        };

        return data;
    },

    renderItempricesArray(items) {
        const itemMap = new Map();
        
        for (const item of items) {
            const { branch_id, sell_price, purchase_price, wholesale_price, discount } = item;
            
            if (!itemMap.has(item.itemid)) {
                itemMap.set(item.itemid, {
                    ...item,
                    prices: []
                });
            }
            
            const itemEntry = itemMap.get(item.itemid);
            itemEntry.prices.push({
                branch_id,
                sell_price,
                purchase_price,
                wholesale_price,
                discount
            });
        }
        
        const aggregatedItems = [...itemMap.values()];

        return aggregatedItems.map(item => this.renderItemWithPrices(item));
    }
};

module.exports = ItempriceView;