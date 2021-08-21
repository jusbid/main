var fs = require('fs');
var async = require('async');


module.exports = {

    Place_Bid: async (req, res) => {

        

        let arrival = req.body.arrival;
        let depart = req.body.departure;
        let rooms = req.body.rooms;
        let adult = req.body.adult;
        let child = req.body.child;
        let hotel_id = req.body.hotel_id;
        let hotel_name = req.body.hotel_name;
        let bid_price = req.body.bid_price;
        let userId = req.body.userId;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let room_type = req.body.room_type;
        let room_price = req.body.room_price;

        if (!arrival || !hotel_id || !bid_price || !userId) {
            return res.send({ responseCode: 201, msg: 'Please provide all keys to place a new bid..' });
        }

        let UserData = await User.findOne({userId: userId});

        let CurrentDate = new Date()
        CurrentDate = CurrentDate.toISOString().split('T')[0];
        var NextDate = new Date();
        NextDate.setDate(NextDate.getDate() + parseInt(1));
        var PreDate = new Date();
        PreDate.setDate(PreDate.getDate() - parseInt(1));

        let BidCheck = await Bids.find({
            where: {
                createdAt: { '>': new Date(PreDate), '<': new Date(NextDate) }, userId: userId
            }
        });

        let SettingsBids = await Settings.findOne({ type: "MaxBids" });
        let MaxBids = 10;
        if (SettingsBids) {
            if (SettingsBids.data_number) MaxBids = SettingsBids.data_number;
        }

        if (BidCheck.length >= MaxBids) {
            return res.send({ responseCode: 201, msg: 'Maximum number of bids already placed by you, please try again tommorrow' });
        }

        let BidSeries = hotel_name.substring(0, 3) + firstname.substring(0, 3) + parseInt(Math.random() * 10000, 10) + '' + functions.Get_DateSeq();

        let CreateBid = {
            series: BidSeries,
            hotel_name: hotel_name,
            firstname: firstname,
            lastname: lastname,
            email: email,
            arrival_date: arrival,
            departure_date: depart,
            rooms: rooms,
            adult: adult,
            child: child,
            room_type: room_type,
            room_price: room_price,
            hotel_id: hotel_id,
            price: bid_price,
            userId: userId,
            days: req.body.days,
            is_refundable: req.body.is_refundable,
            status: "Processing"
        }

        let CreatedBid = await Bids.create(CreateBid).fetch();

        if (!CreatedBid) {
            return res.send({ responseCode: 201, msg: 'Bid not placed', err: err });
        } else {
            //----------------Notifications-------------------------------------------------------------------------------
           NotificationsFunctions.Hotelier_User_Notification_Bidding(CreatedBid.hotel_id, CreatedBid.userId, CreatedBid.hotel_name, CreatedBid.days, BidSeries);
           NotificationsFunctions.SendPush_Single('Bid Placed Successfully', 'Bid for reserving hotel room on ' + CreatedBid.hotel_name + ' has been placed successfully, please wait for hotelier approval', userId);
           NotificationsFunctions.CreateFrontUserNotification('Bid Placed Successfully', 'Bid for reserving hotel room on ' + CreatedBid.hotel_name + ' has been placed successfully, please wait for hotelier approval', userId);
            return res.send({ responseCode: 200, msg: 'Bid placed successfully', data: CreatedBid });

        }

    },


    Save_Rejected_Bids: async (req, res) => {

        let arrival = req.body.arrival;
        let depart = req.body.departure;
        let rooms = req.body.rooms;
        let adult = req.body.adult;
        let child = req.body.child;
        let hotel_id = req.body.hotel_id;
        let hotel_name = req.body.hotel_name;
        let bid_price = req.body.bid_price;
        let userId = req.body.userId;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let room_type = req.body.room_type;
        let room_price = req.body.room_price;

        if (!arrival || !hotel_id || !bid_price) {
            return res.send({ responseCode: 201, msg: 'Please provide all keys to place a new bid..' });
        }

        let BidSeries = hotel_name.substring(0, 3) + firstname.substring(0, 3) + parseInt(Math.random() * 10000, 10) + '' + functions.Get_DateSeq();

        let CreateBid = {
            series: BidSeries,
            hotel_name: hotel_name,
            firstname: firstname,
            lastname: lastname,
            email: email,
            arrival_date: arrival,
            departure_date: depart,
            rooms: rooms,
            adult: adult,
            child: child,
            room_type: room_type,
            room_price: room_price,
            hotel_id: hotel_id,
            price: bid_price,
            userId: userId,
            days: req.body.days,
            is_refundable: req.body.is_refundable,
            status: "Processing"
        }

        let CreatedBid = await RejectedBids.create(CreateBid).fetch();

        if (!CreatedBid) {
            return res.send({ responseCode: 201, msg: 'Bid not saved', err: err });
        } else {
            let R_Bid_SMS ='Hello '+firstname+', Your Bid for Hotel '+hotel_name+' of '+bid_price+' has been rejected please make changes and rebid. Thank you Team Jusbid';
           // let R_Bid_SMS = 'Bid for reserving hotel room on ' + CreatedBid.hotel_name + ' has been placed successfully, please wait for hotelier approval';
         //   NotificationsFunctions.SendPush_Single('Bid Rejected', R_Bid_SMS, userId);

            return res.send({ responseCode: 200, msg: 'Bid Saved successfully', data: CreatedBid });
        }

    },


    Get_My_Bids: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        let BidsAll = await Bids.find({ hotel_id: hotel_id });

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Bid not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bids fetched successfully', data: BidsAll });

        }

    },

    Get_Rejected_Bids: async (req, res) => {

        let BidsAll = await RejectedBids.find({}).sort('createdAt DESC');

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Rejected Bid not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Rejected Bids fetched successfully', data: BidsAll });

        }

    },

    Get_User_Bids: async (req, res) => {

        let userId = req.body.userId;
        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Please provide user ID to fetch user bids' });
        }
        let BidsAll = await Bids.find({ userId: userId }).sort("createdAt DESC");
        async.forEachOf(BidsAll, function (value, i, callback) {
            if (value.hotel_id) {
                Hotel.findOne({ select: ['id', 'image'] }).where({ id: value.hotel_id }).exec(function (err, HotelData) {
                    if (HotelData) {
                        BidsAll[i].hotel_image = HotelData.image;
                    } else {
                        BidsAll[i].hotel_image = "";
                    }
                    callback();
                });
            } else {
                BidsAll[i].hotel_image = "";
                callback();
            }
        }, function (err) {
            if (!BidsAll) {
                return res.send({ responseCode: 201, msg: 'Bid not found' });
            } else {
                return res.send({ responseCode: 200, msg: 'Bids fetched successfully', data: BidsAll });

            }
        });

    },

    Get_User_Bookings: async (req, res) => {

        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Please provide user ID to fetch user bookings' });
        }

        let userId = req.body.userId;
        let BidsAll = await Bookings.find({ userId: userId }).sort("createdAt DESC");

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Bookings not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bookings fetched successfully', data: BidsAll });

        }

    },


    Get_User_Bookings_App: async (req, res) => {
        let userId = req.body.userId;
        if (!userId) { return res.send({ responseCode: 201, msg: 'Please provide required parameters' }); }
        let BookingsAll = await Bookings.find({ userId: userId }).sort("createdAt DESC");
        async.forEachOf(BookingsAll, function (value, i, callback) {
            if (value.hotel_id) {
                Hotel.findOne({ select: ['id', 'image', 'address', 'landmark', 'city', 'state', 'latitude', 'longitude', 'mobile'] }).where({ id: value.hotel_id }).exec(function (err, HotelData) {
                    if (HotelData) {
                        BookingsAll[i].image = HotelData.image;
                        //--adding extra keys to hotel details--------------------------------
                        BookingsAll[i].hotel_address = HotelData.address+', '+HotelData.city+', '+HotelData.state;
                        BookingsAll[i].latitude = HotelData.latitude;
                        BookingsAll[i].longitude = HotelData.longitude;
                        BookingsAll[i].mobile = HotelData.mobile;
                    } else {
                        BookingsAll[i].image = "";
                    }
                    callback();
                });
            } else {
                BookingsAll[i].image = "";
                callback();
            }
        }, function (err) {
            var UpcomingData = BookingsAll.filter(function (itm) { return itm.status == "Upcoming" || itm.status == "Current" });
            var CompletedData = BookingsAll.filter(function (itm) { return itm.status == "Past" });
            var CancelledData = BookingsAll.filter(function (itm) { return itm.status == "Cancelled" || itm.status == "Refund_Init" || itm.status == "Refund_Processed" });
            if (!BookingsAll) {
                return res.send({ responseCode: 201, msg: 'Bookings not found' });
            } else {
                return res.send({ responseCode: 200, msg: 'Bookings fetched successfully', upcoming: UpcomingData, completed: CompletedData, cancelled: CancelledData });
            }
        })
    },


    Get_All_Bids: async (req, res) => {

        let StartDate = req.body.start_date;
        let EnDate = req.body.end_date;
        var BidsAll = [];

        if (StartDate && EnDate) {
            BidsAll = await Bids.find({

                createdAt: { '>': new Date(StartDate), '<': new Date(EnDate) }

            }).sort('createdAt DESC');
        } else {
            BidsAll = await Bids.find({
                where: {
                    createdAt: {
                        '<': new Date('2021-04-26T14:56:21.774Z')
                    }
                }
            }).limit(100).sort('createdAt DESC');
        }

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Bid not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bids Fetched', data: BidsAll });

        }

    },


    Get_All_Bookings: async (req, res) => {

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
                        '>': new Date('2018-08-24T14:56:21.774Z')
                    }
                }
            }).limit(100).sort('createdAt DESC');
        }

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Bookings not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bookings Fetched', data: BidsAll });

        }

    },

    Get_hotel_Bookings: async (req, res) => {

        let StartDate = req.body.start_date;
        let EnDate = req.body.end_date;
        let hotel_id = req.body.hotel_id;
        var BidsAll = [];

        if (StartDate && EnDate) {
            sails.log(req.body, 'req body bookings');
            BidsAll = await Bookings.find({ arrival_date: { '>': StartDate, '<': EnDate }, hotel_id: hotel_id }).sort('createdAt DESC');
        } else {
            BidsAll = await Bookings.find({
                arrival_date: { '>': new Date('2018-08-24T14:56:21.774Z'), hotel_id: hotel_id }
            }).limit(100).sort('createdAt DESC');
        }

        if (!BidsAll) {
            return res.send({ responseCode: 201, msg: 'Bookings not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bookings Fetched', data: BidsAll });

        }

    },


    Get_filtered_hotel_Bookings: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        var All_Hotel_Booking = [];
        var CurrentBookings = [];

        All_Hotel_Booking = await Bookings.find({ hotel_id: hotel_id }).sort('createdAt DESC');

        var ActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Upcoming"; });
        var PastBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Past"; });
        var CurrentBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Current"; });
        var InActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Cancelled" || itm.status == "Refund_Init" || itm.status == "Refund_Paid" });

        // async.forEachOf(All_Hotel_Booking, function (value, i, callback) {

        //     let ArrivalDate = new Date(value.arrival_date);
        //     var todaysDate = new Date();
        //     sails.log(ArrivalDate, todaysDate, 'log bookings');
        //     if (ArrivalDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
        //         CurrentBookings.push(value);
        //     }

        //     callback();

        // }, function (err) {

        let SendData = {
            upcoming: ActiveBookings,
            past: PastBookings,
            //cancelled: InActiveBookings,
            current: CurrentBookings
        }

        return res.send({ responseCode: 200, data: SendData });

        //  });

    },


    Get_filtered_hotelier_Bookings: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        var All_Hotel_Booking = [];
        var CurrentBookings = [];

        All_Hotel_Booking = await Bookings.find({ hotel_id: hotel_id }).sort('createdAt DESC');

        var ActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Upcoming"; });
        var PastBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Past"; });
        var CurrentBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Current"; });
        var InActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Cancelled" || itm.status == "Refund_Init" || itm.status == "Refund_Paid" });

        let SendData = {
            upcoming: ActiveBookings,
            past: PastBookings,
            cancelled: InActiveBookings,
            current: CurrentBookings
        }

        return res.send({ responseCode: 200, data: SendData });

    },


    Get_All_hotel_Bookings: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        var All_Hotel_Booking = [];
        var CurrentBookings = [];
        All_Hotel_Booking = await Bookings.find({ hotel_id: hotel_id }).sort('createdAt DESC');
        async.forEachOf(All_Hotel_Booking, function (value, i, callback) {
            let ArrivalDate = new Date(value.arrival_date);
            var todaysDate = new Date();
            if (ArrivalDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                CurrentBookings.push(value);
            }
            callback();
        }, function (err) {
            return res.send({ responseCode: 200, data: All_Hotel_Booking });
        });

    },


    Get_filtered_hotel_Bidings: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        if (!hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters..' });
        }
        var All_Hotel_Booking = [];
        var CurrentBookings = [];

        All_Hotel_Booking = await Bids.find({ hotel_id: hotel_id }).sort('createdAt DESC');

        var Processing = All_Hotel_Booking.filter(function (itm) { return itm.status == "Processing"; });

        var Approved = All_Hotel_Booking.filter(function (itm) { return itm.status == "Approved"; });

        var Rejected = All_Hotel_Booking.filter(function (itm) { return itm.status == "Rejected"; });

        var OnHold = All_Hotel_Booking.filter(function (itm) { return itm.status == "OnHold" || itm.status == "Hold"; });

        let SendData = {
            processing: Processing,
            approved: Approved,
            rejected: Rejected,
            OnHold: OnHold
        }

        return res.send({ responseCode: 200, data: SendData });

    },

    Update_Bid_Status: async (req, res) => {
        let bid_id = req.body.bid_id;
        let status = req.body.status;
        let BidsUpdated = await Bids.updateOne({ id: bid_id }).set({ status: status, reason: req.body.reason });
        let UserData = await User.findOne({ userId: BidsUpdated.userId });
        if (!BidsUpdated) {
            return res.send({ responseCode: 201, msg: 'Bid not updated' });
        } else {
            let sms_msg = "Your Bid "+BidsUpdated.series+" for Hotel "+BidsUpdated.hotel_name+" of "+BidsUpdated.price+" has been Accepted for date "+BidsUpdated.arrival_date+", Days "+BidsUpdated.days+", Please Hurry up to Grab the best deal and book now!";
            if(UserData){
                if(status == "Approved"){
                    functions2.Send_Single_SMS(UserData.mobile, sms_msg);
                }
                else if(status == "Rejected"){
                    //let R_Bid_SMS ='Hello Avdesh, Your Bid for Hotel abctest of test has been tested please test.\nThank you\nTeam Jusbid';
                    let R_Bid_SMS ='Hello '+BidsUpdated.firstname+', Your Bid for Hotel '+BidsUpdated.hotel_name+' of '+BidsUpdated.price+' has been rejected please rebid.\nThank you\nTeam Jusbid';
                    sails.log(R_Bid_SMS, 'R_Bid_SMS-------------');
                    functions2.Send_Single_SMS(UserData.mobile, R_Bid_SMS);
                }
            }
            NotificationsFunctions.Update_Bid_Notifications(BidsUpdated);
            if (status == "Approved") { mailer.Approved_Bidding(BidsUpdated); }
            NotificationsFunctions.SendPush_Single('Bid Updated!', 'Bid for reserving hotel room on ' + BidsUpdated.hotel_name + ' have been updated with current status as ' + req.body.status + ', please check bid listing for further instructions', BidsUpdated.userId);
            return res.send({ responseCode: 200, msg: 'Bid updated successfully', data: BidsUpdated });

        }
    },

    Cancel_Bid: async (req, res) => {

        let bid_id = req.body.bid_id;
        let status = req.body.status;

        let BidsUpdated = await Bids.updateOne({ id: bid_id }).set({ status: "Cancelled", reason: req.body.reason });

        if (!BidsUpdated) {
            return res.send({ responseCode: 201, msg: 'Bid cancelled updated' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bid cancelled successfully', data: BidsUpdated });

        }

    },


    Handle_Missed_Bid_Status: async (req, res) => {

        let bid_id = req.body.bid_id;

        let BidsUpdated = await Bids.updateOne({ id: bid_id }).set({ status: "Missed_SLA", reason: req.body.reason });

        if (!BidsUpdated) {
            return res.send({ responseCode: 201, msg: 'Bid not updated' });
        } else {
            return res.send({ responseCode: 200, msg: 'Bid updated successfully', data: BidsUpdated });

        }

    },

    Check_Booking_Cancellation_Status: async (req, res) => {
        let booking_id = req.body.booking_id;

        if (!booking_id) {
            return res.send({ responseCode: 201, msg: 'Booking ID Not Found' });
        }

        let CheckBooking = await Bookings.findOne({ id: booking_id });

        if (!CheckBooking) {
            return res.send({ responseCode: 201, msg: 'Booking Not Found' });
        }
        // Check If Payment Can Be Refunded------------------------------------------

        let ArrivalDate = CheckBooking.arrival_date;

        let DaysDiff = functions.Get_Date_Diff(new Date(), functions.convertLocalDatetoUTCDate(ArrivalDate));
        sails.log('beforein 15 days situation');
        if (DaysDiff <= 15) {
            return res.send({ responseCode: 200, msg: 'Booking is eligible for refund' });
        } else {
            return res.send({ responseCode: 200, msg: 'Booking payment cannot be refunded, please check our cancellation for further information' });
        }
    },

    Cancel_My_Booking: async (req, res) => {

        let booking_id = req.body.booking_id;

        if (!booking_id) {
            return res.send({ responseCode: 201, msg: 'Booking ID Not Found' });
        }

        let CheckBooking = await Bookings.findOne({ id: booking_id });

        if (!CheckBooking) {
            return res.send({ responseCode: 201, msg: 'Booking Not Found' });
        }

        if (CheckBooking.refund_id) {

            return res.send({ responseCode: 201, msg: 'Booking Refund Already Raised, Please Wait for Payment Request..' });

        }
        // Check If Payment Can Be Refunded------------------------------------------

        let ArrivalDate = CheckBooking.arrival_date;

        let DaysDiff = functions.Get_Date_Diff(new Date(), functions.convertLocalDatetoUTCDate(ArrivalDate));
        if (DaysDiff <= 15) {
            let CreateRefundRequest = await Refunds.create({
                userId: CheckBooking.userId,
                username: CheckBooking.firstname + ' ' + CheckBooking.lastname,
                booking_id: CheckBooking.series,
                booking_amount: CheckBooking.price,
                hotel_id: CheckBooking.hotel_id,
                hotel_name: CheckBooking.hotel_name
            }).fetch();
            if (CreateRefundRequest) {
                var BookingsUpdatedRefundReq = await Bookings.updateOne({ id: booking_id }).set({ status: "Refund_Init", refund_id: CreateRefundRequest.id });
            }

            if (BookingsUpdatedRefundReq) {
                mailer.BookingCancellation(BookingsUpdatedRefundReq);
                NotificationsFunctions.Hotelier_User_Notification_Cancellation(BookingsUpdatedRefundReq);
                NotificationsFunctions.SendPush_Single('Booking Cancelled Successfully!', 'Booking for reserved hotel room on ' + BookingsUpdatedRefundReq.hotel_name + ' has been cancelled, please check bookings for further instructions', BookingsUpdatedRefundReq.userId);
                NotificationsFunctions.CreateFrontUserNotification('Booking Cancelled Successfully!', 'Booking for reserved hotel room on ' + BookingsUpdatedRefundReq.hotel_name + ' has been cancelled, please check bookings for further instructions', BookingsUpdatedRefundReq.userId);
                return res.send({ responseCode: 200, msg: 'Booking Cancelled and Refund Request Raised Successfully.' });
            } else {
                return res.send({ responseCode: 201, msg: 'Booking cannot be cancelled this time, please try after sometime...' });
            }

        } else {
            return res.send({ responseCode: 201, msg: 'Sorry! Your booking cannot be cancelled due to our refund & cancellation policy' });
        }
    },





    Generate_Booking: async (req, res) => {

        let bid_id = req.body.bid_id;

        if (!bid_id) {
            return res.send({ responseCode: 201, msg: 'Bid ID not found' });
        }

        let BidsUpdated = await Bids.findOne({ id: req.body.bid_id });
        let BookingFound = await Bookings.findOne({ bid_id: req.body.bid_id });
        let HotelCity = await Hotel.findOne({ select: ['id', 'city', 'name', 'address', 'city', 'state', 'landmark'] }).where({ id: BidsUpdated.hotel_id });
        let Series = HotelCity.city + BidsUpdated.hotel_name.substring(0, 3) + BidsUpdated.firstname.substring(0, 3) + parseInt(Math.random() * 10000, 10) + '' + functions.Get_DateSeq();

        if (!BookingFound) {

            let BookingData = await Bookings.create({
                bid_id: bid_id,
                series: Series,
                hotel_id: BidsUpdated.hotel_id,
                hotel_name: BidsUpdated.hotel_name,
                userId: BidsUpdated.userId,
                firstname: BidsUpdated.firstname,
                lastname: BidsUpdated.lastname,
                rooms: BidsUpdated.rooms,
                price: BidsUpdated.price,
                arrival_date: BidsUpdated.arrival_date,
                departure_date: BidsUpdated.departure_date,
                adult: BidsUpdated.adult,
                child: BidsUpdated.child,
                email: BidsUpdated.email,
                //new keys--------------------------------
                room_price: BidsUpdated.room_price,
                room_type: BidsUpdated.room_type,
                days: BidsUpdated.days,
                taxClass: BidsUpdated.tax_class,
                add_on: BidsUpdated.add_on
            }).fetch();

            let UpdateBid = await Bids.updateOne({ id: bid_id }).set({ is_booked: true, is_paid: true })

            //send email to user & hotelier---------------------------------------------------
            let userdata = await User.findOne({ userId: BidsUpdated.userId });
            //send hotel data also to send email----------------------------------------------
            userdata.booking_id = Series;
            userdata.hotel = HotelCity;
            userdata.BookingData = BookingData;
            mailer.sendBookingConfirmation(userdata);
            mailer.sendBookingConfirmationToHotelier(userdata);
            NotificationsFunctions.SendBookingPayment(userdata);
            NotificationsFunctions.SendPush_Single('Booking Confirmed Successfully!', 'Booking for reserving hotel room on ' + BidsUpdated.hotel_name + ' has been confimed, please check bookings for further instructions', BidsUpdated.userId);
            NotificationsFunctions.CreateFrontUserNotification('Booking Confirmed Successfully!', 'Booking for reserving hotel room on ' + BidsUpdated.hotel_name + ' has been confimed, please check bookings for further instructions', BidsUpdated.userId);
            if (BookingData) {
                return res.send({ responseCode: 200, msg: 'Booking generated', data: BookingData });
            } else {
                return res.send({ responseCode: 201, msg: 'Booking not generated' });
            }

        } else {
            return res.send({ responseCode: 201, msg: 'Booking already exists using this Bid ID' });
        }

    },

    Update_Booking_Date: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        let booking_id = req.body.booking_id;
        let arrival_date = req.body.arrival_date;
        let departure_date = req.body.departure_date;

        sails.log(req.body);

        if (!hotel_id || !arrival_date || !departure_date) {
            return res.send({ responseCode: 201, msg: 'Please provide all required parameters to update booking date' });
        }

        let BookingUpdatedData = await Bookings.updateOne({ id: booking_id }).set({
            arrival_date: arrival_date,
            departure_date: departure_date
        });

        sails.log(BookingUpdatedData, 'BookingUpdatedData');

        if (!BookingUpdatedData) {
            return res.send({ responseCode: 201, msg: 'Booking status not updated, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'Booking dates updates successfully', data: BookingUpdatedData });

        }

    },


    Update_Booking_Customer_Details: async (req, res) => {

        let booking_id = req.body.booking_id;

        if (!booking_id) {
            return res.send({ responseCode: 201, msg: 'Please provide booking ID' });
        }

        let BookingUpdatedData = await Bookings.updateOne({ id: booking_id }).set({
            is_agent_booking: true,
            customer_name: req.body.customer_name,
            customer_email: req.body.customer_email,
            customer_contact: req.body.customer_contact,
            customer_address: req.body.customer_address
        });

        if (!BookingUpdatedData) {
            return res.send({ responseCode: 201, msg: 'Booking status not updated, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'Booking updated successfully', data: BookingUpdatedData });

        }

    },

    Update_Booking_Room_Status: async (req, res) => {

        let booking_id = req.body.booking_id;

        if (!booking_id || !req.body.room_status) {
            return res.send({ responseCode: 201, msg: 'Please provide booking ID' });
        }

        let BookingUpdatedData = await Bookings.updateOne({ id: booking_id }).set({ room_status: req.body.room_status });

        if (!BookingUpdatedData) {
            return res.send({ responseCode: 201, msg: 'Booking status not updated, please try again..' });
        } else {
            return res.send({ responseCode: 200, msg: 'Booking updated successfully', data: BookingUpdatedData });

        }

    },






}