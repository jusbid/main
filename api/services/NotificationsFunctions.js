var FCM = require('fcm-node');
var serverKey = 'AAAATPw389w:APA91bHtDRSTw393k5oSaY91fNgg9GiDUTO6hnpdxZRUO4JEgmDtL6AS9VzLttMU5pgVRBmwfpqKxZISoMPjRQJBR1gHF1qDYUr0_cE8KvtWspqHilMHZa2CKAC3YBD5k0BOrRCNKUnL';
var fcm = new FCM(serverKey);
var async = require('async');

var HotelierServerKey = 'AAAAEjaS2VQ:APA91bGNMkEKwHVqaMQFDcrqr1iC9YZWjgpiT82kgvLh3Gh98MH2O4QXmYegAP1HcEPWkB5dd7S2j_w_8gqJsbLQW5AynwRVSnjwTeCXRPdObqmPar2l4c2ItNnrXg-2io1m4YRjufij';
var fcmHotelier = new FCM(HotelierServerKey);

module.exports.SendPush_Single = function (title, body, userId) {
    User.findOne({ select: ['userId', 'id', 'firstname', 'uuid', 'deviceToken'] }).where({ userId: userId }).exec(function (err, UserData) {
        if (UserData) {
            if (UserData.deviceToken) {
                var message = {
                    to: UserData.deviceToken,
                    notification: { title: title, body: body },
                };
                fcm.send(message, function (err, response) {
                    if (err) {
                        sails.log("Error while sending push notification", err);
                    } else {
                        sails.log("Successfully Sent: ", response);
                    }
                });
            }
        }
    });
}

function Send_Single_Hotelier(title, body, userId) {
    User.findOne({ select: ['userId', 'id', 'firstname', 'uuid', 'deviceToken'] }).where({ userId: userId }).exec(function (err, UserData) {
        if (UserData) {
            if (UserData.deviceToken) {
                var message = {
                    to: UserData.deviceToken,
                    notification: { title: title, body: body },
                };
                fcmHotelier.send(message, function (err, response) {
                    if (err) {
                        sails.log("Error while sending push notification", err);
                    } else {
                        sails.log("Successfully Sent: ", response);
                    }
                });
            }
        }
    });
}

module.exports.Send_Single_Hotelier_Test = function (title, body, userId) {
    User.findOne({ select: ['userId', 'id', 'firstname', 'uuid', 'deviceToken'] }).where({ userId: userId }).exec(function (err, UserData) {
        if (UserData) {
            if (UserData.deviceToken) {
                var message = {
                    to: UserData.deviceToken,
                    notification: { title: title, body: body },
                };
                fcmHotelier.send(message, function (err, response) {
                    if (err) {
                        sails.log("Error while sending push notification", err);
                    } else {
                        sails.log("Successfully Sent: ", response);
                    }
                });
            }
        }
    });
}

module.exports.SendPush_Single_Test = function () {

    var message = {
        to: "eJaqP8moQhGvPECnc0EM9R:APA91bFUOIdY5pFYHibCsi1ucyG3ejfyQBBuGFRflykLpW1hiQLaovLli7D3wyDgFwIcBlDgIPHDrypDUsHmv4PtEESGgFb11amZTJKhlZkJdffMBYF6noCoBE4OsdqDE12gSHXJzO-F",
        notification: { title: 'Hotelier Notification aaya ?', body: 'Hotelier Notification aaya ?' },
    };
    fcmHotelier.send(message, function (err, response) {
        if (err) {
            sails.log("Error while sending push notification", err);
        } else {
            sails.log("Successfully Sent: ", response);
        }
    });

}



module.exports.SendPush_All = function (title, body) {

    User.findOne({ select: ['userId', 'id', 'firstname', 'uuid', 'deviceToken'] }).exec(function (err, UserDataAll) {
        async.forEachOf(UserDataAll, function (UserData, i, callback) {
            if (UserData) {
                if (UserData.deviceToken) {
                    var message = {
                        to: UserData.deviceToken,
                        notification: { title: title, body: body },
                    };
                    fcm.send(message, function (err, response) {
                        if (err) {
                            sails.log("Error while sending push notification", err);
                        } else {
                            sails.log("Successfully Sent: ", response);
                        }
                    });
                } else {
                    callback();
                }
            } else {
                callback();
            }
        });
    }, function (err) {
        if (err) sails.log(err, 'Sending Notification to all catched error');
    });

}

module.exports.SendPush_UserType = function (title, body, userType) {

    User.findOne({ select: ['userId', 'id', 'firstname', 'uuid', 'deviceToken'] }).where({ role: userType }).exec(function (err, UserDataAll) {
        async.forEachOf(UserDataAll, function (UserData, i, callback) {
            if (UserData) {
                if (UserData.deviceToken) {
                    var message = {
                        to: UserData.deviceToken,
                        notification: { title: title, body: body },
                    };
                    fcm.send(message, function (err, response) {
                        if (err) {
                            sails.log("Error while sending push notification", err);
                        } else {
                            sails.log("Successfully Sent: ", response);
                        }
                    });
                } else {
                    callback();
                }
            } else {
                callback();
            }
        });
    }, function (err) {
        sails.log(err, 'Sending Notification to all catched error');
    });

}


module.exports.Update_Bid_Notifications = function (BidData) {
    let msg = '#' + BidData.series + 'Bid has been updated as ' + BidData.status + ' for booking on ' + BidData.hotel_name + ' for ' + BidData.days + ' day(s)';
    this.Update_Notification_Bidding(BidData.hotel_id, BidData.userId, msg);
}


module.exports.CreateNotification_All = function (subject, message, role, type) {

    Notifications.create({

        subject: subject,
        message: message,
        role: role,
        type: type

    }).exec(function (err, result) {

    });

};

module.exports.CreateUserNotification = function (subject, message, role, type, userId) {

    Notifications.create({

        subject: subject,
        message: message,
        role: role,
        type: type,
        userId: userId

    }).exec(function (err, result) { });

};

module.exports.CreateFrontUserNotification = function (subject, message, userId) {

    Notifications.create({

        subject: subject,
        message: message,
        role: 6,
        type: "Front_User",
        userId: userId

    }).exec(function (err, result) { });

};

module.exports.CreateForBDM_CC = function (subject, message, type, parent_id) {

    Notifications.create({

        subject: subject,
        message: message,
        role: 2,
        type: type,
        userId: parent_id

    }).exec(function (err, result) { });

};


module.exports.Hotelier_User_Notification_Bidding = function (hotel_id, userId, hotel_name, days, BidSeries) {

    let msg = '#' + BidSeries + ' bid placed successfully for booking on ' + hotel_name + ' for ' + days + ' day(s)';

    User.findOne({
        userId: userId
    }).exec(function (err, BDE_Data) {

        Notifications.create({

            subject: "Bid placed successfully",
            message: msg,
            role: 3,
            type: "Bid_Placed",
            userId: userId

        }).fetch().exec(function (err, result) {

            User.findOne({
                hotel_id: hotel_id
            }).exec(function (err, Hotelier_data) {

                if (Hotelier_data) {
                    Send_Single_Hotelier('New Bid Recieved', msg, Hotelier_data.userId);
                    Notifications.create({
                        subject: "New bid recieved",
                        message: msg,
                        role: 5,
                        type: "Hotel_Added",
                        userId: Hotelier_data.userId
                    }).exec(function (err, result) {
                    });

                    //--------------------------------------------------Whattsup Notification-----------------------------------------------------------------------------

                    

                    //-----------------------------------------------------------------------------------------------------------------------------------------------------
                }

            });
        });
    });
},


    module.exports.Update_Notification_Bidding = function (hotel_id, userId, msg) {

        User.findOne({
            userId: userId
        }).exec(function (err, BDE_Data) {

            Notifications.create({

                subject: "Bid has been updated by hotelier",
                message: msg,
                role: 3,
                type: "Bid_Updated",
                userId: userId

            }).fetch().exec(function (err, result) {
            });
        });
    },

    module.exports.Hotelier_User_Notification_Cancellation = function (BookingData) {


        Notifications.create({

            subject: "Booking cancelled successfully!",
            message: "Your booking #" + BookingData.series + ' has been cancelled successfully, refund process will be initiated if booking is eligible for payment refund.',
            role: 3,
            type: "Bid_Placed",
            userId: BookingData.userId

        }).fetch().exec(function (err, result) {

            // Notifications.create({ subject: result.subject, message: msg, role: 1, type: "Hotelier_Bid_Placed", userId: "" }).exec(function (err, result1) { });

            User.findOne({
                hotel_id: BookingData.hotel_id
            }).exec(function (err, Hotelier_data) {
                if (Hotelier_data) {
                    Send_Single_Hotelier("Booking " + BookingData.series + "has been cancelled by customer!", "Booking for " + BookingData.arrival_date + " - " + BookingData.departure_date + ', booking ID ' + BookingData.series + "has been cancelled by customer!", Hotelier_data.userId);
                    Notifications.create({

                        subject: "Booking " + BookingData.series + "has been cancelled by customer!",
                        message: "Booking for " + BookingData.arrival_date + " - " + BookingData.departure_date + ', booking ID ' + BookingData.series + "has been cancelled by customer!",
                        role: 5,
                        type: "Booking_Cancelled",
                        userId: Hotelier_data.userId

                    }).exec(function (err, result) {

                    });
                }
            });
        });

    },

    module.exports.SendBookingPayment = function (UserData) {
        let BookingReData = UserData.BookingData;
        Notifications.create({

            subject: "Payment Recieved!",
            message: "We have recieved payment for your booking, your booking ID is " + BookingReData + ', you will recieve email soon for rest of details.',
            role: 3,
            type: "Booked",
            userId: UserData.userId

        }).fetch().exec(function (err, result) {
        });

    },


    module.exports.HotelCreationNotification_BDM_BDE = function (bde_id, HotelName) {

        User.findOne({
            userId: bde_id
        }).exec(function (err, BDE_Data) {

            Notifications.create({

                subject: "New hotel added : " + HotelName,
                message: "New hotel " + HotelName + " has been added by you successfully, please wait for BDM approval",
                role: 3,
                type: "Hotel_Added",
                userId: bde_id

            }).fetch().exec(function (err, result) {

                Notifications.create({ subject: result.subject, message: "New hotel " + HotelName + " has been added by BDE UserID - " + bde_id, role: 1, type: "Admin", userId: "" }).exec(function (err, result1) { });

                User.findOne({
                    userId: BDE_Data.parent_bdm
                }).exec(function (err, BDM_Data) {


                    if (BDM_Data) {

                        Notifications.create({

                            subject: "New hotel added : " + HotelName,
                            message: "New hotel " + HotelName + " has been added by BDE successfully, kindly response to request, please check pending hotels",
                            role: 2,
                            type: "Hotel_Added",
                            userId: BDM_Data.userId

                        }).exec(function (err, result) {

                        });
                    }
                });
            });
        });
    },

    module.exports.AdminCC_Notify = function (subject, message) {

        sails.log('creating admin noti');

        Notifications.create({ subject: subject, message: message, role: 1, type: "Admin", userId: "" }).exec(function (err, result) { });

    },


    module.exports.HotelApprovalNotification_BDM_BDE = function (bde_id, HotelName) {

        let env = this;

        User.findOne({
            userId: bde_id
        }).exec(function (err, BDE_Data) {

            Notifications.create({

                subject: "New hotel " + HotelName + " has been Accepted",
                message: "New hotel " + HotelName + " has Accepted by your BDM",
                role: 3,
                type: "Hotel_Accepted",
                userId: bde_id

            }).exec(function (err, result) {

                User.findOne({
                    userId: BDE_Data.parent_bdm
                }).exec(function (err, BDM_Data) {

                    if (BDE_Data) {
                        Notifications.create({ subject: HotelName + " has been Accepted by BDM " + BDM_Data.firstname, message: HotelName + " has been Accepted by BDM " + BDM_Data.firstname + ", Please cross check and verify hotel content", role: 1, type: "Admin", userId: "" }).exec(function (err, result1) { });
                        Notifications.create({

                            subject: "New hotel " + HotelName + " has been accepted by you",
                            message: "New hotel " + HotelName + " has been accepted by you",
                            role: 2,
                            type: "Hotel_Accepted",
                            userId: BDM_Data.userId

                        }).exec(function (err, result) {

                        });
                    }
                });
            });
        });
    },


    module.exports.AgentAddNotification_BDM_BDE = function (bde_id, AgentName) {

        User.findOne({
            userId: bde_id
        }).exec(function (err, BDE_Data) {

            Notifications.create({

                subject: "New agent added : " + AgentName,
                message: "New Agent " + AgentName + " has been added successfully, please wait for approval from your BDM",
                role: 3,
                type: "Agent_Approved",
                userId: bde_id

            }).exec(function (err, result) {

                User.findOne({
                    userId: BDE_Data.parent_bdm
                }).exec(function (err, BDM_Data) {
                    if (BDM_Data) {
                        Notifications.create({ subject: "New agent added : " + AgentName, message: AgentName + " has been added as new agent by BDM ", role: 1, type: "Admin", userId: "" }).exec(function (err, result1) { });
                        Notifications.create({ subject: "New agent added : " + AgentName, message: AgentName + " has been added as new agent by BDM " + BDM_Data.firstname, role: 1, type: "Admin", userId: "" }).exec(function (err, result1) { });
                        Notifications.create({
                            subject: "New agent added : " + AgentName,
                            message: "New Agent " + AgentName + " has been added by BDE, please verify user.",
                            role: 3,
                            type: "Agent_Added",
                            userId: BDM_Data.userId
                        }).exec(function (err, result) { });
                    }
                });
            });
        });
    },



    module.exports.Get_Notifications_ByRole = function (roleId) {



    };

