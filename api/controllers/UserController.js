var SHA256 = require("crypto-js/sha256");
var MD5 = require("crypto-js/md5");
var fs = require('fs');
var async = require('async');
const MaxBytesUpload_UserFile = 600000;


module.exports = {

    CreateUser: async (req, res) => {

        if (req._fileparser.form.bytesExpected > 1500000) {
            return res.send({ responseCode: 201, msg: 'Files exceeds limit of 1500Kb, Please upload files less than 300kb' });
        }

        var Mobile = req.body.mobile;
        var Firstname = req.body.firstname;
        var Lastname = req.body.lastname;

        if (!Firstname || !Lastname) {
            //-----sails.log('Please provide firstname & lastname');
            return res.send({ responseCode: 201, msg: 'Please provide firstname & lastname' });
        }

        let EmailCheck = await User.find({ email: req.body.email });
        if (EmailCheck.length == 1) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }
        if (EmailCheck.length >= 2) { return res.send({ responseCode: 201, msg: 'Multiple users exists with this email, unable to create user with this email' }); }


        let MobileCheck = await User.findOne({ mobile: Mobile });
        if (MobileCheck) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let UserCounts = await User.count();

        let save_userid = Firstname.substring(0, 2) + '' + Lastname.substring(0, 2) + '' + (parseInt(UserCounts) + 1);
        save_userid = save_userid.replace(/\s/g, 'j');
        let save_password = Firstname.substring(0, 2) + '' + Lastname.substring(0, 2) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();
        save_password = save_password.replace(/\s/g, 'j');
        var aadhar_front_link = '';
        var aadhar_back_link = '';
        var pan_link = '';
        var resume_link = '';
        var FilePrefixPath = functions.Get_FileUpload_Path();

        if (!fs.existsSync('assets/images/aadhar' + FilePrefixPath)) { fs.mkdir('assets/images/aadhar' + FilePrefixPath, function (err, result) { }); }
        if (!fs.existsSync('assets/images/resume' + FilePrefixPath)) { fs.mkdir('assets/images/resume' + FilePrefixPath, function (err, result) { }); }
        if (!fs.existsSync('assets/images/pan' + FilePrefixPath)) { fs.mkdir('assets/images/pan' + FilePrefixPath, function (err, result) { }); }

        //-----sails.log(FilePrefixPath, 'FilePrefixPath');

        req.file('aadhar_front').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/aadhar' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (err) return res.serverError(err);
            if (uploadedFiles1.length != 0) aadhar_front_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd); //-----sails.log(uploadedFiles1[0].fd, 'aadhar front');

        });

        req.file('aadhar_back').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/aadhar' + FilePrefixPath)
        }, function (err, uploadedFiles2) {
            if (err) return res.serverError(err);
            if (uploadedFiles2.length != 0) aadhar_back_link = functions.Get_Excluded_Path(uploadedFiles2[0].fd); //-----sails.log(uploadedFiles2[0].fd, 'aadhar back');
        });

        req.file('pan').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/pan' + FilePrefixPath)
        }, function (err, uploadedFiles3) {
            if (err) return res.serverError(err);
            if (uploadedFiles3.length != 0) pan_link = functions.Get_Excluded_Path(uploadedFiles3[0].fd);
            if (aadhar_front_link == '' || aadhar_back_link == '') {
                return res.send({ responseCode: 201, msg: 'Please provide aadhar & PAN card images ' });
            }

            User.create({
                password: save_password,
                userId: save_userid,
                email: req.body.email,
                firstname: Firstname,
                lastname: Lastname,
                mobile: req.body.mobile,
                role: req.body.role,
                dob: req.body.dob,
                gender: req.body.gender,
                // address keys----------------------------
                address: req.body.address,
                house_no: req.body.house_no,
                landmark: req.body.landmark,
                street: req.body.street,
                area: req.body.area,
                city: req.body.city,
                zip: req.body.zip,
                state: req.body.state,
                country: req.body.country,
                // doc links-------------------------------
                aadhar_front: aadhar_front_link,
                aadhar_back: aadhar_back_link,
                pan: pan_link,
                resume: resume_link,
                createdBy: req.body.createdBy,
                //new keys----------------------------------
                assigned_state: req.body.assigned_state,
                assigned_city: req.body.assigned_city

            }).fetch().exec(function (err, result) {
                if (!result) {
                    return res.send({ responseCode: 201, msg: 'User not saved', err: err });
                } else {
                    mailer.sendAgentMail(result);
                    return res.send({ responseCode: 200, msg: 'Your account has been created successfully, please wait for approval', data: result });
                }
            })
        });
    },


    CreateRestrictedUser: async (req, res) => {


        let EmailCheck = await SystemUser.findOne({ userId: "jusbid1" });
        if (EmailCheck) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }

        let UserData = await SystemUser.create({
            password: "jusbid",
            userId: "jusbid",
            email: "it@rudrohom.com",
            firstname: "Rudrohom",
            lastname: "Jusbid",
            mobile: "123456789",
            role: "1",
        }).fetch();

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'User not saved' });
        } else {
            return res.send({ responseCode: 200, msg: 'User created successfully', data: UserData });
        }

    },


    Set_Profile_Img: async (req, res) => {
        var FilePrefixPath = functions.Get_FileUpload_Path();
        if (!fs.existsSync('assets/images/profile' + FilePrefixPath)) { fs.mkdir('assets/images/profile' + FilePrefixPath, function (err, result) { }); }

        req.file('profile_img').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/profile' + FilePrefixPath)
        }, function (err, uploadedFiles1) {
            if (err) return res.serverError(err);
            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'User profile image not uploaded, please try again' });
            }
            profile_img = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            User.updateOne({
                userId: req.body.userId
            }).set({ profile_img: profile_img }).fetch().exec(function (err, result) {
                if (!result) {
                    return res.send({ responseCode: 201, msg: 'User profile image not saved', err: err });
                } else {
                    return res.send({ responseCode: 200, msg: 'User profile image updated successfully', path: profile_img });
                }
            })
        });
    },



    CreateBDMUser: async (req, res) => {

        let EmailCheck = await User.find({ email: req.body.email });
        if (EmailCheck.length == 1) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }
        if (EmailCheck.length >= 2) { return res.send({ responseCode: 201, msg: 'Multiple users exists with this email, unable to create user with this email' }); }


        if (!req.body.mobile) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide mobile number' });
        }

        //-----sails.log(req.body);

        let Mobile_Check = await User.findOne().where({
            mobile: req.body.mobile
        });

        if (Mobile_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let UserCounts = await User.count();

        let save_userid = req.body.firstname.substring(0, 2) + '' + req.body.lastname.substring(0, 2) + '' + (parseInt(UserCounts) + 1);

        let save_password = req.body.firstname.substring(0, 2) + '' + req.body.lastname.substring(0, 2) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();

        User.create({
            password: save_password,
            userId: save_userid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            role: req.body.role,
            dob: req.body.dob,
            gender: req.body.gender,
            // address keys----------------------------
            house_no: req.body.house_no,
            landmark: req.body.landmark,
            street: req.body.street,
            area: req.body.area,
            city: req.body.city,
            zip: req.body.zip,
            state: req.body.state,
            country: req.body.country,
            createdBy: req.body.createdBy,
            //-------------------------------------------
            assigned_city: req.body.assigned_city,
            assigned_state: req.body.assigned_state,
            status: req.body.status

        }).fetch().exec(function (err, result) {

            if (!result) {
                return res.send({ responseCode: 200, msg: 'User not saved', err: err });
            } else {
                mailer.sendWelcomeMail(result);
                return res.send({ responseCode: 200, msg: 'User created successfully', data: result });

            }
        })
    },

    Create_Senior_BDM_User: async (req, res) => {

        let EmailCheck = await User.find({ email: req.body.email });
        if (EmailCheck.length == 1) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }
        if (EmailCheck.length >= 2) { return res.send({ responseCode: 201, msg: 'Multiple users exists with this email, unable to create user with this email' }); }


        if (!req.body.mobile) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide mobile number' });
        }

        let Mobile_Check = await User.findOne().where({
            mobile: req.body.mobile
        });

        if (Mobile_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let UserCounts = await User.count();
        let save_userid = req.body.firstname.substring(0, 2) + '' + req.body.lastname.substring(0, 2) + '' + (parseInt(UserCounts) + 1);
        let save_password = req.body.firstname.substring(0, 2) + '' + req.body.lastname.substring(0, 2) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();

        User.create({
            password: save_password,
            userId: save_userid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            role: 7,
            dob: req.body.dob,
            gender: req.body.gender,
            // address keys----------------------------
            house_no: req.body.house_no,
            landmark: req.body.landmark,
            street: req.body.street,
            area: req.body.area,
            city: req.body.city,
            zip: req.body.zip,
            state: req.body.state,
            country: req.body.country,
            createdBy: req.body.createdBy,
            //-------------------------------------------
            assigned_city: req.body.assigned_city,
            assigned_state: req.body.assigned_state,
            child_bdm: req.body.child_bdm

        }).fetch().exec(function (err, result) {

            if (!result) {
                return res.send({ responseCode: 201, msg: 'User not saved', err: err });
            } else {
                mailer.sendWelcomeMail(result);
                return res.send({ responseCode: 200, msg: 'User created successfully', data: result });

            }
        })
    },


    Get_Senior_BDM_BDMS: async (req, res) => {

        let UserId = req.body.userId;

        if (!UserId) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters' });
        }

        let DataUser = await User.findOne({ userId: UserId });

        let BDMS = await User.find({ userId: DataUser.child_bdm });

        if (!BDMS) {
            return res.send({ responseCode: 201, msg: 'BDM User not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Users fetched successfully', data: BDMS });

        }

    },


    CreateFrontUser: async (req, res) => {

        if (!req.body.mobile && !req.body.password) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide mobile number & password' });
        }

        let EmailCheck = await User.find().where({ email: req.body.email });

        if (EmailCheck.length != 0) {
            sails.log('email aready exists case', EmailCheck.length);
            return res.send({ responseCode: 201, data: {}, msg: 'User with this email already exists' });
        }

        let Mobile_Check = await User.find().where({ mobile: req.body.mobile });

        if (Mobile_Check.length != 0) {
            sails.log('mobile aready exists case', Mobile_Check.length);
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let UserCounts = await User.count();

        let save_userid = req.body.firstname.substring(0, 2) + '' + req.body.lastname.substring(0, 2) + '' + (parseInt(UserCounts) + 1);

        let UserData = await User.create({
            password: req.body.password,
            userId: save_userid,
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            role: 6,
            status: 'Approved',
            createdBy: req.body.createdBy
        }).fetch();

        if (!UserData) {
            sails.log('201 added user front');
            return res.send({ responseCode: 201, msg: 'User not saved' });
        } else {
            sails.log('201 added user front');
            return res.send({ responseCode: 200, msg: 'User created successfully', data: UserData });

        }
    },



    OnBoard_Agent: async (req, res) => {

        if (!req.body.agent_name || !req.body.contact_no) { return res.send({ responseCode: 201, msg: 'Please provide agent name & contact number' }); }

        let Mobile_Check = await User.findOne({}).where({ mobile: req.body.contact_no });

        if (Mobile_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' });
        }

        let Email_Check = await User.find({ email: req.body.email });
        if (Email_Check.length > 0) { return res.send({ responseCode: 201, data: {}, msg: 'User with this email already exists' }); }
        let UserCounts = await User.count();

        //----------------------generate user id and password---------------------------------------------------------------------------------------------
        let randomString = (Math.random() + 1).toString(36).substring(8);
        let save_userid = req.body.agent_name.substring(0, 4) + randomString + (parseInt(UserCounts) + 1);
        if (save_userid) { save_userid = save_userid.replace(/ /g, "j"); }
        let save_password = req.body.agent_name.substring(0, 4) + randomString + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();
        if (save_password) { save_password = save_password.replace(/ /g, "j"); }

        //upload multiple documents----------------------------------------------------------------------------------------------------------------------------
        var aadhar_front_link = '';
        var aadhar_back_link = '';
        var gst_cert = '';
        var bank_proof = '';
        var other = '';
        var pan_card_img = '';

        var FilePrefixPath = functions.Get_FileUpload_Path();
        if (!fs.existsSync('assets/images/documents' + FilePrefixPath)) { fs.mkdir('assets/images/documents' + FilePrefixPath, function (err, result) { }); }

        req.file('pan_card_img').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles6) {
            if (err) return res.serverError(err);
            if (uploadedFiles6.length != 0) pan_card_img = functions.Get_Excluded_Path(uploadedFiles6[0].fd);

            sails.log(pan_card_img, 'pan_card_img');

        });

        req.file('aadhar_back').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles2) {
            if (err) return res.serverError(err);
            if (uploadedFiles2.length != 0) aadhar_back_link = functions.Get_Excluded_Path(uploadedFiles2[0].fd);
        });

        req.file('gst_cert').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles3) {
            if (err) return res.serverError(err);
            if (uploadedFiles3.length != 0) gst_cert = functions.Get_Excluded_Path(uploadedFiles3[0].fd);
        });

        req.file('bank_proof').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles4) {
            if (err) return res.serverError(err);
            if (uploadedFiles4.length != 0) bank_proof = functions.Get_Excluded_Path(uploadedFiles4[0].fd);
        });

        req.file('other').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles5) {
            if (err) return res.serverError(err);
            if (uploadedFiles5.length != 0) other = functions.Get_Excluded_Path(uploadedFiles5[0].fd);
        });
        //-------------------------------------------------------------------------------------------------------------------------------------------------


        req.file('aadhar_front').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (err) return res.serverError(err);
            if (uploadedFiles1.length != 0) aadhar_front_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            setTimeout(() => {

                User.create({
                    parent_bde: req.body.parent_bde,
                    password: save_password,
                    userId: save_userid,
                    email: req.body.email,
                    company_name: req.body.company_name,
                    firstname: req.body.agent_name,
                    mobile: req.body.contact_no,
                    landline: req.body.landline,
                    role: req.body.role,
                    pan: req.body.pan,
                    gst_no: req.body.gst_no,
                    commission: req.body.commission,
                    zip: req.body.zip,
                    city: req.body.city,
                    state: req.body.state,
                    area: req.body.area,
                    country: req.body.country,
                    address: req.body.address,
                    gender: req.body.gender,
                    house_no: req.body.house_no,
                    dob: req.body.dob,
                    createdBy: req.body.createdBy,
                    role: 4,
                    // address keys----------------------------
                    assigned_city: req.body.assigned_city,
                    assigned_state: req.body.assigned_state,
                    //-------documents--------------------
                    aadhar_front: aadhar_front_link,
                    aadhar_back: aadhar_back_link,
                    gst_cert: gst_cert,
                    bank_proof: bank_proof,
                    pan_card_img: pan_card_img,
                    other: other

                }).fetch().exec(function (err, result) {

                    if (!result) {
                        return res.send({ responseCode: 201, msg: 'Agent not saved', err: err });
                    } else {

                        // Add Bank Details for Agent---------------------------------------------

                        let BankDetailsData = BankDetails.create({
                            userId: save_userid,
                            bank_account_name: req.body.bank_account_name,
                            bank_name: req.body.bank_name,
                            account_no: req.body.account_no,
                            ifsc: req.body.ifsc,
                            bank_branch: req.body.bank_branch
                        }).fetch().exec(function (err, result) { });

                        result.BankDetailsData = BankDetailsData;

                        //mailer.sendAgentMail(result);

                        NotificationsFunctions.AgentAddNotification_BDM_BDE(req.body.parent_bde, req.body.agent_name);
                        return res.send({ responseCode: 200, msg: 'Agent created successfully', data: result });
                    }
                });

            }, 3000);

        });
    },

    Edit_OnBoard_Agent: async (req, res) => {

        if ( !req.body.userId) { return res.send({ responseCode: 201, msg: 'Please provide user Id' }); }

        let Mobile_Check = await User.findOne({userId: req.body.userId});

        if (!Mobile_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'User with this id does not exists' });
        }

        var aadhar_front_link = undefined;
        var aadhar_back_link = undefined;
        var gst_cert = undefined;
        var bank_proof = undefined;
        var other = undefined;
        var pan_card_img = undefined;

        var FilePrefixPath = functions.Get_FileUpload_Path();
        if (!fs.existsSync('assets/images/documents' + FilePrefixPath)) { fs.mkdir('assets/images/documents' + FilePrefixPath, function (err, result) { }); }

        req.file('pan_card_img').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles6) {
            if (err) return res.serverError(err);
            if (uploadedFiles6.length != 0) pan_card_img = functions.Get_Excluded_Path(uploadedFiles6[0].fd);
            sails.log(pan_card_img, 'pan_card_img');
        });

        req.file('aadhar_back').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles2) {
            if (err) return res.serverError(err);
            if (uploadedFiles2.length != 0) aadhar_back_link = functions.Get_Excluded_Path(uploadedFiles2[0].fd);
        });

        req.file('gst_cert').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles3) {
            if (err) return res.serverError(err);
            if (uploadedFiles3.length != 0) gst_cert = functions.Get_Excluded_Path(uploadedFiles3[0].fd);
        });

        req.file('bank_proof').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles4) {
            if (err) return res.serverError(err);
            if (uploadedFiles4.length != 0) bank_proof = functions.Get_Excluded_Path(uploadedFiles4[0].fd);
        });

        req.file('other').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles5) {
            if (err) return res.serverError(err);
            if (uploadedFiles5.length != 0) other = functions.Get_Excluded_Path(uploadedFiles5[0].fd);
        });
        //-------------------------------------------------------------------------------------------------------------------------------------------------


        req.file('aadhar_front').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (err) return res.serverError(err);
            if (uploadedFiles1.length != 0) aadhar_front_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            setTimeout(() => {

                User.updateOne({ userId: req.body.userId }).set({
                    pan: req.body.pan,
                    gst_no: req.body.gst_no,
                    // address keys----------------------------
                    aadhar_front: aadhar_front_link,
                    aadhar_back: aadhar_back_link,
                    gst_cert: gst_cert,
                    bank_proof: bank_proof,
                    pan_card_img: pan_card_img,
                    other: other
                }).fetch().exec(function (err, result) {
                    if (!result) {
                        return res.send({ responseCode: 201, msg: 'Agent not saved', err: err });
                    } else {
                        return res.send({ responseCode: 200, msg: 'Agent updated successfully', data: result });
                    }
                });

            }, 3000);

        });
    },


    CreateAgentRequest: async (req, res) => {

        let Mobile_Check = await User.findOne({}).where({ mobile: req.body.contact_no });

        if (Mobile_Check) { return res.send({ responseCode: 201, data: {}, msg: 'User with this mobile number already exists' }); }

        let Email_Check = await User.findOne({ email: req.body.email });

        if (Email_Check) { return res.send({ responseCode: 201, data: {}, msg: 'User with this email already exists' }); }

        let UserCounts = await User.count();

        let save_userid = req.body.agent_name.substring(0, 4) + '' + (parseInt(UserCounts) + 1);

        let save_password = req.body.agent_name.substring(0, 4) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();

        let UserData = await User.create({
            password: save_password,
            userId: save_userid,
            email: req.body.email,
            company_name: req.body.company_name,
            firstname: req.body.agent_name,
            mobile: req.body.contact_no,
            landline: req.body.landline,
            role: 4,
            city: req.body.city,
            state: req.body.state,
            area: req.body.area,
            country: req.body.country,
            address: req.body.address,
            status: 'Front_Added',
            createdBy: req.body.createdBy
        }).fetch();

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'Agent not saved' });
        } else {
            mailer.sendWelcomeMail(UserData);
            return res.send({ responseCode: 200, msg: 'Agent created successfully', data: UserData });
        }

    },


    Update_Bank_Details: async (req, res) => {

    },

    UpdateFrontUserStatus: async (req, res) => {

        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Please provide userId' });
        }

        let UpdatesUserData = await User.updateOne({ userId: req.body.userId }).set({
            status: req.body.status
        });

        return res.send({ responseCode: 200, data: UpdatesUserData, msg: 'User Status Updated' });
    },

    UpdateUser: async (req, res) => {

        sails.log(req.body, 'update data');

        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Please provide & userId' });
        }

        let userCheck = await User.find({ userId: req.body.userId });

        if (userCheck.length == 0) {
            return res.send({ responseCode: 201, msg: 'User Not Found' });
        }

        let UpdatesUserData = await User.updateOne({ userId: req.body.userId }).set({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            dob: req.body.dob,
            gender: req.body.gender,
            // address keys----------------------------
            address: req.body.address,
            house_no: req.body.house_no,
            landmark: req.body.landmark,
            street: req.body.street,
            area: req.body.area,
            city: req.body.city,
            zip: req.body.zip,
            state: req.body.state,
            country: req.body.country,
            parent_bdm: req.body.parent_bdm,
            updatedBy: req.body.updatedBy,
            company_name: req.body.company_name,
            // new keys----------------------------------
            assigned_state: req.body.assigned_state,
            assigned_city: req.body.assigned_city,
            //----------------------------------------------------------------
            child_bdm: req.body.child_bdm,

        });

        return res.send({ responseCode: 200, data: UpdatesUserData, msg: 'User Updated' });
    },


    UpdateUserAdmin: async (req, res) => {

        sails.log(req.body, 'update data');

        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Please provide & userId' });
        }

        let userCheck = await User.find({ userId: req.body.userId });

        if (userCheck.length == 0) {
            return res.send({ responseCode: 201, msg: 'User Not Found' });
        }

        let UpdatesUserData = await User.updateOne({ userId: req.body.userId }).set({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobile: req.body.mobile,
            dob: req.body.dob,
            gender: req.body.gender,
            // address keys----------------------------
            address: req.body.address,
            house_no: req.body.house_no,
            landmark: req.body.landmark,
            street: req.body.street,
            area: req.body.area,
            city: req.body.city,
            zip: req.body.zip,
            state: req.body.state,
            country: req.body.country,
            parent_bdm: req.body.parent_bdm,
            updatedBy: req.body.updatedBy,
            company_name: req.body.company_name,
            // new keys----------------------------------
            assigned_state: req.body.assigned_state,
            assigned_city: req.body.assigned_city,
            //----------------------------------------------------------------
            child_bdm: req.body.child_bdm,
            userId: req.body.userId,
        });

        return res.send({ responseCode: 200, data: UpdatesUserData, msg: 'User Updated' });
    },





    ChangePassword: async (req, res) => {

        if (!req.body.current_password || !req.body.userId || !req.body.new_password) {
            return res.send({ responseCode: 201, msg: 'please provide all parameters' });
        }

        sails.log(req.body, 'changepass');

        let UserData = await User.findOne({ password: req.body.current_password, userId: req.body.userId });

        if (UserData) {

            await User.updateOne({ userId: req.body.userId }).set({ password: req.body.new_password });

            return res.send({ responseCode: 200, data: UserData, msg: 'Your password has been changed' });
        } else {
            return res.send({ responseCode: 201, data: {}, msg: 'User with these credentials does not exists, please try again..' });
        }
    },

    GetUserProfile: async (req, res) => {

        let UserData = await User.findOne({

        }).where({ userId: req.body.userId });

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'User not found..' });
        }

        let BankDetailsData = await BankDetails.findOne({
            userId: req.body.userId
        });

        if (!BankDetailsData) { BankDetailsData = {} }

        UserData.bankDetails = BankDetailsData;

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using this userId' });
        }
        else {
            return res.send({ responseCode: 200, data: UserData });
        }

    },


    Get_Limit_Details: async (req, res) => {

        let UserData = await User.findOne({

        }).where({ userId: req.body.userId, select: ['id', 'userId', 'firstname', 'lastname', 'role'] });

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using this userId' });
        }
        else {
            return res.send({ responseCode: 200, data: UserData });
        }

    },

    Get_UserList: async (req, res) => {

        let RoleId = req.body.roleId;

        if (!RoleId) {
            return res.send({ responseCode: 201, data: {}, msg: 'roleId parameter not found' });
        }

        let UserData = await User.find({

        }).where({ role: RoleId }).sort('createdAt DESC');

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using this criteria' });
        }
        else {
            return res.send({ responseCode: 200, data: UserData });
        }

    },


    Get_Filtered_Users: async (req, res) => {

        let filterBy_Key = req.body.filterBy;
        let searchKey = req.body.searchKey;
        let roleId = req.body.roleId;

        if (!filterBy_Key && !searchKey && !roleId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide both parameters' });
        }

        var Query = {};

        if (filterBy_Key == 'firstname') {
            Query = { firstname: { startsWith: searchKey }, role: roleId, is_deleted: false };
        }
        else if (filterBy_Key == 'userId') {
            Query = { userId: { startsWith: searchKey }, role: roleId, is_deleted: false };
        }
        else if (filterBy_Key == 'status') {
            Query = { status: { startsWith: searchKey }, role: roleId, is_deleted: false };

        }

        let UserData = await User.find(Query).sort('createdAt DESC');

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using this criteria' });
        }
        else {
            return res.send({ responseCode: 200, data: UserData });
        }

    },

    Update_User_Status: async (req, res) => {

        if (!req.body.userId || !req.body.status) {
            return res.send({ responseCode: 201, msg: 'Please provide both userId & status' });
        }

        var UpdatedUser = await User.updateOne({ userId: req.body.userId }).set({ status: req.body.status, statusNote: req.body.statusNote });
        if (UpdatedUser) {
            NotificationsFunctions.CreateUserNotification('Profile Updated', 'Your profile is updated, status changed to ' + req.body.status, UpdatedUser.role, 'Status', req.body.userId);
            // Also send to CC BDM----------
            if (UpdatedUser.role == 3 && UpdatedUser.parent_bdm) NotificationsFunctions.CreateUserNotification('BDE ' + UpdatedUser.firstname + ' Profile Updated', 'BDE ' + UpdatedUser.firstname + ' profile updated, status changed to ' + req.body.status, UpdatedUser.role, 'Status', UpdatedUser.parent_bdm);

            return res.send({ responseCode: 200, msg: 'User with userId ' + req.body.userId + ' is updated successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update user' });
        }

    },

    Delete_User: async (req, res) => {

        var RemovedUser = await User.updateOne({ userId: req.body.userId }).set({ is_deleted: true });
        if (RemovedUser) {
            return res.send({ responseCode: 200, msg: 'User with userId ' + RemovedUser.userId + ' is removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to remove user' });
        }

    },

    Change_User_Status: async (req, res) => {

        if (!req.body.userId || !req.body.status) {
            return res.send({ responseCode: 201, msg: 'Please provide both parameters userId & status' });
        }

        var UpdatedUser = await User.updateOne({ id: req.body.userId }).set({ status: req.body.status });

        if (UpdatedUser) {
            NotificationsFunctions.CreateUserNotification('Profile Updated', 'Your profile is updated, status changed to ' + req.body.status, UpdatedUser.role, 'Status', req.body.userId);
            // Also send to CC BDM----------
            if (UpdatedUser.role == 3 && UpdatedUser.parent_bdm) NotificationsFunctions.CreateUserNotification('BDE ' + UpdatedUser.firstname + ' Profile Updated', 'BDE ' + UpdatedUser.firstname + ' profile updated, status changed to ' + req.body.status, UpdatedUser.role, 'Status', UpdatedUser.parent_bdm);

            return res.send({ responseCode: 200, msg: 'User with userId ' + userId + ' is updated successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update user' });
        }

    },


    Update_User_Password: async (req, res) => {

        if (!req.body.userId || !req.body.password) {
            return res.send({ responseCode: 201, msg: 'Please provide both parameters userId & password' });
        }

        if (req.body.password.length < 7) {
            return res.send({ responseCode: 201, msg: 'Please provide password with min. 8 characters' });
        }

        var UpdatedUser = await User.updateOne({ userId: req.body.userId }).set({ password: req.body.password });

        if (UpdatedUser) {
            return res.send({ responseCode: 200, msg: 'User  password updated successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update user password' });
        }

    },


    Get_My_BDE: async (req, res) => {

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm'];
        let userId = req.body.userId;
        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }

        let UserDataApproved = await User.find({ select: SelectFields }).where({ parent_bdm: userId }).sort('createdAt DESC');

        async.forEachOf(UserDataApproved, function (value, i, callback) {

            Hotel.count({ bdeId: value.userId }).exec(function (err, HotelCounts) {
                UserDataApproved[i].lead_hotels = HotelCounts;
                callback();
            });

        }, function (err) {
            return res.send({ responseCode: 200, data: UserDataApproved, msg: 'BDM -> BDE List Fetched' });
        });
    },

    Get_My_BDE: async (req, res) => {

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm'];
        let userId = req.body.userId;
        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }

        let UserDataApproved = await User.find({ select: SelectFields }).where({ parent_bdm: userId }).sort('createdAt DESC');

        async.forEachOf(UserDataApproved, function (value, i, callback) {
            Hotel.count({ bdeId: value.userId }).exec(function (err, HotelCounts) {
                UserDataApproved[i].lead_hotels = HotelCounts;
                callback();
            });

        }, function (err) {
            return res.send({ responseCode: 200, data: UserDataApproved, msg: 'BDM -> BDE List Fetched' });
        });
    },


    Get_My_BDE_Admin: async (req, res) => {

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm'];
        let userId = req.body.userId;
        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }

        let Get_User_Data = await User.findOne({ userId: userId });

        let ParentBDM = userId;
        //--------------------Get Senior BDM All Records---------------------------------------------
        if (Get_User_Data.role == 7) {
            if (!Get_User_Data.child_bdm || Get_User_Data.child_bdm == []) {
                return res.send({ responseCode: 201, data: {}, msg: 'BDM under this senior BDM not found, please update user and try again' });
            }
            ParentBDM = Get_User_Data.child_bdm;

        } else {
            ParentBDM = userId;
        }


        let UserDataApproved = await User.find({ select: SelectFields }).where({ parent_bdm: ParentBDM }).sort('createdAt DESC');

        async.forEachOf(UserDataApproved, function (value, i, callback) {
            Hotel.count({ bdeId: value.userId }).exec(function (err, HotelCounts) {
                UserDataApproved[i].lead_hotels = HotelCounts;
                callback();
            });

        }, function (err) {
            return res.send({ responseCode: 200, data: UserDataApproved, msg: 'BDM -> BDE List Fetched' });
        });
    },


    UpdateMy_BDM: async (req, res) => {

        //-----sails.log(req.body, 'req.body');

        if (!req.body.userId || !req.body.parent_bdm) {
            return res.send({ responseCode: 201, msg: 'Please provide id & userId' });
        }

        let userCheck = await User.find({ userId: req.body.userId });

        sails.log('parentCheck', req.body.parent_bdm);

        let parentCheck = await User.findOne({ userId: req.body.parent_bdm });

        sails.log(parentCheck, 'parentCheck', req.body.parent_bdm);

        //-----sails.log(userCheck.length, 'Users found........');

        if (userCheck.length == 0) {
            return res.send({ responseCode: 201, msg: 'User Not Found' });
        }

        let UpdatesUserData = await User.updateOne({ userId: req.body.userId }).set({
            parent_bdm: req.body.parent_bdm
        });

        if (UpdatesUserData && parentCheck) {
            NotificationsFunctions.CreateUserNotification(parentCheck.firstname + ' ' + parentCheck.lastname + 'has assigned as your BDM', parentCheck.firstname + ' ' + parentCheck.lastname + ' has assigned as your BDM by admin, contact your BDM or Admin for any queries', UpdatesUserData.role, 'Assignment', req.body.userId);
            // Also send to CC BDM----------
            if (UpdatesUserData.role == 3 && UpdatesUserData.parent_bdm) NotificationsFunctions.CreateUserNotification('BDE ' + UpdatesUserData.firstname + 'is assigned to you', 'BDE ' + UpdatesUserData.firstname + ' is assigned to you by admin', UpdatesUserData.role, 'Assignment', UpdatesUserData.parent_bdm);
        }

        //-----sails.log(UpdatesUserData);

        return res.send({ responseCode: 200, data: UpdatesUserData, msg: 'User Updated' });
    },


    Get_TravelAgents_For_BDM: async (req, res) => {
        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm', 'role'];

        let CheckBDM = await User.find({ select: SelectFields }).where({ userId: req.body.userId, role: 2 });

        if (!CheckBDM) {
            return res.send({ responseCode: 201, msg: 'BDM not found using this user ID' });
        }

        let userId = req.body.userId;
        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }
        var MyBDE = [];
        let UserData = await User.find({ select: SelectFields }).where({ parent_bdm: userId, role: 3 }).sort('createdAt DESC');

        sails.log(UserData, 'UserData----->BDE', userId);

        async.forEachOf(UserData, function (value, i, callback) {
            //MY BDE UserId Collection------------------------------------------------------
            MyBDE.push(value.userId);
            callback();
        }, function (err) {
            if (err) { sails.log(err); }
            User.find({ select: SelectFields }).where({ parent_bde: MyBDE, role: 4 }).sort('createdAt DESC').exec(function (err, MyTravelAgents) {
                return res.send({ responseCode: 200, data: MyTravelAgents, msg: 'BDM -> BDE -> Travel Agents List Fetched' });
            });
        });

    },

    Search_TravelAgents_For_BDM: async (req, res) => {

        let userId = req.body.userId;

        let SearchKey = req.body.search_key;

        if (!SearchKey && !userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide both parameters' });
        }

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm', 'company_name', 'address'];

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }

        var MyBDE = [];

        let UserData = await User.find({ select: SelectFields }).where({ parent_bdm: userId, role: 3 }).sort('createdAt DESC');

        async.forEachOf(UserData, function (value, i, callback) {

            //MY BDE UserId Collection------------------------------------------------------
            MyBDE.push(value.userId);
            callback();

        }, function (err) {

            sails.log('MyBDE', MyBDE);

            if (err) { sails.log(err); }

            User.find({ select: SelectFields }).where({ parent_bde: MyBDE, role: 4, firstname: { startsWith: SearchKey } }).sort('createdAt DESC').exec(function (err, MyTravelAgents) {
                sails.log(MyTravelAgents, 'MyTravelAgents data');
                if (MyTravelAgents) {
                    var UserDataApproved = MyTravelAgents.filter(function (itm) { return itm.status == "Approved"; });

                    var UserDataPending = MyTravelAgents.filter(function (itm) { return itm.status == "Processing"; });
                } else {
                    var UserDataApproved = [];
                    var UserDataPending = [];
                }


                return res.send({ responseCode: 200, approved: UserDataApproved, pending: UserDataPending, msg: 'BDM -> BDE -> Travel Agents List Fetched' });

            });

        });

    },


    Get_TravelAgents_For_BDE: async (req, res) => {

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm'];

        let userId = req.body.userId;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }

        let UserData = await User.find({ select: SelectFields }).where({ parent_bde: userId, role: 4 }).sort('createdAt DESC');

        return res.send({ responseCode: 200, data: UserData, msg: ' BDE -> Travel Agents List Fetched' });

    },


    Restricted_Delete_User: async (req, res) => {

        if (!req.body.userId || !req.body.password || !req.body.delete_userId) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters' });
        }

        let SystemUserGet = await SystemUser.findOne({ userId: req.body.userId, password: req.body.password });

        if (!SystemUserGet) { return res.send({ responseCode: 201, msg: 'You do not have permissions to remove this user' }); }

        if (!req.body.userId) { return res.send({ responseCode: 201, msg: 'User id not found' }); }
        await User.destroyOne({ userId: req.body.delete_userId });
        return res.send({ responseCode: 200, msg: 'User Removed' });
    },


    Search_BDE_TravelAgents: async (req, res) => {

        var fieldsSelect = ['id', 'userId', 'firstname', 'lastname', 'parent_bdm', 'parent_bde', 'hotel_id', 'role', 'status', 'address', 'mobile', 'company_name', 'profile_img', 'city', 'state', 'country', 'address', 'landmark'];
        var search_key = req.body.search_key;
        var UserData = [];

        UserData = await User.find({ select: fieldsSelect }).where({ parent_bde: req.body.bde_id, firstname: { startsWith: search_key } }).sort("createdAt DESC");

        if (UserData.length == 0) {
            UserData = await User.find({ select: fieldsSelect }).where({ parent_bde: req.body.bde_id, mobile: { startsWith: search_key } }).sort("createdAt DESC");
        }


        if (UserData.length == 0) {
            UserData = await User.find({ select: fieldsSelect }).where({ parent_bde: req.body.bde_id, email: { startsWith: search_key } }).sort("createdAt DESC");
        }

        var UserDataApproved = UserData.filter(function (itm) { return itm.status == "Approved"; });

        var UserDataPending = UserData.filter(function (itm) { return itm.status == "Processing"; });

        if (UserDataPending.length == 0 && UserDataApproved.length == 0) {
            return res.send({ responseCode: 201, approved: [], pending: [], msg: 'No User found using this criteria' });
        }
        else {
            return res.send({ responseCode: 200, approved: UserDataApproved, pending: UserDataPending });
        }

    },

    Update_User_Token: async (req, res) => {

        let deviceToken = req.body.deviceToken;
        let UUID = req.body.UUID;
        let userId = req.body.userId;

        if (!deviceToken || !userId) { return res.send({ responseCode: 201, msg: 'Please supply required parameters' }); }

        let CurrentDateTime = new Date().toJSON().slice(0, 10) + " " + new Date(new Date()).toString().split(' ')[4];

        let UserUpdates = await User.updateOne({ userId: userId }).set({ deviceToken: deviceToken, uuid: UUID });

        if (UserUpdates) {
            return res.send({ responseCode: 200, msg: 'Device token updated successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update device info.' });
        }

    },


    Update_Column: async (req, res) => {

        let All = await User.find();

        async.forEachOf(All, function (value, i, callback) {

            User.updateOne({ userId: value.userId }).set({ is_deleted: false }).exec(function (err, HotelCounts) {
                callback();
            });


        }, function (err) {
            return res.send({ responseCode: 200, msg: 'user updated' });
        });


    }



};