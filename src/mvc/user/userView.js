const userView = {
    renderUser(res, user, token) {
        const { userid, fullname, username, email, phone, address, gender , nic , branchid, userroleid } = user;

        const data = {
            userData: {
                fullname,
                email,
                username,
                phone,
                address,
                gender,
                nic
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
