var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
//-----------------Mailing Credentials-------------------------
var EmailFrom = "it@jusbid.in";
var EmailUser = "it@jusbid.in";
var EmailPass = "Admin123#";
var mailerConfig = {
    // host: "smtpout.secureserver.net",
    // secureConnection: false,
    //port: 80,
    service: 'gmail',
    host: 'smtp.gmail.com',
    tls: {
        ciphers: 'SSLv3'
    },
    auth: {
        user: EmailUser,
        pass: EmailPass
    }
};
var transporter = nodemailer.createTransport(mailerConfig);



var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};



module.exports.sendWelcomeMail = function (obj) {

    readHTMLFile('api/emailTemplates/welcomeEmail/html.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname + ' ' + obj.lastname,
            user: obj.userId,
            password: obj.password
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'Welcome to Jusbid!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}

module.exports.sendAgentMail = function (obj) {

    readHTMLFile('api/emailTemplates/welcomeEmail/agentWelcome.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname + ' ' + obj.lastname,
            user: obj.userId,
            password: obj.password,
            email: obj.email
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'Welcome to Jusbid!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}

module.exports.sendHotelRequestBDE = function (obj) {

    readHTMLFile('api/emailTemplates/BDE/hotelrequest.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname + ' ' + obj.lastname,
            hotel_name: obj.request.name,
            address: obj.request.address + ', ' + obj.request.landmark + ', ' + obj.request.city + ', ' + obj.request.state,
            hotel_email: obj.request.email,
            hotel_contact: obj.request.contact
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'New Hotel Request Recieved!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}



module.exports.forgotPassword = function (obj) {

    readHTMLFile('api/emailTemplates/forgotPassword/html.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            Name: obj.firstname + ' ' + obj.lastname,
            user: obj.userId,
            password: obj.password
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'We have recieved your forgot password request!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }
        });
    });

}


module.exports.HotelAdded = function (hoteldata) {

   

    readHTMLFile('api/emailTemplates/hotelierWelcome/created.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: hoteldata.name,
            createdAt: hoteldata.createdAt,
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: hoteldata.email,
            subject: 'Jusbid welcomes you..',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }

            if (response) { sails.log(response) }
        });
    });
}



module.exports.HotelierWelcome = function (obj, hotel_image) {
    sails.log(obj, 'hoteldata------');
    sails.log('sending welcome mail', obj);
    var full_image_path = "https://www.transindiaholidays.com/Areas/Blog/UploadImages/Id_5c1a0aa3-7794-410a-952f-17ad8dc95c2c.jpg";
    if (hotel_image) {
        full_image_path = 'https://jusbid.in:1337/' + hotel_image;
    }
    readHTMLFile('api/emailTemplates/hotelierWelcome/html.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname,
            user: obj.userId,
            password: obj.password,
            createdAt: obj.createdAt,
            full_image_path: full_image_path
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'Jusbid welcomes you to hotelier portal',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }

            if (response) { sails.log(response) }
        });
    });
}


module.exports.GroupHotelierWelcome = function (userobj, hotels) {
    sails.log(userobj, 'hoteldata------');
    sails.log('sending welcome mail', userobj);
    var full_image_path = "https://www.transindiaholidays.com/Areas/Blog/UploadImages/Id_5c1a0aa3-7794-410a-952f-17ad8dc95c2c.jpg";
    // if (hotel_image) {
    //     full_image_path = 'https://jusbid.in:1337/' + hotel_image;
    // }
    readHTMLFile('api/emailTemplates/hotelierWelcome/groupHotelWelcome.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            email: userobj.email,
            password: userobj.password,
            createdAt: userobj.createdAt,
            hotels:hotels,
            full_image_path: full_image_path
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: userobj.email,
            subject: 'Jusbid welcomes you to hotelier portal',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            }

            if (response) { sails.log(response) }
        });
    });
}


module.exports.sendBookingConfirmation = function (obj) {

    readHTMLFile('api/emailTemplates/bookingEmail/user.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname + ' ' + obj.lastname,
            user: obj.userId,
            password: obj.password,
            booking_id: obj.booking_id,
            hotel_name: obj.hotel.name,
            hotel_address: obj.hotel.address,
            hotel_city: obj.hotel.city,
            hotel_state: obj.hotel.state,
            hotel_landmark: obj.hotel.landmark,
            hotel_email: obj.hotel.email,
            hotel_mobile: obj.hotel.mobile,
            hotel_landline: obj.hotel.landline,
            arrival_date: obj.BookingData.arrival_date,
            departure_date: obj.BookingData.departure_date
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'Booking Confirmed!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}


module.exports.BookingCancellation = function (bookingObj) {

    readHTMLFile('api/emailTemplates/bookingEmail/bookingCancel.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            hotel_name: bookingObj.name,
            booking_id: bookingObj.series,

            arrival_date: bookingObj.arrival_date,
            departure_date: bookingObj.departure_date
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.email,
            subject: 'Booking Confirmed!',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}


module.exports.sendBookingConfirmationToHotelier = function (obj) {

    User.findOne({ hotel_id: obj.hotel.id, role: 5 }).exec(function (err, UserData) {

        readHTMLFile('api/emailTemplates/bookingEmail/hotelier.ejs', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: obj.firstname + ' ' + obj.lastname,
                user: obj.userId,
                password: obj.password,
                booking_id: obj.booking_id,
                hotel_name: obj.hotel.name,
                hotel_address: obj.hotel.address,
                hotel_city: obj.hotel.city,
                hotel_state: obj.hotel.state,
                hotel_landmark: obj.hotel.landmark,
                hotel_email: obj.hotel.email,
                hotel_mobile: obj.hotel.mobile,
                hotel_landline: obj.hotel.landline,
                arrival_date: obj.BookingData.arrival_date,
                departure_date: obj.BookingData.departure_date
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: EmailFrom,
                to: "khushal.cornice@gmail.com",
                subject: 'New Booking has been Confirmed!',
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    sails.log(error);
                } else {
                    sails.log(response, 'response email welcome')
                }
            });
        });

    });

}

module.exports.Approved_Bidding = function (obj) {

    readHTMLFile('api/emailTemplates/bookingEmail/biddingAccepted.ejs', function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: obj.firstname + ' ' + obj.lastname,
            user: obj.userId,
            series: obj.series,
            hotel_name: obj.hotel_name,
            arrival_date: obj.arrival_date,
            departure_date: obj.departure_date
        };
        var htmlToSend = template(replacements);
        var mailOptions = {
            from: EmailFrom,
            to: obj.userId,
            subject: 'Bidding has been accepted by hotel',
            html: htmlToSend
        };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                sails.log(response, 'response email welcome')
            }
        });
    });

}

module.exports.BDE_Hotel_Approval = function (HotelData) {
    sails.log('Hoteldata', HotelData);
    User.findOne({ userId: HotelData.bdeId, role: 3 }).exec(function (err, BDEData) {
        readHTMLFile('api/emailTemplates/BDE/hotelApproval.ejs', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: BDEData.firstname + ' ' + BDEData.lastname,
                user: BDEData.userId,
                hotel_name: HotelData.name,
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: EmailFrom,
                to: BDEData.email,
                subject: 'Hotel ' + HotelData.name + ' has been approved',
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    sails.log(response, 'response email')
                }
            });
        });
    });

}

module.exports.Hotel_Add_Notification_BDM_with_Hotel = function (HotelData, BDE_ID) {
    User.findOne({ userId: BDE_ID, role: 3 }).exec(function (err, BDEData) {
        User.findOne({ userId: BDEData.parent_bdm, role: 2 }).exec(function (err, BDMData) {

            if (BDMData) {

                readHTMLFile('api/emailTemplates/BDM/hotelAdded.ejs', function (err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        name: BDMData.firstname + ' ' + BDMData.lastname,
                        bde_name: BDEData.firstname + ' ' + BDEData.lastname,
                        user: BDMData.userId,
                        hotel_name: HotelData.name,
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        from: EmailFrom,
                        to: BDMData.email,
                        subject: 'Hotel ' + HotelData.name + ' has been added by BDE - ' + BDEData.firstname,
                        html: htmlToSend
                    };
                    transporter.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            sails.log(response, 'response email')
                        }
                    });
                });

                //------------------------send to hotel------------------------------
                readHTMLFile('api/emailTemplates/hotelierWelcome/created.ejs', function (err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                        name: HotelData.name,
                        createdAt: HotelData.createdAt,
                    };
                    var htmlToSend = template(replacements);
                    var mailOptions = {
                        from: EmailFrom,
                        to: HotelData.email,
                        subject: 'Jusbid welcomes you onboard',
                        html: htmlToSend
                    };
                    transporter.sendMail(mailOptions, function (error, response) {
                        if (error) {
                            console.log(error);

                        }

                        if (response) { sails.log(response) }
                    });
                });


            }
        });
    });
}









