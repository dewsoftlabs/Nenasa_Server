const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, phone, address, branchid, userroleid } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address
            },
            userroleid,
            branchid,
            userid,
            token
        }

        res.send(data);
    },
};

module.exports = userView;
