const multer = require('multer');
const path = require('path');

const shopStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/shop');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const itemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/item');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/category');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uploads/profile');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadLogo = multer({ storage: shopStorage });
const uploadItem = multer({ storage: itemStorage });
const uploadCategory = multer({ storage: categoryStorage });
const uploadProfile = multer({ storage: userStorage });

module.exports = { uploadLogo, uploadItem, uploadCategory, uploadProfile };
