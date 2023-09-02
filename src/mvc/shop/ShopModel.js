const { connection } = require('../../../config/connection');

const ShopModel = {

  getShopNameandLogo(callback) {
    connection.query('SELECT shopname,logo FROM shop', callback);
  },


  getAllShops(callback) {
    connection.query('SELECT * FROM shop', callback);
  },

  addShop(shop, callback) {
    const { shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo } = shop;
    const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const defaultValues = 0;

    const query = 'INSERT INTO shop (shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [shopname, shopnphonenumber, address, email, website, facebook, instagram, whatsapp, logo];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      const shopId = results.insertId;
      callback(null, shopId);
    });
  },

  updateShop(shop, shopId, callback) {
    const { shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp } = shop;
    const query = 'UPDATE shop SET shopname = ?, shopnphonenumber = ?, address = ?, email = ?, website = ?, facebook = ?, instragram = ?, whatsapp = ?';
    const values = [shopname, shopnphonenumber, address, email, website, facebook, instragram, whatsapp];

    connection.query(query, values, callback);
  },

  updateLogo(logo, callback) {
    const query = 'UPDATE shop SET logo = ?';
    const values = [logo];

    connection.query(query, values, callback);
  },
};

module.exports = ShopModel;
