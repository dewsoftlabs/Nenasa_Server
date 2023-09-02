const UserModel = require('./UserModel');
const userView = require('./userView');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const login = (req, res) => {
    const { username, password } = req.body;

    UserModel.getUserByUsernameAndPassword(username, password, (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (Array.isArray(results) && results.length > 0) {
            const user = results[0];

            if (user.status === 1) {
                const token = generateToken(user.email, user.userroleid, user.branchid);

                if (token) {
                    userView.renderUser(res, user, token);
                    return;
                }

                res.status(401).send({ error: 'Server error' });
                return;
            }

            res.status(401).send({ error: 'Account is not active' });
            return;
        }

        res.status(401).send({ error: 'Invalid username or password' });
    });
};



const getAll = (req, res) => {
    UserModel.getAll((error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        res.status(200).send(results); // Modify the response as per your requirement
    });
};

getUserById = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
}

const findUser = (req, res) => {
    const { userid } = req.params;
    UserModel.getUserById(userid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length === 0) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        res.status(200).send(results);
    });
};



const addUser = (req, res) => {
    const user = req.body; // Retrieve the user data from the request body

    // Email validation regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Check if email is valid
    if (!emailRegex.test(user.email)) {
        res.status(400).send({ error: 'Invalid email format' });
        return;
    }


    UserModel.getUserByEmail(user.email, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (results.length > 0) {
            res.status(409).send({ error: 'Email already exists' });
            return;
        }

        UserModel.getSupplierByEmail(user.email, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'Email already exists' });
                return;
            }

            UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {

                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
                    if (error) {
                        res.status(500).send({ error: 'Error fetching data from the database' });
                        return;
                    }

                    if (results.length > 0) {
                        res.status(409).send({ error: 'Phone number already exists' });
                        return;
                    }

                    UserModel.getUserByUsername(user.username, (error, results) => {
                        if (error) {
                            res.status(500).send({ error: 'Error fetching data from the database' });
                            return;
                        }

                        if (results.length > 0) {
                            res.status(409).send({ error: 'Username is already exists' });
                            return;
                        }

                        UserModel.addUser(user, (error, userId) => {
                            if (error) {
                                res.status(500).send({ error: 'Error fetching data from the database' });
                                return;
                            }

                            if (!userId) {
                                res.status(500).send({ error: 'Failed to create user' });
                                return;
                            }

                            res.status(200).send({ message: 'User created successfully', userId });
                        });
                    });
                });
            });
        });
    });
};



const updateUser = (req, res) => {
    const { userid } = req.params;
    const user = req.body;

    UserModel.getUserById(userid, (error, existingUser) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingUser[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        // Check if the provided phone number is already associated with another user
        if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) { 


            UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                updateExistingUser(user, userid);
            });
        } else {
            updateExistingUser(user, userid);
        }
    });

    function updateExistingUser(user, userid) {
        UserModel.updateUser(user, userid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'User not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully' });
        });
    }
};

const meUpdateUser = (req, res) => {
    const { userid } = req.params;
    const user = req.body;

    UserModel.getUserById(userid, (error, existingUser) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingUser[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        // Check if the provided phone number is already associated with another user
        if (user.phonenumber && user.phonenumber !== existingUser[0].phonenumber) {

            UserModel.getUserByPhonenumber(user.phonenumber, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error fetching data from the database' });
                    return;
                }

                if (results.length > 0) {
                    res.status(409).send({ error: 'Phone number already exists' });
                    return;
                }

                updateExistingUser(user, userid);
            });
        } else {
            updateExistingUser(user, userid);
        }
    });

    function updateExistingUser(user, userid) {
        UserModel.meUpdateUser(user, userid, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'User not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully' });
        });
    }
};

const updateUserProfile = (req, res) => {
    const { userid } = req.params;
    const filePath = req.file.filename;

    UserModel.getUserById(userid, (error, existingUser) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!existingUser[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.updateUserProfile(userid, filePath, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).send({ error: 'User not found or no changes made' });
                return;
            }

            res.status(200).send({ message: 'User updated successfully' });
        });
      
    });
};


const changePassword = (req, res) => {
    const { userid } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Check if current password is empty
    if (!currentPassword) {
        res.status(400).send({ error: 'Current password is required' });
        return;
    }

    // Check if new password is empty
    if (!newPassword) {
        res.status(400).send({ error: 'New password is required' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].password !== currentPassword) {
            res.status(400).send({ error: 'Current password is incorrect' });
            return;
        }

        UserModel.updateUserPassword(userid, newPassword, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating password in the database' });
                return;
            }

            res.status(200).send({ message: 'Password changed successfully' });
        });
    });
};

const changeEmail = (req, res) => {
    const { userid } = req.params;
    const { currentEmail, newEmail } = req.body;

    // Email validation regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if current email is empty or not in the correct format
    if (!currentEmail || !emailRegex.test(currentEmail)) {
        res.status(400).send({ error: 'Invalid or missing current email' });
        return;
    }

    // Check if new email is empty or not in the correct format
    if (!newEmail || !emailRegex.test(newEmail)) {
        res.status(400).send({ error: 'Invalid or missing new email' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        if (user[0].email !== currentEmail) {
            res.status(400).send({ error: 'Current email is incorrect' });
            return;
        }

        UserModel.changeEmail(userid, newEmail, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating email in the database' });
                return;
            }

            res.status(200).send({ message: 'Email changed successfully' });
        });
    });
};

const changeUsername = (req, res) => {
    const { userid } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
        res.status(400).send({ error: 'New username is required' });
        return;
    }

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.getUserByUsername(newUsername, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }

            if (results.length > 0) {
                res.status(409).send({ error: 'New username already exists' });
                return;
            }

            UserModel.changeUsername(userid, newUsername, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error updating username in the database' });
                    return;
                }

                res.status(200).send({ message: 'Username changed successfully' });
            });
        });
    });
};


const changeStatus = (req, res) => {
    const { userid } = req.params;
    const { status } = req.body;

    if (!status) {
        res.status(400).send({ error: 'Status is required' });
        return;
    }


    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.updatestatus(userid, status, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Status in the database' });
                return;
            }

            res.status(200).send({ message: 'Status Updated successfully' });
        });
    });
};

const deleteuser = (req, res) => {
    const { userid } = req.params;

    UserModel.getUserById(userid, (error, user) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }

        if (!user[0]) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        UserModel.deleteuser(userid, 1, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error updating Deleteing in the database' });
                return;
            }

            res.status(200).send({ message: 'User Delete successfully' });
        });
    });
};

const deleteUsers = (req, res) => {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).send({ error: 'Invalid user IDs' });
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const userId of userIds) {
        UserModel.getUserById(userId, (error, results) => {
            if (error) {
                failCount++;
            } else if (results.length === 0) {
                failCount++;
            } else {
                UserModel.deleteuser(userId, 1, (deleteError, deleteResult) => {
                    if (deleteError) {
                        failCount++;
                    } else {
                        successCount++;
                    }

                    // Check if all deletions have been processed
                    if (successCount + failCount === userIds.length) {
                        const totalCount = userIds.length;
                        res.status(200).send({
                            totalCount,
                            successCount,
                            failCount,
                        });
                    }
                });
            }

            // Check if all suppliers have been processed
            if (successCount + failCount === userIds.length) {
                const totalCount = userIds.length;


                res.status(200).send({
                    totalCount,
                    successCount,
                    failCount,
                });
            }
        });
    }
};


// Generate token using JWT
function generateToken(email, userroleid, branchid) {
    const payload = { email, userroleid, branchid };
    const options = { expiresIn: '24h' }; // Token expiration time

    // Sign the token with the secret key from the .env file
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    return token;
}

module.exports = {
    login,
    getAll,
    getUserById,
    findUser,
    addUser,
    updateUser,
    changePassword,
    changeEmail,
    changeStatus,
    deleteuser,
    deleteUsers,
    updateUserProfile,
    meUpdateUser,
    changeUsername
};
