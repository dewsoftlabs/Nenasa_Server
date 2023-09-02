const branchItemView = {
    renderbranchItem(item) {
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
            sell_price,
            purchase_price,
            wholesale_price,
            discount,
            branch_id
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
            sell_price,
            purchase_price,
            wholesale_price,
            discount,    // Moved out of the price object
            branch_id    // Moved out of the price object
        };

        return data;
    },

    renderbranchItemsArray(items) {
        return items.map(item => this.renderbranchItem(item));
    }
};
module.exports = branchItemView;
