var async = require('async');

module.exports = {

    UserLogin: async (req, res) => {

        if (!req.body.userId && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide login credentials' });
        }

        let UserData = await ERPUser.findOne({
            userId: req.body.userId, password: req.body.password
        });

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using these credentials' });
        }
        else {

            // if (UserData.status != 'Approved') {
            //     return res.send({ responseCode: 201, data: {}, msg: "User is not activated, please contact admin.." });
            // }
            // let UserToken = SHA256(req.body.email) + 'jusbid' + SHA256(req.body.password);
            // var UpdatedUser = await User.updateOne({ id: UserData.id }).set({ userToken: UserToken });
            return res.send({ responseCode: 200, data: UserData, msg: "Welcome back, you have logged in successfully!" });
        }

    },

    Create_ERP_User: async (req, res) => {

        var Mobile = req.body.mobile;
        var name = req.body.name;

        if (!name) {
            return res.send({ responseCode: 201, msg: 'Please provide full name' });
        }

        let EmailCheck = await ERPUser.find({ email: req.body.email });
        if (EmailCheck.length == 1) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }
        if (EmailCheck.length >= 2) { return res.send({ responseCode: 201, msg: 'Multiple users exists with this email, unable to create user with this email' }); }


        let MobileCheck = await ERPUser.findOne({ mobile: Mobile });
        if (MobileCheck) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let UserCounts = await ERPUser.count();

        let save_userid = name.substring(0, 4) + (parseInt(UserCounts) + 1);

        let save_password =  name.substring(0, 4) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();


        let ERPUserdata = await ERPUser.create({
            password: save_password,
            userId: save_userid,
            email: req.body.email,
            name: req.body.name,
            mobile: req.body.mobile,
            role: req.body.role,
            // address keys----------------------------
            address: req.body.address,
            // doc links-------------------------------
            createdBy: req.body.createdBy,
            updatedBy: req.body.updatedBy,
            //new keys----------------------------------
            branch_state: req.body.branch_state,
            branch_id: req.body.branch_id
        }).fetch();

        if (!ERPUserdata) {
            return res.send({ responseCode: 201, msg: 'User not saved' });
        } else {
            //mailer.sendWelcomeMail(result);
            return res.send({ responseCode: 200, msg: 'Your account has been created successfully', data: ERPUserdata });
        }

    },

    Create_Update_Branch: async (req, res) => {

        let ERPBranchData;

        if(req.body.branch_id){
            ERPBranchData = await ERPBranch.updateOne({id:req.body.branch_id}).set({
                name: req.body.name,
                state: req.body.state,
                city: req.body.city,
                address: req.body.address,
                GST: req.body.GST,
                email:req.body.email,
                phone:req.body.phone,
                branch_manager: req.body.branch_manager,
                branch_manager_email: req.body.branch_manager_email
            }).fetch();
        }else{
            ERPBranchData = await ERPBranch.create({
                name: req.body.name,
                state: req.body.state,
                city: req.body.city,
                address: req.body.address,
                GST: req.body.GST,
                email:req.body.email,
                phone:req.body.phone,
                branch_manager: req.body.branch_manager,
                branch_manager_email: req.body.branch_manager_email
            }).fetch();
        }

        

        if (!ERPBranchData) {
            return res.send({ responseCode: 201, msg: 'User not saved' });
        } else {
            return res.send({ responseCode: 200, msg: 'Your branch has been created/updated successfully', data: ERPBranchData });
        }

    },

    Get_Branch: async (req, res) => {

        let ERPBranchData = await ERPBranch.find();

        if (!ERPBranchData) {
            return res.send({ responseCode: 201, msg: 'Branch not fetched' });
        } else {
            return res.send({ responseCode: 200, msg: 'Your branch has been fetched successfully', data: ERPBranchData });
        }

    },

    Get_ERP_Users: async (req, res) => {

        let ERPUserData = await ERPUser.find();

        if (!ERPUserData) {
            return res.send({ responseCode: 201, msg: 'ERPUserData not fetched' });
        } else {
            return res.send({ responseCode: 200, msg: 'ERPUserData has been fetched successfully', data: ERPUserData });
        }

    },


}