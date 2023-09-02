const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
const UserModel = require('../mvc/user/UserModel');

async function authorizeAccessControll(req, res, next) {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userByEmail(req.decoded.email);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user[0].userroleid !== req.decoded.userroleid) {
      return res.status(401).json({ error: 'Invalid User Access' });
    }

    if (user[0].userroleid !== 1 && user[0].userroleid !== 2) { //admin = 2
      return res.status(401).json({ error: 'You dont have permission' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function authorizeAccessSupoerAdmin(req, res, next) {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userByEmail(req.decoded.email);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user[0].userroleid !== req.decoded.userroleid) {
      return res.status(401).json({ error: 'Invalid User Access' });
    }

    if (user[0].userroleid !== 1) { //super admin = 1
      return res.status(401).json({ error: 'You dont have permission' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function authorizeBranchControll(req, res, next) {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded; // Save the decoded payload for further use

    const user = await UserModel.userByEmail(req.decoded.email);

    if (!user[0]) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (user[0].email !== req.decoded.email) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    

    if (user[0].userroleid !== req.decoded.userroleid) {
      return res.status(401).json({ error: 'Invalid User Access' });
    }

    if (user[0].userroleid !== 2) { //admin = 2
      return res.status(401).json({ error: 'You dont have permission' });
    }

    if (user[0].branchid !== req.decoded.branchid) {
      return res.status(401).json({ error: 'You are not permited for this. because branch is diffrent' });
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
  authorizeAccessControll,
  authorizeBranchControll,
  authorizeAccessSupoerAdmin
};
