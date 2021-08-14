var fs = require('fs');
var async = require('async');
const MaxBytesUpload_UserFile = 60000000;

module.exports = {


    CreateHotel: async (req, res) => {

        sails.log(req.body.hotel_views, req.body.seasonal_months, 'new data keys', req.body.hotel_amenities, 'req.body.hotel_amenities');
        if (req.body.hotel_views) {
            var hotel_views = req.body.hotel_views;
            hotel_views = hotel_views.replace(/(')/g, '"');
            hotel_views = JSON.parse(hotel_views);
        }

        if (req.body.seasonal_months) {
            var hotel_months = req.body.seasonal_months;
            hotel_months = hotel_months.replace(/(')/g, '"');
            hotel_months = JSON.parse(hotel_months);
        }

        var hotel_amenities = [];
        if (hotel_amenities != "") { hotel_amenities = req.body.hotel_amenities; }

        if (typeof hotel_amenities == "string" && hotel_amenities != '') {
            try {
                hotel_amenities = JSON.parse(hotel_amenities);
            }
            catch (err) {
                return res.send({ responseCode: 201, data: {}, msg: 'Error while creating hotel: ' + err });
            }

        }

        let HotelName = req.body.name;
        HotelName = HotelName.trim();

        if (req.body.hotel_id && req.body.hotel_id != '') {

            if (!req.body.hotel_id) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel_id to update..' });
            }



            let HotelData = await Hotel.update({ id: req.body.hotel_id }).set({

                name: HotelName,
                view_name: req.body.view_name,
                category: req.body.category,
                rating: req.body.rating,
                hotel_amenities: hotel_amenities,
                downfall: req.body.downfall,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                plot_no: req.body.plot_no,
                street: req.body.street,
                area: req.body.area,
                address: req.body.address,
                landmark: req.body.landmark,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                country: req.body.country,
                occupancy: req.body.occupancy,
                landline: req.body.landline,
                mobile: req.body.mobile,
                email: req.body.email,
                owner_name: req.body.owner_name,
                owner_mobile: req.body.owner_mobile,
                owner_email: req.body.owner_email,
                manager_name: req.body.manager_name,
                manager_mobile: req.body.manager_mobile,
                manager_email: req.body.manager_email,
                exec_name: req.body.exec_name,
                exec_mobile: req.body.exec_mobile,
                exec_email: req.body.exec_email,
                fax: req.body.fax,
                manager_email: req.body.manager_email,
                status: req.body.status,
                // new keys----------------------------
                hotel_views: hotel_views,
                seasonal_months: hotel_months,
                star_rating: req.body.star_rating,

            });

            let GetHotelData = await Hotel.findOne({ id: req.body.hotel_id });

            sails.log('hotel updated', GetHotelData);

            return res.send({ responseCode: 200, msg: 'Hotel data updated successfully', data: GetHotelData });


        } else {

            let CheckVerify = await Hotel.findOne({
                email: req.body.email, name: HotelName, address: req.body.address
            });

            let email_Check = await Hotel.findOne({
                email: req.body.email, name: HotelName
            });

            if (CheckVerify) {
                return res.send({ responseCode: 201, data: {}, msg: 'Hotel with this information already exists..' });
            }

            if(email_Check){
                return res.send({ responseCode: 201, data: {}, msg: 'Hotel with this information already exists..' });
            }

            sails.log(email_Check, 'email_Check', req.body.email, HotelName);

            if (!req.body.bdeId && !req.body.name && !req.body.city) {
                return res.send({ responseCode: 201, data: {}, msg: 'Please provide all mandatory details to add a hotel' });
            }

            let HotelData = await Hotel.create({

                bdeId: req.body.bdeId,
                hotelierId: req.body.hotelierId,
                name: HotelName,
                view_name: req.body.view_name,
                category: req.body.category,
                rating: req.body.rating,
                hotel_amenities: req.body.hotel_amenities,
                downfall: req.body.downfall,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                plot_no: req.body.plot_no,
                street: req.body.street,
                area: req.body.area,
                address: req.body.address,
                landmark: req.body.landmark,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip,
                country: req.body.country,
                occupancy: req.body.occupancy,
                landline: req.body.landline,
                mobile: req.body.mobile,
                email: req.body.email,
                owner_name: req.body.owner_name,
                owner_mobile: req.body.owner_mobile,
                owner_email: req.body.owner_email,
                manager_name: req.body.manager_name,
                manager_mobile: req.body.manager_mobile,
                manager_email: req.body.manager_email,
                exec_name: req.body.exec_name,
                exec_mobile: req.body.exec_mobile,
                exec_email: req.body.exec_email,
                fax: req.body.fax,
                manager_email: req.body.manager_email,
                // new keys----------------------------
                hotel_views: hotel_views,
                seasonal_months: hotel_months,
                star_rating: req.body.star_rating

            }).fetch();

            sails.log('hotel added succesfuly', HotelData);

            if (HotelData) {
                mailer.HotelAdded(HotelData);
                NotificationsFunctions.HotelCreationNotification_BDM_BDE(req.body.bdeId, req.body.name);
                mailer.Hotel_Add_Notification_BDM_with_Hotel(HotelData, req.body.bdeId);
            }

            return res.send({ responseCode: 200, msg: 'Hotel data saved successfully', data: HotelData });
        }

    },


    CreateHotelRooms: async (req, res) => {

        var DataBody = req.body.rooms;

        DataBody = DataBody.replace(/(')/g, '"');
        DataBody = JSON.parse(DataBody);

        var Hotel_Id = req.body.hotel_id;

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel ID to save room & other details' });
        }

        sails.log(DataBody, 'DataBody');

        async.eachOfSeries(DataBody, function (RoomRecord, key, callback) {

            if (RoomRecord) {
                let SaveData = {
                    hotel_id: Hotel_Id,
                    room_views: RoomRecord.room_view,
                    room_type: RoomRecord.room_type,
                    room_amenities: RoomRecord.room_amenities,
                    price: RoomRecord.price,
                    quantity: RoomRecord.quantity,
                    capacity: RoomRecord.capacity,
                    size: RoomRecord.size
                }
                HotelRooms.findOne({ room_type: RoomRecord.room_type, hotel_id: Hotel_Id }).exec(function (err, RoomRecord) {
                    if (!RoomRecord) {
                        HotelRooms.create(SaveData).fetch().exec(function (err, RoomRecord) {
                            sails.log(RoomRecord, 'RoomRecord');
                            callback();
                        });
                    } else {
                        sails.log('RoomRecord already exists');
                        callback();
                    }

                });


            } else {
                callback();
            }

        }, function (err) {
            if (err) {
                return res.send({ responseCode: 201, msg: 'Error occured while saving hotel rooms' });
            } else {
                return res.send({ responseCode: 200, msg: 'Hotel Rooms Saving is in progress', data: [] });
            }
        });

    },



}