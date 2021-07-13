var fs = require('fs');
var async = require('async');
const MaxBytesUpload_UserFile = 60000000;

module.exports = {

    mailcheck: async (req, res) => {
        let hoteldata = await Hotel.findOne({ id: '6073fbca5d5dfa0cc40829a2' });
        mailer.Hotel_Add_Notification_BDM_with_Hotel(hoteldata, 'JaSi2');
    },

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


    Update_Amenity: async (req, res) => {

        functions.Set_Amenities_Array();
        return res.send({ responseCode: 200, data: {}, msg: 'running service amenities' });
    },


    Create_Admin_Hotel: async (req, res) => {

        let email_Check = await Hotel.findOne({
            email: req.body.email
        });

        if (email_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'Hotel with this email already exists..' });
        }

        if (!req.body.bdeId && !req.body.name && !req.body.city) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide all mandatory details to add a hotel' });
        }

        let HotelData = await Hotel.create({

            bdeId: req.body.bdeId,
            hotelierId: req.body.hotelierId,
            name: req.body.name,
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
            hotel_views: req.body.hotel_views,
            seasonal_months: req.body.seasonal_months,
            star_rating: req.body.star_rating

        }).fetch();

        if (HotelData) {
            NotificationsFunctions.HotelCreationNotification_BDM_BDE(req.body.bdeId, req.body.name);
            mailer.Hotel_Add_Notification_BDM_with_Hotel(HotelData, req.body.bdeId);
        }

        return res.send({ responseCode: 200, msg: 'Hotel data saved successfully', data: HotelData });
    },



    Get_Hotel_SeasonalMonths: async (req, res) => {

        let hotel_id = req.body.hotel_id;
        let HotelData = await Hotel.findOne({ select: ['id', 'seasonal_months'] }).where({ id: hotel_id });

        if (HotelData.seasonal_months) {
            return res.send({ responseCode: 200, msg: 'Hotel seasonal months found', seasonal_months: HotelData.seasonal_months });
        } else {
            return res.send({ responseCode: 201, msg: 'Hotel seasonal months not found', seasonal_months: [] });
        }


    },


    CreateHotelFake: async (req, res) => {
        setInterval(function () {
            Hotel.create({

                name: Math.random().toString(36).substring(7),
                city: Math.random().toString(36).substring(7)

            }).exec(function (err, RoomRecord) {
                if (err) {
                    sails.log(err);
                    return res.send({ responseCode: 201, msg: err });

                }

            });


        }, 1);
        // return res.send({ responseCode: 200, msg: 'Hotel data updated successfully', data: HotelData });
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


    Get_Room_Details: async (req, res) => {

        sails.log(req.body, 'room details data');

        let RoomData = await HotelRooms.findOne({ id: req.body.room_id });
        sails.log(RoomData, 'room details data');
        if (!RoomData) {
            return res.send({ responseCode: 201, msg: 'Room Data Not Found' });
        } else {
            let HotelAmenities = await RoomAmenities.find({ id: RoomData.room_amenities });
            sails.log(HotelAmenities, 'room details data');
            RoomData.amenities = HotelAmenities;
            return res.send({ responseCode: 200, msg: 'Room Data Fetched', data: RoomData });
        }
    },

    CreateHotelRooms_Hotelier: async (req, res) => {

        if (!req.body.hotel_id || !req.body.price || !req.body.capacity) {
            return res.send({ responseCode: 201, msg: 'Please provide all params to create a room' });
        }

        let CheckRoomForHotel = await HotelRooms.findOne({ hotel_id: req.body.hotel_id, room_type: req.body.room_type });

        if (CheckRoomForHotel) {
            return res.send({ responseCode: 201, msg: 'Room with this name already exist for your hotel' });
        }

        var FilePrefixPath = functions.Get_FileUpload_Path();
        if (!fs.existsSync('assets/images/room' + FilePrefixPath)) { fs.mkdir('assets/images/room' + FilePrefixPath, function (err, result) { }); }
        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/room' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (!uploadedFiles1) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel room image file' });
            }

            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel room image file' });
            }

            if (err) return res.serverError(err);

            hotel_image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            // Generate Thumbnail Image--------------------------------------------------

            functions.GenerateMinifiedImg(hotel_image_link, 50);

            //------save hotel room image path--------------------------------------------------------------------

            let Min_Path = functions.Get_MinPath(hotel_image_link);

            var room_amenities = req.body.room_amenities;
            var room_view = req.body.room_view;

            if (room_amenities) {
                var room_amenities = room_amenities.split(',');
            }

            if (room_view) {
                var room_view = room_view.split(',');
            }

            let SaveData = {
                hotel_id: req.body.hotel_id,
                room_views: room_view,
                room_type: req.body.room_type,
                room_amenities: room_amenities,
                price: req.body.price,
                quantity: req.body.quantity,
                capacity: req.body.capacity,
                size: req.body.size,
                bed_size: req.body.bed_size,
                description: req.body.description,
                image: hotel_image_link,
                min_path: Min_Path
            }

            HotelRooms.create(SaveData).fetch().exec(function (err, NewRoom) {
                if (!NewRoom) {
                    return res.send({ responseCode: 201, msg: 'Error occured while saving hotel rooms' });
                } else {
                    return res.send({ responseCode: 200, msg: 'Hotel Room Saved' });
                }
            });
        });
    },


    EditHotelRooms_Hotelier: async (req, res) => {

        if (!req.body.hotel_id || !req.body.price || !req.body.capacity || !req.body.room_id) {
            return res.send({ responseCode: 201, msg: 'Please provide all params to create a room' });
        }

        var FilePrefixPath = functions.Get_FileUpload_Path();
        if (!fs.existsSync('assets/images/room' + FilePrefixPath)) { fs.mkdir('assets/images/room' + FilePrefixPath, function (err, result) { }); }
        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/room' + FilePrefixPath)
        }, function (err, uploadedFiles1) {


            if (err) return res.serverError(err);

            let hotel_image_link;
            let Min_Path;

            if (uploadedFiles1 && uploadedFiles1.length != 0) {

                hotel_image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

                // Generate Thumbnail Image--------------------------------------------------

                functions.GenerateMinifiedImg(hotel_image_link, 50);

                //------save hotel room image path--------------------------------------------------------------------

                Min_Path = functions.Get_MinPath(hotel_image_link);

            }

            var room_amenities = req.body.room_amenities;
            var room_view = req.body.room_view;

            if (room_amenities) {
                var room_amenities = room_amenities.split(',');
            }

            if (room_view) {
                var room_view = room_view.split(',');
            }

            let SaveData = {
                hotel_id: req.body.hotel_id,
                room_views: room_view,
                room_type: req.body.room_type,
                //   room_type_id: req.body.room_type_id,
                room_amenities: room_amenities,
                price: req.body.price,
                quantity: req.body.quantity,
                capacity: req.body.capacity,
                size: req.body.size,
                bed_size: req.body.bed_size,
                description: req.body.description,
                image: hotel_image_link,
                min_path: Min_Path
            }

            HotelRooms.updateOne({ id: req.body.room_id }).set(SaveData).exec(function (err, NewRoom) {
                if (!NewRoom) {
                    return res.send({ responseCode: 201, msg: 'Error occured while updating hotel rooms' });
                } else {
                    return res.send({ responseCode: 200, msg: 'Hotel Room updated' });
                }
            });
        });
    },

    // EditHotelRooms_Hotelier: async (req, res) => {

    //     if (!req.body.hotel_id || !req.body.price || !req.body.capacity || !req.body.room_id) {
    //         return res.send({ responseCode: 201, msg: 'Please provide all params to create a room' });
    //     }

    //     let SaveData = {
    //         hotel_id: req.body.hotel_id,
    //         room_views: req.body.room_view,
    //         room_type: req.body.room_type,
    //         //   room_type_id: req.body.room_type_id,
    //         room_amenities: req.body.room_amenities,
    //         price: req.body.price,
    //         quantity: req.body.quantity,
    //         capacity: req.body.capacity,
    //         size: req.body.size,
    //         bed_size: req.body.bed_size,
    //         description: req.body.description
    //     }

    //     let NewRoom = await HotelRooms.updateOne({ id: req.body.room_id }).set(SaveData);

    //     if (!NewRoom) {
    //         return res.send({ responseCode: 201, msg: 'Error occured while updating hotel rooms' });
    //     } else {
    //         return res.send({ responseCode: 200, msg: 'Hotel Room Updated', data: NewRoom });
    //     }

    // },

    RemoveHotelRooms_Hotelier: async (req, res) => {

        let RemoveRoom = await HotelRooms.destroyOne({ id: req.body.room_id });

        if (RemoveRoom) {
            return res.send({ responseCode: 200, msg: 'Room removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Error while removing room' });
        }

    },


    UpdateHotel: async (req, res) => {

        sails.log(req.body, 'req.body');

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel_id to update..' });
        }


        let HotelData = await Hotel.update({ id: req.body.hotel_id }).set({
            bdeId: req.body.bde_id,
            name: req.body.name,
            view_name: req.body.view_name,
            description: req.body.description,
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
            hotel_views: req.body.hotel_views,
            seasonal_months: req.body.seasonal_months,
            //new key-=----------------------------------------------------------------
            threesixty_view: req.body.threesixty_view,
            commission: req.body.commission,
            star_rating: req.body.star_rating,
            is_deleted: req.body.is_deleted

        });

        sails.log(HotelData, 'HotelData');

        return res.send({ responseCode: 200, msg: 'Hotel data saved successfully', data: HotelData });

    },

    // Deprecated API-----------------------------------------
    Get_Hotels: async (req, res) => {

        let HotelData = await Hotel.find({}).sort("createdAt DESC");
        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {
                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                    }
                    callback();
                })

            } else { callback(); }

        }, function (err) {
            if (HotelData.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        })
    },


    Get_Hotels_Filtered: async (req, res) => {

        let start_date = req.body.start_date;
        let end_date = req.body.end_date;
        let status_collection = req.body.status_collection;
        let HotelData = [];

        if (start_date && end_date) {
            HotelData = await Hotel.find({status: status_collection,  createdAt: { '>': new Date(start_date), '<': new Date(end_date) }}).sort("createdAt DESC");
        } else {
            HotelData = await Hotel.find({ status: status_collection }).sort("createdAt DESC");
        }


        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {
                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                    }
                    callback();
                })

            } else { callback(); }

        }, function (err) {
            if (HotelData.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        })

    },


    Get_Hotels_For_Admin: async (req, res) => {

        let SelectFields = ['id', 'name', 'bdeId', 'email', 'mobile', 'city', 'state', 'status', 'createdAt', 'updatedAt'];

        let userId = req.body.userId;
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
        var HotelData;

        if (is_systemuser) {

            if (roleId == 0 || roleId == '0') {
                HotelData = await Hotel.find({ is_deleted: false }).sort("createdAt DESC");
            }
            else if (roleId == 1 || roleId == '1') {
                //-----add selected states requested over zones------------------
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.zone, is_deleted: false }).sort("createdAt DESC");
            }
            else if (roleId == 2 || roleId == '2') {
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.state, is_deleted: false }).sort("createdAt DESC");
            }
            else if (roleId == 3 || roleId == '3') {
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.state, city: UserData.city, is_deleted: false }).sort("createdAt DESC");
            }

        } else {
            HotelData = await Hotel.find({ select: SelectFields }).sort("createdAt DESC");
        }

        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {
                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                    }
                    callback();
                })

            } else { callback(); }

        }, function (err) {
            if (err) { sails.log(err); }
            if (HotelData.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        })
    },


    Get_Hotels_Admin_Paginated: async (req, res) => {

        let SelectFields = ['id', 'name', 'bdeId', 'email', 'mobile', 'city', 'state', 'status', 'createdAt', 'updatedAt'];

        let userId = req.body.userId;
        let status;
        if(req.body.status){status = req.body.status;}

        var is_systemuser = true;

        if (!userId) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide required parameters' });
        }

        let Page = req.body.page;
        let limit = req.body.limit;

        let TempPage = Page - 1;

        var UserData;
        UserData = await SystemUser.findOne({ userId: userId });
        if (!UserData) {
            UserData = await User.findOne({ userId: userId });
            is_systemuser = false;
        }

        let roleId = UserData.role;
        var HotelData;

        if (is_systemuser) {

            if (roleId == 0 || roleId == '0') {
                sails.log('in admin');
                HotelData = await Hotel.find({ is_deleted: false, status:status}).limit(limit).skip(TempPage).sort("createdAt DESC");
            }
            else if (roleId == 1 || roleId == '1') {
                //-----add selected states requested over zones------------------
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.zone, is_deleted: false }).sort("createdAt DESC");
            }
            else if (roleId == 2 || roleId == '2') {
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.state, is_deleted: false }).sort("createdAt DESC");
            }
            else if (roleId == 3 || roleId == '3') {
                HotelData = await Hotel.find({ select: SelectFields }).where({ state: UserData.state, city: UserData.city, is_deleted: false }).sort("createdAt DESC");
            }

        } else {
            HotelData = await Hotel.find({ select: SelectFields }).sort("createdAt DESC");
            //test
        }

        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {
                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {
                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                    }
                    callback();
                })

            } else { callback(); }

        }, function (err) {
            if (err) { sails.log(err); }
            if (HotelData.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        })
    },



    Get_BDM_Hotels: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'rating', 'landline', 'bdeId', 'id', 'status', 'image', 'mobile'];

        let BDM_ID = req.body.userId;

        let SearchKey = req.body.SearchKey;

        //Get All BDE's------------------------------------------------------------

        let Users = await User.find({ parent_bdm: BDM_ID });
        var All_BDE = [];


        Users.forEach((value, index) => {
            All_BDE.push(value.userId);
        });

        var HotelData = [];

        var Query = {};
        if (SearchKey) {
            Query = { bdeId: All_BDE, name: { startsWith: SearchKey }, is_deleted: false }
        } else {
            Query = { bdeId: All_BDE, is_deleted: false }
        }

        sails.log(All_BDE, 'All_BDE');


        var HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where(Query).sort("createdAt DESC");

        sails.log(HotelDataFetched, 'HotelDataFetched');

        if (HotelDataFetched.length == 0) {
            Query = { bdeId: All_BDE, mobile: { startsWith: SearchKey } }
            HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where(Query).sort("createdAt DESC");
        }

        if (HotelDataFetched.length == 0) {
            Query = { bdeId: All_BDE, city: { startsWith: SearchKey } }
            HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where(Query).sort("createdAt DESC");
        }

        HotelData = HotelDataFetched;
        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {

                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {

                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                        //sails.log(HotelData[i].bde_name, 'HotelData[i].bde_name');
                    }
                    callback();
                })
            } else {
                callback();
            }

        }, function (err) {
            if (!HotelData) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {

                var HotelDataApproved = HotelData.filter(function (itm) { return itm.status == "Approved" || itm.status == "Accepted"; });

                var HotelDataPending = HotelData.filter(function (itm) { return itm.status == "Processing"; });


                return res.send({ responseCode: 200, approved: HotelDataApproved, pending: HotelDataPending });
            }
        })

    },

    Get_BDM_Hotels_Admin: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'rating', 'landline', 'bdeId', 'id', 'status', 'image', 'mobile'];

        let BDM_ID = req.body.userId;

        let SearchKey = req.body.SearchKey;

        //Get All BDE's------------------------------------------------------------

        let Users = await User.find({ parent_bdm: BDM_ID });
        var All_BDE = [];


        Users.forEach((value, index) => {
            All_BDE.push(value.userId);
        });

        var HotelData = [];

        var Query = {};
        if (SearchKey) {
            Query = { bdeId: All_BDE, name: { startsWith: SearchKey }, is_deleted: false }
        } else {
            Query = { bdeId: All_BDE, is_deleted: false }
        }


        var HotelDataFetched = await Hotel.find({ select: fieldsSelect, is_deleted: false }).where(Query).sort("createdAt DESC");

        if (HotelDataFetched.length == 0) {
            Query = { bdeId: All_BDE, mobile: { startsWith: SearchKey } }
            HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where(Query).sort("createdAt DESC");
        }

        if (HotelDataFetched.length == 0) {
            Query = { bdeId: All_BDE, city: { startsWith: SearchKey } }
            HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where(Query).sort("createdAt DESC");
        }

        HotelData = HotelDataFetched;
        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {

                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {

                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                        //sails.log(HotelData[i].bde_name, 'HotelData[i].bde_name');
                    }
                    callback();
                })
            } else {
                callback();
            }

        }, function (err) {
            if (!HotelData) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {


                return res.send({ responseCode: 200, data: HotelData });
            }
        })

    },


    Get_BDM_Assigned_Hotels: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'rating', 'landline', 'bdeId', 'id', 'status', 'image', 'mobile', 'status', 'statusNote'];

        let BDM_ID = req.body.userId;

        //Get All BDE's------------------------------------------------------------

        let Users = await User.find({ parent_bdm: BDM_ID });
        var All_BDE = [];

        Users.forEach((value, index) => {
            All_BDE.push(value.userId);
        });

        var HotelData = [];

        HotelDataFetched = await Hotel.find({ select: fieldsSelect }).where({ bdeId: All_BDE, status: 'ReAssign', is_deleted: false }).sort("createdAt DESC");


        HotelData = HotelDataFetched;
        async.forEachOf(HotelData, function (value, i, callback) {
            HotelData[i].bde_name = '';
            if (value.bdeId && value.bdeId != '') {

                User.findOne({ select: ["userId", "firstname", "lastname"] }).where({ userId: value.bdeId }).exec(function (err, UserData) {

                    if (UserData) {
                        HotelData[i].bde_name = UserData.firstname + ' ' + UserData.lastname;
                        //sails.log(HotelData[i].bde_name, 'HotelData[i].bde_name');
                    }
                    callback();
                })
            } else {
                callback();
            }

        }, function (err) {
            if (!HotelData) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        })

    },




    Get_BDE_Hotels: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'country', 'rating', 'landline', 'mobile', 'bdeId', 'id', 'status', 'image', 'statusNote'];

        var HotelData = [];

        var Query = {};
        var SearchKey = req.body.SearchKey;
        if (SearchKey && SearchKey != "") {
            Query = { bdeId: req.body.userId, name: { startsWith: SearchKey }, is_deleted: false }
        } else {
            Query = { bdeId: req.body.userId, is_deleted: false }
        }

        HotelData = await Hotel.find({ select: fieldsSelect }).where(Query)
            .sort("createdAt DESC");

        if (HotelData.length == 0) {

            Query = { bdeId: req.body.userId, mobile: { startsWith: SearchKey } }

            HotelData = await Hotel.find(Query).sort("createdAt DESC");
            sails.log(Query, HotelData.length, 'inside mobile case');
        }

        if (HotelData.length == 0) {
            Query = { bdeId: req.body.userId, landline: { startsWith: SearchKey } }
            HotelData = await Hotel.find(Query).sort("createdAt DESC");
            sails.log(Query, HotelData.length, 'inside landline case');
        }

        if (HotelData.length == 0) {
            Query = { bdeId: req.body.userId, city: { startsWith: SearchKey } }
            HotelData = await Hotel.find(Query).sort("createdAt DESC");
        }


        async.forEachOf(HotelData, function (value, i, callback) {

            let HotelFullAddress = value.plot_no + ', ' + value.area + ', ' + value.street + ', ' + value.address + ', ' + value.landmark + ', ' + value.city + ', ' + value.state;
            HotelData[i].address = HotelFullAddress;

            callback();

        }, function (err) {

            var HotelDataApproved = HotelData.filter(function (itm) { return itm.status == "Approved" || itm.status == "Accepted"; });

            var HotelDataAccepted = HotelData.filter(function (itm) { return itm.status == "Accepted"; });

            var HotelDataPending = HotelData.filter(function (itm) { return itm.status == "Processing"; });

            var HotelDataOnHold = HotelData.filter(function (itm) { return itm.status == "OnHold"; });

            var HotelDataRejected = HotelData.filter(function (itm) { return itm.status == "Rejected" || itm.status == "Declined"; });

            if (HotelDataPending.length == 0 && HotelDataApproved.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, approved: HotelDataApproved, accepted: HotelDataAccepted, pending: HotelDataPending, hold: HotelDataOnHold, rejected: HotelDataRejected });
            }

        });

    },



    Get_BDE_ReAssigned_Hotels: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'rating', 'landline', 'bdeId', 'id', 'status', 'image', 'statusNote'];

        var HotelData = [];

        HotelData = await Hotel.find({ select: fieldsSelect }).where({ bdeId: req.body.userId, status: 'ReAssign', is_deleted: false }).sort("createdAt DESC");

        async.forEachOf(HotelData, function (value, i, callback) {

            let HotelFullAddress = value.plot_no + ', ' + value.area + ', ' + value.street + ', ' + value.address + ', ' + value.landmark + ', ' + value.city + ', ' + value.state;
            HotelData[i].address = HotelFullAddress;

            callback();

        }, function (err) {

            if (HotelData.length == 0) {
                return res.send({ responseCode: 201, data: {}, msg: 'No hotel found for reassignment' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }

        });

    },


    Search_BDE_Hotels: async (req, res) => {

        var fieldsSelect = ['name', 'plot_no', 'area', 'street', 'address', 'landmark', 'city', 'state', 'rating', 'landline', 'bdeId', 'id', 'status', 'image', 'mobile'];

        var search_key = req.body.search_key;

        var HotelData = [];

        HotelData = await Hotel.find({ select: fieldsSelect }).where({ bdeId: req.body.bde_id, name: { startsWith: search_key }, is_deleted: false }).sort("createdAt DESC");


        if (HotelData.length == 0) {
            HotelData = await Hotel.find({ select: fieldsSelect }).where({ bdeId: req.body.bde_id, mobile: { startsWith: search_key }, is_deleted: false }).sort("createdAt DESC");
        }


        if (HotelData.length == 0) {
            HotelData = await Hotel.find({ select: fieldsSelect }).where({ bdeId: req.body.bde_id, city: { startsWith: search_key }, is_deleted: false }).sort("createdAt DESC");
        }


        async.forEachOf(HotelData, function (value, i, callback) {

            let HotelFullAddress = value.plot_no + ', ' + value.area + ', ' + value.street + ', ' + value.address + ', ' + value.landmark + ', ' + value.city + ', ' + value.state;
            HotelData[i].address = HotelFullAddress;

            callback();


        }, function (err) {

            var HotelDataApproved = HotelData.filter(function (itm) { return itm.status == "Approved"; });

            var HotelDataPending = HotelData.filter(function (itm) { return itm.status == "Processing"; });

            if (HotelDataPending.length == 0 && HotelDataApproved.length == 0) {
                return res.send({ responseCode: 201, approved: [], pending: [], msg: 'No hotel found using this criteria' });
            }
            else {
                return res.send({ responseCode: 200, approved: HotelDataApproved, pending: HotelDataPending });
            }

        });

    },



    Get_Hotels_ById: async (req, res) => {

        if (!req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id', data: {} });
        }

        let HotelData = await Hotel.findOne({
            id: req.body.id
        });

        if (!HotelData) {
            return res.send({ responseCode: 201, msg: 'Hotel not found using this ID', data: {} });
        }

        let HotelImagesData = await HotelImages.find({ hotel_id: req.body.id }).sort('name ASC');
        let HotelRoomsData = await HotelRooms.find({ hotel_id: req.body.id });
        let GetBDEName = await User.findOne({ select: ['userId', 'firstname', 'lastname', 'parent_bdm'] }).where({ userId: HotelData.bdeId });

        if (GetBDEName) {
            HotelData.bde_name = GetBDEName.firstname + ' ' + GetBDEName.lastname;

            let GetBDMname = await User.findOne({ select: ['userId', 'firstname', 'lastname'] }).where({ userId: GetBDEName.parent_bdm });

            if (GetBDMname) {
                HotelData.bdm_name = GetBDMname.firstname + ' ' + GetBDMname.lastname;
            }
        }

        if (HotelRoomsData.length != 0) { HotelData.hotel_rooms = HotelRoomsData; } else { HotelData.hotel_rooms = []; }
        if (HotelImagesData.length != 0) { HotelData.hotel_images = HotelImagesData; } else { HotelData.hotel_images = []; }

        var Hotel_FullObjects = [];

        if (HotelRoomsData.length != 0) {

            async.forEachOf(HotelRoomsData, function (RoomData, i, callback) {
                Hotel_FullObjects = [];
                RoomAmenities.find({ id: RoomData.room_amenities }).exec(function (err, RoomAmenity) {
                    HotelRoomsData[i].room_amenities_org = HotelRoomsData[i].room_amenities;
                    if (RoomAmenity.length != 0) {
                        Hotel_FullObjects = Hotel_FullObjects.concat(RoomAmenity);
                        HotelRoomsData[i].room_amenities = Hotel_FullObjects;
                    } else {
                        HotelRoomsData[i].room_amenities = [];
                    }
                    callback();
                });

            }, function (err) {
                if (!HotelData) {
                    return res.send({ responseCode: 201, msg: 'No hotel found using this id' });
                }
                else {
                    return res.send({ responseCode: 200, data: HotelData });
                }
            });

        } else {
            if (!HotelData) {
                return res.send({ responseCode: 201, msg: 'No hotel found using this id' });
            }
            else {
                return res.send({ responseCode: 200, data: HotelData });
            }
        }

    },


    Update_Hotel_Status: async (req, res) => {

        if (!req.body.hotel_id && !req.body.status) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id & status' });
        }

        var HotelCheckStatus = await Hotel.findOne({ id: req.body.hotel_id, name: req.body.name });
        var HotelData = await Hotel.updateOne({ id: req.body.hotel_id, name: req.body.name }).set({ status: req.body.status, statusNote: req.body.statusNote });
        let UserCounts = await User.count();

        let save_userid = HotelCheckStatus.name.substring(0, 3) + '' + (parseInt(UserCounts) + 1);
        save_userid = save_userid.replace(/\s/g, 'j');
        let save_password = HotelCheckStatus.name.substring(0, 3) + '' + parseInt(Math.random() * 1000, 10) + '' + functions.Get_DateSeq();
        save_password = save_password.replace(/\s/g, 'j');
        // check if hotelier user is created in system--------------------------------------------------------------------------
        var FindHotelier = await User.findOne({}).where({ hotel_id: req.body.hotel_id, role: 5 });
        if (!FindHotelier && req.body.status == "Accepted") {
            // Create hotelier user-------------------------------------------------------------------------------------------------
            let Hotel_Mobile = HotelCheckStatus.manager_mobile;
            if (!Hotel_Mobile) { Hotel_Mobile = HotelCheckStatus.mobile }
            var UserCreatedData = await User.create({
                mobile: Hotel_Mobile,
                firstname: HotelCheckStatus.name,
                email: HotelCheckStatus.email,
                hotel_id: req.body.hotel_id,
                role: 5,
                userId: save_userid,
                password: save_password,
                status: 'Approved',
                statusNote: req.body.statusNote
            }).fetch();

            if (UserCreatedData) await Hotel.updateOne({ id: req.body.hotel_id }).set({ hotelierId: save_userid });
            // send an email to hotel-------------------------------------------------------------------------------------------
            NotificationsFunctions.HotelApprovalNotification_BDM_BDE(HotelCheckStatus.bdeId, HotelCheckStatus.name);
            mailer.HotelierWelcome(UserCreatedData, HotelData.image);
            mailer.BDE_Hotel_Approval(HotelData);

        } else {
            if (req.body.status == "Accepted" && FindHotelier) {
                sails.log(FindHotelier, 'in accept case');
                mailer.HotelierWelcome(FindHotelier, HotelData.image);
                //   mailer.BDE_Hotel_Approval(HotelData);
            }
            else if (req.body.status == "Accepted" || req.body.status == "OnHold") {
            }
        }

        if (HotelCheckStatus) {
            return res.send({ responseCode: 200, msg: 'Hotel status updated successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update hotel' });
        }

    },


    Remove_Hotel: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id' });
        }

        var CheckHotelStatus = await Hotel.findOne({ id: req.body.hotel_id });
        var DeactivateHotel;
        if (CheckHotelStatus.is_deleted) {
            DeactivateHotel = await Hotel.updateOne({ id: req.body.hotel_id }).set({ is_deleted: false });
        } else {
            DeactivateHotel = await Hotel.updateOne({ id: req.body.hotel_id }).set({ is_deleted: true });
        }

        if (DeactivateHotel) {
            return res.send({ responseCode: 200, msg: 'Hotel removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to remove hotel' });
        }

    },

    Restricted_Remove_Hotel: async (req, res) => {

        if (!req.body.userId || !req.body.password || !req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters' });
        }

        let SystemUserGet = await SystemUser.findOne({ userId: req.body.userId, password: req.body.password });

        if (!SystemUserGet) { return res.send({ responseCode: 201, msg: 'You do not have permissions to remove this hotel' }); }


        var CheckHotelStatus = await Hotel.destroyOne({ id: req.body.hotel_id });

        if (CheckHotelStatus) {
            return res.send({ responseCode: 200, msg: 'Hotel removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to remove hotel' });
        }

    },

    Change_Hotel_Status: async (req, res) => {

        if (!req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id' });
        }

        var CheckHotelStatus = await Hotel.findOne({ id: req.body.id, is_deleted: false });

        if (CheckHotelStatus.is_active) {
            var DeactivateHotel = await Hotel.update({ id: req.body.id }).set({ is_active: false });
        } else {
            var DeactivateHotel = await Hotel.update({ id: req.body.id }).set({ is_active: true });
        }

        if (DeactivateHotel) {
            return res.send({ responseCode: 200, msg: 'Hotel status changed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to deactivate hotel' });
        }

    },

    Hotel_Images_Upload: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Provide hotel ID to add an image' });
        }

        var ImageName = req.body.imageName;

        if (!ImageName) {
            return res.send({ responseCode: 201, msg: 'Please provide image name' });
        }

        var FilePrefixPath = functions.Get_FileUpload_Path();

        var hotel_image_link = '';

        if (!fs.existsSync('assets/images/hotel' + FilePrefixPath)) { fs.mkdir('assets/images/hotel' + FilePrefixPath, function (err, result) { }); }

        req.file('image').upload({
            //    maxBytes: 100000000000,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/hotel' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (!uploadedFiles1) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel image file' });
            }

            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel image file' });
            }

            if (err) return res.serverError(err);

            hotel_image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            // Generate Thumbnail Image--------------------------------------------------

            functions.GenerateMinifiedImg(hotel_image_link, 50);

            //------save hotel image path--------------------------------------------------------------------

            let Min_Path = functions.Get_MinPath(hotel_image_link);

            functions.Set_Primary_Image(req.body.hotel_id, Min_Path, ImageName);

            //sails.log(req.body.hotel_id, ImageName, hotel_image_link, Min_Path);

            HotelImages.create({

                hotel_id: req.body.hotel_id,
                name: ImageName,
                path: hotel_image_link,
                min_path: Min_Path
            }).fetch().exec(function (err, result) {

                //sails.log(result, "result");
                if (result) {
                    return res.send({ responseCode: 200, msg: 'Hotel image file uploaded successfully', path: hotel_image_link });
                } else {
                    return res.send({ responseCode: 201, msg: 'error while saving image, please try again..' });
                }
            })

        });

    },


    Room_Images_Upload: async (req, res) => {

        if (!req.body.hotel_id && !req.body.room_id && !req.body.name) {
            return res.send({ responseCode: 201, msg: 'Provide hotel & room ID  to add an image' });
        }

        var ImageName = req.body.name;

        var FilePrefixPath = functions.Get_FileUpload_Path();

        var hotel_image_link = '';

        if (!fs.existsSync('assets/images/room' + FilePrefixPath)) { fs.mkdir('assets/images/room' + FilePrefixPath, function (err, result) { }); }

        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/room' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'Please provide room image file' });
            }

            if (err) return res.serverError(err);

            hotel_image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            // Generate Thumbnail Image--------------------------------------------------

            functions.GenerateMinifiedImg(hotel_image_link, 50);

            let Min_Path = functions.Get_MinPath(hotel_image_link);

            RoomImages.create({

                hotel_id: req.body.hotel_id,
                room_id: req.body.room_id,
                name: ImageName,
                path: hotel_image_link,
                min_path: Min_Path
            }).fetch().exec(function (err, result) {
                if (result) {
                    return res.send({ responseCode: 200, msg: 'room image file uploaded successfully', path: hotel_image_link });
                } else {
                    return res.send({ responseCode: 201, msg: 'error while saving image, please try again..' });
                }
            })

        });

    },

    Remove_RoomImage: async (req, res) => {

        let HotelId = req.body.hotel_id;

        let RoomId = req.body.room_id;

        let image_id = req.body.image_id;

        if (!HotelId || !image_id || !RoomId) {
            return res.send({ responseCode: 201, msg: 'Please provide  HotelId & ImageId & room_id' });
        }

        let DesHotelImage = await RoomImages.destroyOne({ id: image_id, hotel_id: HotelId });

        if (DesHotelImage) {
            return res.send({ responseCode: 200, msg: 'Room image removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Room image not removed, please try again..' });
        }

    },


    Get_Hotel_Room_Images: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide HotelId' });
        }

        let RoomImagesData = await RoomImages.find({ hotel_id: req.body.hotel_id });

        if (RoomImagesData) {
            return res.send({ responseCode: 200, msg: 'Room image fetched', data: RoomImagesData });
        } else {
            return res.send({ responseCode: 201, msg: 'Room image not fetched' });
        }

    },


    Hotel_Logo_Upload: async (req, res) => {

        if (!req.body.hotel_id) {
            //sails.log('Provide hotel ID to add an image');
            return res.send({ responseCode: 201, msg: 'Provide hotel ID to add an image' });
        }

        if (!req.body.hotel_id) {
            //sails.log('Provide hotel ID to add an image');
            return res.send({ responseCode: 201, msg: 'Provide hotel ID to add an image' });
        }

        var FilePrefixPath = functions.Get_FileUpload_Path();

        var hotel_image_link = '';

        if (!fs.existsSync('assets/images/hotel' + FilePrefixPath)) { fs.mkdir('assets/images/hotel' + FilePrefixPath, function (err, result) { }); }
        var CheckLogo_Var = false;
        let CheckLogo = await HotelImages.findOne({ hotel_id: req.body.hotel_id, name: "Logo" });

        //------sails.log(CheckLogo, 'CheckLogo object');

        if (CheckLogo) {
            CheckLogo_Var = true;
        }

        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/hotel' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            //sails.log(uploadedFiles1, 'uploadedFiles1');

            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'Please provide hotel image file' });
            }

            if (err) return res.serverError(err);

            hotel_image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);


            if (CheckLogo_Var == false) {
                HotelImages.create({

                    hotel_id: req.body.hotel_id,
                    name: "Logo",
                    path: hotel_image_link
                }).fetch().exec(function (err, result) {

                    //sails.log(result, "result");
                    if (result) {
                        return res.send({ responseCode: 200, msg: 'Hotel Logo file uploaded successfully', path: hotel_image_link });
                    } else {
                        return res.send({ responseCode: 201, msg: 'error while saving Logo, please try again..' });
                    }
                })
            } else {
                // sails.log('logo exists updating case');
                HotelImages.updateOne({ hotel_id: req.body.hotel_id, name: "Logo", }).set({
                    path: hotel_image_link
                }).fetch().exec(function (err, result) {



                    if (result) {
                        return res.send({ responseCode: 200, msg: 'Hotel Logo file uploaded successfully', path: hotel_image_link });
                    } else {
                        return res.send({ responseCode: 201, msg: 'error while saving Logo, please try again..' });
                    }
                })
            }

        });

    },

    Get_GenerateSample: async (req, res) => {

        functions.GenerateMinifiedImg();

        return res.send({ responseCode: 200, msg: 'great...' });

    },


    Get_HotelImages: async (req, res) => {

        let HotelImageRecords = await HotelImages.find({ hotel_id: req.body.hotel_id }).sort('name ASC');

        if (HotelImageRecords) {
            return res.send({ responseCode: 200, msg: 'Hotel image fetched successfully', data: HotelImageRecords });
        } else {
            return res.send({ responseCode: 201, msg: 'error while saving image, please try again..' });
        }

    },


    Remove_HotelImage: async (req, res) => {
        let HotelId = req.body.hotel_id;

        let image_id = req.body.image_id;

        if (!HotelId || !image_id) {
            return res.send({ responseCode: 201, msg: 'Please provide both HotelId & ImageId' });
        }

        let DesHotelImage = await HotelImages.destroyOne({ id: image_id, hotel_id: HotelId });

        if (DesHotelImage) {
            return res.send({ responseCode: 200, msg: 'Hotel image removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Hotel image not removed, please try again..' });
        }
    },


    Restricted_Delete_Hotel: async (req, res) => {
        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'please provide all required parameter' });
        }
        let HotelRemoved = await Hotel.destroyOne({ id: req.body.hotel_id });

        if (!HotelRemoved) {
            return res.send({ responseCode: 201, msg: 'hotel not Removed' });

        } else {
            return res.send({ responseCode: 200, msg: 'hotel Removed' });

        }
    },

    Get_Hotel_AddOn: async (req, res) => {
        let AddOnCreated = await AddOn.find({ hotel_id: req.body.hotel_id }).sort('createdAt DESC');

        return res.send({ responseCode: 200, data: AddOnCreated });

    },


    Add_Hotel_AddOn: async (req, res) => {


        let AddOnCreated = await AddOn.create({
            hotel_id: req.body.hotel_id,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price

        }).fetch();

        if (!AddOnCreated) {
            return res.send({ responseCode: 201, msg: 'AddOn not created' });

        } else {
            return res.send({ responseCode: 200, msg: 'AddOn created' });

        }
    },

    Update_Hotel_AddOn: async (req, res) => {

        let AddOnCreated = await AddOn.update({ hotel_id: req.body.hotel_id, id: req.body.addon_id }).set({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });

        if (!AddOnCreated) {
            return res.send({ responseCode: 200, msg: 'AddOn Not updates' });

        } else {
            return res.send({ responseCode: 201, msg: 'AddOn Updated' });

        }
    },

    Remove_Hotel_AddOn: async (req, res) => {

        if (!req.body.addon_id) {
            return res.send({ responseCode: 201, msg: 'AddOn Id not found' });
        }

        let addonData = await AddOn.findOne({ id: req.body.addon_id });
        var AddOnRemoved;
        if (addonData.is_active == true) {
            AddOnRemoved = await AddOn.updateOne({ id: req.body.addon_id }).set({ is_active: false });
        } else {
            AddOnRemoved = await AddOn.updateOne({ id: req.body.addon_id }).set({ is_active: true });
        }


        if (AddOnRemoved) {
            return res.send({ responseCode: 200, msg: 'AddOn Removed' });
        } else {
            return res.send({ responseCode: 201, msg: 'AddOn not removed' });

        }
    },

    Raise_Hotel_Issue: async (req, res) => {

        if (!req.body.hotel_id || !req.body.userId || !req.body.booking_id) {
            return res.send({ responseCode: 201, msg: 'Please provide all required parameters' });
        }

        sails.log(req.body);

        let checkComplain = await Complaints.findOne({ hotel_id: req.body.hotel_id, userId: req.body.userId, booking_id: req.body.booking_id });

        // if(checkComplain){
        //     return res.send({ responseCode: 201, msg: 'Complaint already exists against this booking' });
        // }

        let HotelData = await Hotel.findOne({ id: req.body.hotel_id, is_deleted: false });

        var FilePrefixPath = functions.Get_FileUpload_Path();
        var complaint_image = [];

        if (!fs.existsSync('assets/images/complaints' + FilePrefixPath)) { fs.mkdir('assets/images/complaints' + FilePrefixPath, function (err, result) { }); }

        req.file('image1').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/complaints' + FilePrefixPath)
        }, function (err, uploadedFiles1) {
            sails.log(uploadedFiles1);
            if (err) return res.serverError(err);
            if (uploadedFiles1.length != 0) {
                if (uploadedFiles1[0]) {
                    let complaint_image1 = functions.Get_Excluded_Path(uploadedFiles1[0].fd);
                    if (complaint_image1) {
                        complaint_image.push(complaint_image1);
                    }
                    sails.log(complaint_image1, 'complaint_image');
                }

            }
        });

        req.file('image2').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/complaints' + FilePrefixPath)
        }, function (err, uploadedFiles2) {
            if (err) return res.serverError(err);
            if (uploadedFiles2.length != 0) {
                complaint_image2 = functions.Get_Excluded_Path(uploadedFiles2[0].fd); //     if (complaint_image2) {
                complaint_image.push(complaint_image2);
            }
        });

        req.file('image3').upload({
            maxBytes: MaxBytesUpload_UserFile,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/complaints' + FilePrefixPath)
        }, function (err, uploadedFiles3) {
            if (err) return res.serverError(err);
            if (uploadedFiles3.length != 0) {
                let complaint_image3 = functions.Get_Excluded_Path(uploadedFiles3[0].fd);
                if (complaint_image3) {
                    complaint_image.push(complaint_image3);
                }
            }

        });

        setTimeout(() => {
            Complaints.create({
                hotel_id: req.body.hotel_id,
                userId: req.body.userId,
                username: req.body.username,
                useremail: req.body.useremail,
                usercontact: req.body.usercontact,
                subject: req.body.subject,
                description: req.body.description,
                images: complaint_image,
                booking_id: req.body.booking_id,
                //new keys----------------------------------------------------------------
                hotel_name: HotelData.name,
                hotel_state: HotelData.state,
                hotel_city: HotelData.city,
            }).fetch().exec(function (err, result) {
                if (!result) {
                    return res.send({ responseCode: 201, msg: 'complaint not saved', err: err });
                } else {
                    return res.send({ responseCode: 200, msg: 'Your compaint/issue has been raised', data: result });
                }
            })
        }, 5000);
    },


    Get_Hotel_Complaints: async (req, res) => {
        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'hotel id not found' });
        }

        let complaintsData = await Complaints.find({ hotel_id: req.body.hotel_id }).sort('createdAt DESC');

        return res.send({ responseCode: 200, msg: 'complaint fetched', data: complaintsData });
    },

    Get_All_Complaints: async (req, res) => {

        let complaintsData = await Complaints.find({}).sort('createdAt DESC');

        return res.send({ responseCode: 200, msg: 'complaint fetched', data: complaintsData });
    },

    Set_Hotel_Commissions: async (req, res) => {

        let commissionData = await Hotel.update({  }).set({ commission: 18 });
        return res.send({ responseCode: 200, msg: 'commissionData fetched', data: commissionData });

    }



};

