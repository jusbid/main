var async = require('async');
var SHA256 = require("crypto-js/sha256");
var JusbidBase64 = "anVzYmlk";

module.exports = {





    Create_Admin: async (req, res) => {


        let EmailCheck = await SystemUser.findOne({ userId: "jradmin" });
        if (EmailCheck) { return res.send({ responseCode: 201, msg: 'User with this email already exists' }); }

        let UserData = await SystemUser.create({
            password: "jradmin2021",
            userId: "jradmin",
            email: "info@jusbid.in",
            name: "Rudrohom Admin 2",
            mobile: "123456789",
            role: "0",
        }).fetch();

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'User not saved' });
        } else {
            return res.send({ responseCode: 200, msg: 'User created successfully', data: UserData });
        }

    },

    Create_System_User: async (req, res) => {

        let EmailCheck = await SystemUser.findOne({ email: req.body.email });
        if (EmailCheck) { return res.send({ responseCode: 201, msg: 'System User with this email already exists' }); }

        let UserCounts = await SystemUser.count();

        let UserId_Key = req.body.name.substring(0, 2) + '' + (parseInt(UserCounts) + 1);

        let UserData = await SystemUser.create({
            password: req.body.password,
            userId: UserId_Key,
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            city: req.body.city,
            state: req.body.state,
            zone: req.body.zone,
            role: req.body.role,
            department: req.body.department,
            country: req.body.country
        }).fetch();

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'System User not saved' });
        } else {
            return res.send({ responseCode: 200, msg: 'System User created successfully', data: UserData });
        }

    },

    Update_System_User: async (req, res) => {

        let userIdCheck = await SystemUser.findOne({ userId: req.body.userId });
        if (!userIdCheck) { return res.send({ responseCode: 201, msg: 'User with this userId not found' }); }

        let UserData = await SystemUser.updateOne({ userId: req.body.userId }).set({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            city: req.body.city,
            state: req.body.state,
            zone: req.body.zone,
            role: req.body.role,
            country: req.body.country,
            department: req.body.department,
        });

        if (!UserData) {
            return res.send({ responseCode: 201, msg: 'System User not updated' });
        } else {
            return res.send({ responseCode: 200, msg: 'System User updated successfully', data: UserData });
        }

    },

    System_Users_List: async (req, res) => {

        let SystemUsers = await SystemUser.find({});

        if (!SystemUsers) {
            return res.send({ responseCode: 201, msg: 'System Users not fetched' });
        } else {
            return res.send({ responseCode: 200, msg: 'System Users fetched successfully', data: SystemUsers });
        }

    },

    Get_Dashboard_Counts_SystemUsers: async (req, res) => {

        let userId = req.body.userId;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        let roleId = UserData.role;

        var Pass_Zone;
        var Pass_State;
        var Pass_City;
        if(roleId == 1 || roleId == '1'){
            Pass_Zone = UserData.zone
        }
        else if(roleId == 2 || roleId == '2'){
            Pass_State = UserData.state
        }
        else if(roleId == 3 || roleId == '3'){
            Pass_City = UserData.city
        }

        //Get BDE Counts-------------------------------------------------------------

        let BDEUserApproved = await User.count({ status: "Approved", role: 3, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let BDEUserDeclined = await User.count({ status: "Declined", role: 3, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let BDEUserOnHold = await User.count({ status: "OnHold", role: 3, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let BDEUserBlocked = await User.count({ status: "Processing", role: 3, state:Pass_Zone, state:Pass_State, city:Pass_City });

        //Get BDE Counts-------------------------------------------------------------

        let BDMUserApproved = await User.count({ status: "Approved", role: 2, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let BDMUserDeclined = await User.count({ status: "Declined", role: 2, state:Pass_Zone, state:Pass_State, city:Pass_City });

        //Travel Agent Counts

        let TravelAgentApproved = await User.count({ status: "Approved", role: 4, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let TravelAgentDeclined = await User.count({ status: "Declined", role: 4, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let TravelAgentOnHold = await User.count({ status: "OnHold", role: 4, state:Pass_Zone, state:Pass_State, city:Pass_City });
        let TravelAgentBlocked = await User.count({ status: "Processing", role: 4, state:Pass_Zone, state:Pass_State, city:Pass_City });

        //Hotel Counts

        let HotelApproved = await Hotel.count({ status: "Approved", state:Pass_Zone, state:Pass_State, city:Pass_City });
        let HotelBlocked = await Hotel.count({ status: "Blocked", state:Pass_Zone, state:Pass_State, city:Pass_City });
        let HotelProcessing = await Hotel.count({ status: "Processing", state:Pass_Zone, state:Pass_State, city:Pass_City });
        let HotelDeclined = await Hotel.count({ status: "Declined", state:Pass_Zone, state:Pass_State, city:Pass_City });
        let HotelOnHold = await Hotel.count({ status: "OnHold", state:Pass_Zone, state:Pass_State, city:Pass_City });
        let HotelReAssigned = await Hotel.count({ status: "ReAssigned", state:Pass_Zone, state:Pass_State, city:Pass_City });



        var DataCounts = {
            Hotel: {
                Approved: HotelApproved,
                Blocked: HotelBlocked,
                Processing:HotelProcessing,
                Declined:HotelDeclined,
                OnHold:HotelOnHold,
                ReAssigned:HotelReAssigned
            },

            BDE: {
                Approved: BDEUserApproved,
                Declined: BDEUserDeclined,
                Hold: BDEUserOnHold,
                Processing: BDEUserBlocked
            },

            BDM: {
                Approved: BDMUserApproved,
                Declined: BDMUserDeclined,
            },

            TravelAgent: {
                Approved: TravelAgentApproved,
                Declined: TravelAgentDeclined,
                Hold: TravelAgentOnHold,
                Processing: TravelAgentBlocked
            },

        }
        return res.send({ responseCode: 200, data: DataCounts });
    },

    Get_Users_Admin: async (req, res) => {

        let userId = req.body.userId;
        let role = req.body.role;
        var is_systemuser = true;

        if (!userId && !roleId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        let roleId = UserData.role;
        var UserResultData;
        if (is_systemuser) {

            sails.log(UserData, 'UserData');

            if (roleId == 0 || roleId == '0') {
                UserResultData = await User.find({ role: role, is_deleted: false }).sort('createdAt DESC');
            }
            else if (roleId == 1 || roleId == '1') {
                //-----add selected states requested over zones------------------
                UserResultData = await User.find({ role: role, state: UserData.zone, is_deleted: false }).sort('createdAt DESC');
            }
            else if (roleId == 2 || roleId == '2') {
                UserResultData = await User.find({ role: role, assigned_state: UserData.state, is_deleted: false }).sort('createdAt DESC');
            }
            else if (roleId == 3 || roleId == '3') {
                sails.log('in role 3', UserData.state, UserData.city)
                UserResultData = await User.find({ role: role, assigned_city: UserData.city, assigned_state: UserData.state, is_deleted: false }).sort('createdAt DESC');
            }
            else if(roleId == 4 || roleId == '4'){
                UserResultData = await User.find({ role: role, is_deleted: false }).sort('createdAt DESC');
            }

            sails.log(roleId, 'roleId');

        } else {
            UserResultData = await User.find({ role: role, is_deleted: false }).sort('createdAt DESC');
        }

        if (!UserData) {
            return res.send({ responseCode: 201, data: {}, msg: 'No user found using this criteria' });
        }
        else {
            return res.send({ responseCode: 200, data: UserResultData });
        }

    },





    Get_All_Admin_Complaints: async (req, res) => {


        let userId = req.body.userId;
        var is_systemuser = true;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        let roleId = UserData.role;
        var complaintsData;
        if (is_systemuser) {

            if (roleId == 0 || roleId == '0') {
                complaintsData = await Complaints.find({}).sort('createdAt DESC');
            }
            else if (roleId == 1 || roleId == '1') {
                //-----add selected states requested over zones------------------
                complaintsData = await Complaints.find({ hotel_state: UserData.zone }).sort('createdAt DESC');
            }
            else if (roleId == 2 || roleId == '2') {
                complaintsData = await Complaints.find({ hotel_state: UserData.state }).sort('createdAt DESC');
            }
            else if (roleId == 3 || roleId == '3') {
                complaintsData = await Complaints.find({ hotel_state: UserData.state, hotel_city: UserData.city }).sort('createdAt DESC');
            }

        } else {
            complaintsData = await Complaints.find({}).sort('createdAt DESC');
        }

        return res.send({ responseCode: 200, msg: 'complaint fetched', data: complaintsData });
    },



    Get_Rejected_Bids_Admin: async (req, res) => {

        let BidsAll = await RejectedBids.find({}).sort('createdAt DESC');


        let userId = req.body.userId;
        var is_systemuser = true;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        async.forEachOf(BidsAll, function (BidData, i, callback) {

            Hotel.findOne({ id: BidData.hotel_id }).exec(function (err, HotelDataLoop) {
                BidsAll[i].state = HotelDataLoop.state;
                BidsAll[i].city = HotelDataLoop.city;
                callback();
            });

        }, function (err) {
            if (err) { sails.log(err, 'in rejected bids admin API') }

            let roleId = UserData.role;
            var BidsAllFinal;
            if (is_systemuser) {

                if (roleId == 0 || roleId == '0') {
                    BidsAllFinal = BidsAll;
                }
                else if (roleId == 1 || roleId == '1') {
                    //-----add selected states requested over zones------------------
                    let zones = UserData.zone;
                    BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
                }
                else if (roleId == 2 || roleId == '2') {
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state });
                }
                else if (roleId == 3 || roleId == '3') {
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state && UserData.city == itm.city });
                }

            } else {
                BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
            }


            if (!BidsAll) {
                return res.send({ responseCode: 201, msg: 'Rejected Bid not found' });
            } else {
                return res.send({ responseCode: 200, msg: 'Rejected Bids fetched successfully', data: BidsAllFinal });

            }
        });



    },


    Get_All_Bids_Admin: async (req, res) => {

        let StartDate = req.body.start_date;
        let EnDate = req.body.end_date;
        var BidsAll = [];

        if (StartDate && EnDate) {
            BidsAll = await Bids.find({

                updatedAt: { '>': new Date(StartDate), '<': new Date(EnDate) }

            }).sort('updatedAt DESC');
        } else {
            BidsAll = await Bids.find({
            }).sort('updatedAt DESC');
        }

        //-----filter data on role basis---------------------------------------------------------------------------

        let userId = req.body.userId;
        var is_systemuser = true;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        async.forEachOf(BidsAll, function (BidData, i, callback) {

            Hotel.findOne({ id: BidData.hotel_id }).exec(function (err, HotelDataLoop) {
                BidsAll[i].state = HotelDataLoop.state;
                BidsAll[i].city = HotelDataLoop.city;
                callback();
            });

        }, function (err) {

            if (err) { sails.log(err, 'in rejected bids admin API') }

            let roleId = UserData.role;
            var BidsAllFinal;
            if (is_systemuser) {

                if (roleId == 0 || roleId == '0') {
                    BidsAllFinal = BidsAll;
                }
                else if (roleId == 1 || roleId == '1') {
                    //-----add selected states requested over zones------------------
                    let zones = UserData.zone;
                    BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
                }
                else if (roleId == 2 || roleId == '2') {
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state });
                }
                else if (roleId == 3 || roleId == '3') {
                    sails.log(roleId + 'in role this');
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state && UserData.city == itm.city });
                }

            } else {
                BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
            }


            if (!BidsAll) {
                return res.send({ responseCode: 201, msg: 'Rejected Bid not found' });
            } else {
                return res.send({ responseCode: 200, msg: 'Rejected Bids fetched successfully', data: BidsAllFinal });

            }

        });

    },



    Get_All_Bookings_Admin: async (req, res) => {

        let StartDate = req.body.start_date;
        let EnDate = req.body.end_date;
        var BidsAll = [];

        if (StartDate && EnDate) {
            BidsAll = await Bookings.find({

                createdAt: { '>': new Date(StartDate), '<': new Date(EnDate) }

            }).sort('createdAt DESC');
        } else {
            BidsAll = await Bookings.find({
                where: {
                    createdAt: {
                        '<': new Date('2028-04-26T14:56:21.774Z')
                    }
                }
            }).limit(100).sort('createdAt DESC');
        }

        //-----filter data on role basis---------------------------------------------------------------------------

        let userId = req.body.userId;
        var is_systemuser = true;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        async.forEachOf(BidsAll, function (BidData, i, callback) {

            Hotel.findOne({ id: BidData.hotel_id }).exec(function (err, HotelDataLoop) {
                BidsAll[i].state = HotelDataLoop.state;
                BidsAll[i].city = HotelDataLoop.city;
                callback();
            });

        }, function (err) {

            sails.log(BidsAll);
            if (err) { sails.log(err, 'in rejected bids admin API') }

            let roleId = UserData.role;
            var BidsAllFinal;
            if (is_systemuser) {

                if (roleId == 0 || roleId == '0') {
                    BidsAllFinal = BidsAll;
                }
                else if (roleId == 1 || roleId == '1') {
                    //-----add selected states requested over zones------------------
                    let zones = UserData.zone;
                    BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
                }
                else if (roleId == 2 || roleId == '2') {
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state });
                }
                else if (roleId == 3 || roleId == '3') {
                    sails.log(roleId + 'in role this');
                    BidsAllFinal = BidsAll.filter(function (itm) { return UserData.state == itm.state && UserData.city == itm.city });
                }

            } else {
                BidsAllFinal = BidsAll.filter(function (itm) { return zones.includes(itm.state) });
            }


            if (!BidsAll) {
                return res.send({ responseCode: 201, msg: 'Bookings not found' });
            } else {
                return res.send({ responseCode: 200, msg: 'Bookings fetched successfully', data: BidsAllFinal });

            }

        });

    },


}