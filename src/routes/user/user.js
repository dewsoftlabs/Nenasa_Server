const express = require('express');

const { login,
    getAll,
    getUserById,
    changeUsername,
    meUpdateUser,
    updateUserProfile,
    addUser,
    updateUser,
    changeEmail,
    deleteUsers,
    findUser,
    changePassword,
    changeStatus,
    deleteuser,
} = require('../../mvc/user/UserController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', addUser);
    router.post('/login', login);

    //admin controls
    router.get('/all', authorizeAccessControll, getAll);
    router.get('/:userid', authenticateToken, findUser);
    router.put('/status/:userid', authorizeAccessControll, changeStatus);
    router.put('/delete/:userid', authorizeAccessControll, deleteuser);
    router.put('/delete', authorizeAccessControll, deleteUsers);
    router.put('/update/:userid', authorizeAccessControll, updateUser);
    router.use('/getprofile', express.static('src/uploads/profile/'));

    //profile
    router.get('/me/:userid', authorizeValidateUser, getUserById);
    router.put('/me/profilechange/:userid', uploadProfile.single('profile'), authorizeValidateUser, updateUserProfile);
    router.use('/me/getprofile', express.static('src/uploads/profile/'));
    router.put('/me/update/:userid', authorizeValidateUser, meUpdateUser);
    router.put('/me/changePassword/:userid', authorizeValidateUser, changePassword);
    router.put('/me/changeEmail/:userid', authorizeValidateUser, changeEmail);
    router.put('/me/changeUsername/:userid', authorizeValidateUser, changeUsername);
    // router.put('/me/deleteme/:userid', authorizeValidateUser, deleteuser);

    return router;
};
