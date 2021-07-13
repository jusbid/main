var fs = require('fs');
var async = require('async');

module.exports = {

    Get_Dashboard_Counts: async (req, res) => {

        //Get BDE Counts-------------------------------------------------------------
        let BDEUserApproved = await User.count({ status: "Approved", role: 3, is_deleted: false });
        let BDEUserDeclined = await User.count({ status: "Declined", role: 3, is_deleted: false });
        let BDEUserOnHold = await User.count({ status: "OnHold", role: 3, is_deleted: false });
        let BDEUserBlocked = await User.count({ status: "Processing", role: 3, is_deleted: false });

        //Get BDE Counts-------------------------------------------------------------
        let BDMUserApproved = await User.count({ status: "Approved", role: 2, is_deleted: false });
        let BDMUserDeclined = await User.count({ status: "Declined", role: 2, is_deleted: false });

        //Travel Agent Counts
        let TravelAgentApproved = await User.count({ status: "Approved", role: 4, is_deleted: false });
        let TravelAgentDeclined = await User.count({ status: "Declined", role: 4, is_deleted: false });
        let TravelAgentOnHold = await User.count({ status: "OnHold", role: 4, is_deleted: false });
        let TravelAgentBlocked = await User.count({ status: "Processing", role: 4, is_deleted: false });

        //Hotel Counts
        let HotelAccepted = await Hotel.count({ status: "Accepted", is_deleted: false });
        let HotelApproved = await Hotel.count({ status: "Approved", is_deleted: false });
        let HotelBlocked = await Hotel.count({ status: "Blocked", is_deleted: false });
        let HotelProcessing = await Hotel.count({ status: "Processing", is_deleted: false });
        let HotelDeclined = await Hotel.count({ status: "Declined", is_deleted: false });
        let HotelOnHold = await Hotel.count({ status: "OnHold", is_deleted: false });
        let HotelReAssigned = await Hotel.count({ status: "ReAssigned", is_deleted: false });

        // Biddings-----------------
        let BidsApproved = await Bids.count({ status: "Approved" });
        let BidsPending = await Bids.count({ status: "Processing" });
        let BidsRejected = await Bids.count({ status: "Rejected" });
        let BidsMissed = await Bids.count({ status: "Missed_SLA" });

        let UpBooking = await Bookings.count({ status: "Upcoming" });
        let PastBooking = await Bookings.count({ status: "Past" });
        let CancelledBooking = await Bookings.count({ status: "Cancelled" });


        var DataCounts = {
            Hotel: {
                Accepted: HotelAccepted,
                Approved: HotelApproved,
                Blocked: HotelBlocked,
                Processing: HotelProcessing,
                Declined: HotelDeclined,
                OnHold: HotelOnHold,
                ReAssigned: HotelReAssigned
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

            Biddings: {
                Approved: BidsApproved,
                Pending: BidsPending,
                Rejected: BidsRejected,
                Missed: BidsMissed
            },

            Bookings: {
                Upcoming: UpBooking,
                Past: PastBooking,
                Cancelled: CancelledBooking
            }
        }
        return res.send({ responseCode: 200, data: DataCounts });
    },



    Get_BDM_Dashboard_Counts: async (req, res) => {
        let BDM_ID = req.body.bdm_id;
        if (!BDM_ID) { return res.send({ responseCode: 201, msg: 'Please provide required parameters' }); }
        var BDEID = [];
        User.find({ select: ['parent_bdm', 'userId', 'id'] }).where({ parent_bdm: BDM_ID }).exec(function (err, UserList) {

            async.forEachOf(UserList, function (value, i, callback) {
                BDEID.push(value.userId);
                callback();
            }, function (err) {

                if (err) { sails.log(err); return res.send({ err: err }); }

                var DataCounts = {};

                //Travel Agent Counts------------------------------------------------------------------

                User.count({ status: "Approved", role: 4, userId: BDEID }).exec(function (err, TravelAgentApproved) { DataCounts.TravelAgentApproved = TravelAgentApproved });
                User.count({ status: "Declined", role: 4, userId: BDEID }).exec(function (err, TravelAgentDeclined) { DataCounts.TravelAgentDeclined = TravelAgentDeclined });
                User.count({ status: "OnHold", role: 4, userId: BDEID }).exec(function (err, TravelAgentOnHold) { DataCounts.TravelAgentOnHold = TravelAgentOnHold });
                User.count({ status: "Processing", role: 4, userId: BDEID }).exec(function (err, TravelAgentBlocked) { DataCounts.TravelAgentBlocked = TravelAgentBlocked });

                //BDE Agent Counts---------------------------------------------------------------------

                User.count({ status: "Approved", role: 3, userId: BDEID }).exec(function (err, BDEApproved) { sails.log(BDEID, 'all bde id'); DataCounts.BDEApproved = BDEApproved });
                User.count({ status: "Declined", role: 3, userId: BDEID }).exec(function (err, BDEDeclined) { DataCounts.BDEDeclined = BDEDeclined });
                User.count({ status: "OnHold", role: 3, userId: BDEID }).exec(function (err, BDEOnHold) { DataCounts.BDEOnHold = BDEOnHold });
                User.count({ status: "Processing", role: 3, userId: BDEID }).exec(function (err, BDEBlocked) { DataCounts.BDEBlocked = BDEBlocked });

                //Hotel Counts-------------------------------------------------------------------------
                Hotel.count({ status: "Accepted", bdeId: BDEID }).exec(function (err, HotelAccepted) { DataCounts.HotelApproved = HotelAccepted });
                Hotel.count({ status: "Approved", bdeId: BDEID }).exec(function (err, HotelApproved) { DataCounts.HotelApproved = HotelApproved });
                Hotel.count({ status: "Blocked", bdeId: BDEID }).exec(function (err, HotelBlocked) { DataCounts.HotelBlocked = HotelBlocked; });
                Hotel.count({ status: "Pending", bdeId: BDEID }).exec(function (err, HotelPending) { DataCounts.HotelBlocked = HotelPending; });
                Hotel.count({ status: "Processing", bdeId: BDEID }).exec(function (err, HotelProcessing) { DataCounts.Processing = HotelProcessing; });
                var AllHotelsId = [];
                //Get Hotel Bidding & Booking Counts---------------------------------------------------------
                Hotel.find({ select: ['bdeId', 'id'] }).where({ bdeId: BDEID }).exec(function (err, AllBDEHotels) {
                    async.forEachOf(AllBDEHotels, function (value, i, callback) {
                        AllHotelsId.push(value.id);
                        callback();
                    }, function (err) {
                        // Get Bid & Booking Count--------------------------------------------------------------------------------------------------------------------------------------
                        Bids.count({ status: "Approved", hotel_id: BDEID }).exec(function (err, BidsApproved) { DataCounts.BidsApproved = BidsApproved; });
                        Bids.count({ status: "Pending", hotel_id: BDEID }).exec(function (err, BidsPending) { DataCounts.BidsPending = BidsPending; });
                        Bids.count({ status: "Rejected", hotel_id: BDEID }).exec(function (err, BidsRejected) { DataCounts.BidsRejected = BidsRejected; });
                        Bids.count({ status: "Missed_SLA", hotel_id: BDEID }).exec(function (err, BidsMissed) { DataCounts.BidsMissed = BidsMissed; });
                        Bookings.count({ status: "Cancelled", hotel_id: BDEID }).exec(function (err, BookingsCancelled) { DataCounts.BookingCancelled = BookingsCancelled; });
                        Bookings.count({ status: "Upcoming", hotel_id: BDEID }).exec(function (err, BookingsApproved) {
                            DataCounts.BookingApproved = BookingsApproved;
                            return res.send({ responseCode: 200, data: DataCounts });
                        });
                    })
                })

            });
        })
    },



    Get_My_BDE: async (req, res) => {
        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: "Please provide user ID" });
        }
        let MyBDE = await User.find({ parent_bdm: req.body.userId });
        if (MyBDE.length == 0) {
            return res.send({ responseCode: 201, msg: "BDE under this BDM not found", data: [] });
        } else {
            return res.send({ responseCode: 200, msg: "BDE fetched", data: MyBDE });
        }
    },


    Get_All_BDM_Hotels: async (req, res) => {
        let BDM_ID = req.body.userId;
        if (!BDM_ID) {
            return res.send({ responseCode: 201, msg: "BDM id not found" });
        }
        //Get All BDE's------------------------------------------------------------
        let Users = await User.find({ parent_bdm: BDM_ID });
        var All_BDE = [];
        async.forEachOf(Users, function (value, i, callback) {
            All_BDE.push(value.userId);
            callback();
        }, function (err) {
            if (err) { sails.log(err) }
            Hotel.find({ bdeId: All_BDE }).sort("createdAt DESC").exec(function (err, HotelData) {
                async.forEachOf(HotelData, function (value, i, callback) {
                    HotelData[i].bde_name = '';
                    if (value.bdeId && value.bdeId != '') {
                        User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                            if (UserData) {
                                HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                            }
                            callback();
                        })
                    } else {
                        callback();
                    }
                }, function (err) {
                    if (HotelData.length == 0) {
                        return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
                    }
                    else {
                        var HotelDataApproved = HotelData.filter(function (itm) { return itm.status == "Approved"; });
                        var HotelDataPending = HotelData.filter(function (itm) { return itm.status == "Processing"; });
                        return res.send({ responseCode: 200, Approved: HotelDataApproved, Pending: HotelDataPending });
                    }
                })
            });
        });
    },


    Get_BDM_Hotels_Admin: async (req, res) => {

        let BDM_ID = req.body.userId;
        if (!BDM_ID) {
            return res.send({ responseCode: 201, msg: "BDM id not found" });
        }

        let Users = await User.find({ parent_bdm: BDM_ID });
        var All_BDE = [];
        async.forEachOf(Users, function (value, i, callback) {
            All_BDE.push(value.userId);
            callback();
        }, function (err) {
            if (err) { sails.log(err) }
            Hotel.find({ bdeId: All_BDE }).sort("createdAt DESC").exec(function (err, HotelData) {
                async.forEachOf(HotelData, function (value, i, callback) {
                    HotelData[i].bde_name = '';
                    if (value.bdeId && value.bdeId != '') {
                        User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                            if (UserData) {
                                HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                            }
                            callback();
                        })
                    } else {
                        callback();
                    }
                }, function (err) {
                    if (HotelData.length == 0) {
                        return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
                    }
                    else {
                        return res.send({ responseCode: 200, data: HotelData });
                    }
                })
            });
        });
    },


    Get_TravelAgents_BDM: async (req, res) => {

        let SelectFields = ['id', 'userId', 'firstname', 'lastname', 'profile_img', 'status', 'email', 'mobile', 'parent_bdm'];
        let userId = req.body.userId;
        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'userId parameter not found' });
        }
        var MyBDE = [];
        let UserData = await User.find({ select: SelectFields }).where({ parent_bdm: userId, role: 3 }).sort('createdAt DESC');
        async.forEachOf(UserData, function (value, i, callback) {
            MyBDE.push(value.userId);
            callback();
        }, function (err) {
            if (err) sails.log(err);
            User.find({ select: SelectFields }).where({ parent_bde: MyBDE, role: 4 }).sort('createdAt DESC').exec(function (err, MyTravelAgents) {
                return res.send({ responseCode: 200, data: MyTravelAgents, msg: 'BDM -> BDE -> Travel Agents List Fetched' });
            });
        });
    },



}

