var async = require('async');
var SHA256 = require("crypto-js/sha256");
var CryptoJS = require("crypto-js");
var JusbidText = "_jusbid_";
var JusbidKey = "jusbid key2020";

module.exports = {

    System_User_Login: async (req, res) => {

        let userId_T = req.body.userId;

        if (!req.body.userId && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide login credentials' });
        }

        let UserData = await SystemUser.findOne({
            userId: req.body.userId, password: req.body.password
        });

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using these credentials' });
        }
        else {

            if (UserData.status != 'Approved') {
                return res.send({ responseCode: 201, data: {}, msg: "User is not activated, please contact admin.." });
            }
            // generate token using SHA256------------------------------------------------------------------------------------
            let TempToken = userId_T + JusbidText + userId_T;
            //  sails.log(TempToken, 'TempToken');
            var ciphertext = CryptoJS.AES.encrypt(TempToken, JusbidKey).toString();
            await User.updateOne({ userId: UserData.userId }).set({ userToken: ciphertext });
            UserData.userToken = ciphertext;
            //-----------------------------------------------------------------------------------------------------------------
            return res.send({ responseCode: 200, data: UserData, msg: "Welcome back " + UserData.name + ", you have logged in successfully!" });
        }

    },


    UserLogin: async (req, res) => {

        if (!req.body.userId && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide login credentials' });
        }

        var UserData = await User.findOne({
            userId: req.body.userId, password: req.body.password
        });

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using these credentials' });
        }
        else {

            if (UserData.status != 'Approved') {
                return res.send({ responseCode: 201, data: {}, msg: "User is not activated, please contact admin.." });
            }
            // generate token using SHA256------------------------------------------------------------------------------------
            let TempToken = req.body.userId + JusbidKey + req.body.userId;
            sails.log(TempToken, 'TempToken');
            var ciphertext = CryptoJS.AES.encrypt(TempToken, JusbidKey).toString();
            await User.updateOne({ userId: UserData.userId }).set({ userToken: ciphertext });
            UserData.userToken = ciphertext;
            //-----------------------------------------------------------------------------------------------------------------
            return res.send({ responseCode: 200, data: UserData, msg: "Welcome back " + UserData.firstname + ", you have logged in successfully!" });
        }

    },


    Hotelier_Login: async (req, res) => {

        let SelectedFields = ['id', 'image', 'name', 'email'];

        if (!req.body.userId && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide login credentials' });
        }

        var UserData = await User.findOne({
            userId: req.body.userId, password: req.body.password
        });

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using these credentials' });
        }
        else {

            if (UserData.hotel_id) {
                let Hotelier = await Hotel.findOne({ select: SelectedFields }).where({ id: UserData.hotel_id });
                UserData.hotel = Hotelier;
            }
            else {
                UserData.hotel = {};
            }

            if (UserData.status != 'Approved') {
                return res.send({ responseCode: 201, data: {}, msg: "User is not activated, please contact admin.." });
            }
            // generate token using SHA256------------------------------------------------------------------------------------
            let TempToken = req.body.userId + JusbidKey + req.body.userId;
            sails.log(TempToken, 'TempToken');
            var ciphertext = CryptoJS.AES.encrypt(TempToken, JusbidKey).toString();
            await User.updateOne({ userId: UserData.userId }).set({ userToken: ciphertext });
            UserData.userToken = ciphertext;
            //-----------------------------------------------------------------------------------------------------------------
            return res.send({ responseCode: 200, data: UserData, msg: "Welcome back " + UserData.firstname + ", you have logged in successfully!" });
        }

    },


    FrontUserLogin: async (req, res) => {
        // add case insensitive logic---------------------------------------------------------------------------------------------------------------

        if (!req.body.user && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide login credentials' });
        }

        var UserData;

        UserData = await User.findOne({
            //    select: ['userId', 'id', 'firstname', 'lastname', 'email', 'userId', 'mobile', 'userToken', 'password', 'role']
        }).where({ email: req.body.user, password: req.body.password, role: [4, 6] });

        if (!UserData) {
            UserData = await User.findOne({
                //select: ['userId', 'id', 'firstname', 'lastname', 'email', 'userId', 'mobile', 'userToken', 'password', 'role']
            }).where({ mobile: req.body.user, password: req.body.password, role: [4, 6] });
        }

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'No user found using these credentials' });
        }
        else {
            // generate token using SHA256------------------------------------------------------------------------------------
            let TempToken = req.body.user + JusbidKey + req.body.user;
            sails.log(TempToken, 'TempToken');
            var ciphertext = CryptoJS.AES.encrypt(TempToken, JusbidKey).toString();
            //await User.updateOne({ userId: UserData.userId }).set({ userToken: ciphertext });
            UserData.userToken = ciphertext;
            //-----------------------------------------------------------------------------------------------------------------
            return res.send({ responseCode: 200, data: UserData, msg: "Welcome back " + UserData.firstname + ", you have logged in successfully!" });
        }

    },


    LoginWithOTP: async (req, res) => {

        sails.log(req.body, 'otp login body');

        let SelectCols = ['id', 'userId', 'firstname', 'lastname', 'mobile', 'email', 'gender', 'dob', 'profile_img'];

        if (!req.body.mobile) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters to send OTP SMS' });
        }

        let UserData = await User.findOne({ mobile: req.body.mobile });

        if (!UserData) {
            return res.send({ responseCode: 201, data: null, msg: 'No user found using this mobile number' });
        }

        let OTP = Math.floor(100000 + Math.random() * 900000);
        sails.log('sending otp to', req.body.mobile);
        functions2.Send_OTP_SMS(req.body.mobile, OTP);

        return res.send({ responseCode: 200, data: { datakey: OTP + 121212, userdata: UserData }, msg: 'SMS Sent to your registered number' });

    },


    ForgotPassword: async (req, res) => {

        let UserData = await User.findOne({}).where({ email: req.body.email, userId: req.body.userId });

        if (UserData) {
            // Send email for resetting password...........................
            mailer.forgotPassword(UserData);

            return res.send({ responseCode: 200, data: UserData, msg: 'Reset password email sent to your account..' });
        } else {
            return res.send({ responseCode: 201, data: UserData, msg: 'User with these credentials does not exists, please try again..' });
        }
    },

    ForgotUserPassword: async (req, res) => {

        if (!req.body.email) {
            return res.send({ responseCode: 201, data: UserData, msg: 'Please provide email ID' });
        }

        let UserData = await User.findOne({}).where({ email: req.body.email });

        if (UserData) {
            // Send email for resetting password...........................

            mailer.forgotPassword(UserData);

            return res.send({ responseCode: 200, data: UserData, msg: 'Reset password email sent to your account..' });
        } else {
            return res.send({ responseCode: 201, data: UserData, msg: 'User with these credentials does not exists, please try again..' });
        }
    },

    Get_MultiChain_Hotels: async (req, res) => {

        if (!req.body.email) {
            return res.send({ responseCode: 200, data: UserData, msg: 'Please provide group hotel email..' });
        }

        let Hotels = await Hotel.find({ email: req.body.email });

        if (Hotels.length!=0) {
            return res.send({ responseCode: 200, data: Hotels, msg: 'Hotels Fetched!' });
        } else {
            return res.send({ responseCode: 201, data: Hotels, msg: 'Unable to find group hotels using this email address!' });
        }

    },


    Login_MultiChain_Hotels: async (req, res) => {

        let SelectedFields = ['id', 'image', 'name', 'email'];

        if (!req.body.hotel_id && !req.body.password) {
            return res.send({ responseCode: 200, data: UserData, msg: 'Please provide required parameters..' });
        }

        let Hotelier = await User.findOne({ hotel_id: req.body.hotel, password: req.body.password });

        if (Hotelier) {
            if (Hotelier.hotel_id) {
                let HotelData = await Hotel.findOne({ select: SelectedFields }).where({ id: Hotelier.hotel_id });
                Hotelier.hotel = HotelData;
            }
            return res.send({ responseCode: 200, data: Hotelier, msg: 'Hotels Fetched!' });
        } else {
            return res.send({ responseCode: 201, data: Hotelier, msg: 'Unable to find group hotels using these credentials!' });
        }

    },




}