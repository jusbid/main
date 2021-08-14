var async = require('async');
var fs = require('fs');
var os = require('os');




module.exports = {

    Sample_SMS: async (req, res) => {

        functions2.Test_Single_SMS();
        return res.send({ responseCode: 202, msg: 'SMS Service Called' });
    },

    Dump_Backup_DB: async (req, res) => {

        functions.Backup_MongoDB();
        return res.send({ responseCode: 202, msg: 'Backup Service Called..' });
    },

    HomePage: async (req, res) => {
        let osData = {};

        osData.freemem = os.freemem();
        osData.totalmem = os.totalmem();
        osData.type = os.type();
        osData.version = '1';
        osData.platform = os.platform();
        osData.arch = os.arch();
        osData.CPU = os.cpus();
        sails.log(osData);
        return res.view('pages/homepage', {
            osData: osData
        });
    },

    Update_user_field: async (req, res) => {

        var UpdatedUser = await User.update({}).set({lastSeenAt:0});

        if (UpdatedUser) {
            return res.send({ responseCode: 200, msg: 'UpdatedUser data updated', data: UpdatedUser });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch UpdatedUser' });
        }

    },

    Update_room_field: async (req, res) => {

        var UpdatedUser = await RoomImages.update({}).set({is_active:true});

        if (UpdatedUser) {
            return res.send({ responseCode: 200, msg: 'Updatedroom data updated', data: UpdatedUser });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch Updated Room' });
        }

    },

    Update_Addonfield: async (req, res) => {

        var Addons = await AddOn.find();

        sails.log(Addons.length, 'addn');

        async.forEachOf(Addons, function (value, i, callback) {

            let priceparsed = parseInt(value.price);

            AddOn.updateOne({id:value.id}).set({price:priceparsed}).exec(function (err, HotelUpdate) { 
                callback();
           });

           

        }, function (err) {
            if (Addons) {
                return res.send({ responseCode: 200, msg: 'Addons data updated'});
            } else {
                return res.send({ responseCode: 201, msg: 'Unable to Update Addons' });
            }
        });
    },

    Update_hotel_field: async (req, res) => {

        var UpdatedHotelImages = await HotelImages.update({}).set({is_active:true});

        if (UpdatedHotelImages) {
            return res.send({ responseCode: 200, msg: 'UpdatedHotelImages data updated'});
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to Update HotelImages' });
        }

    },

    Update_hotel_createdate: async (req, res) => {

        var Hotels = await Hotel.find();   

        async.forEachOf(Hotels, function (value, i, callback) {

            let CreateDate = value.createdAt;

            let ParsedCD = new Date(CreateDate);

            Hotel.update({id:value.id}).set({createdAt:ParsedCD}).exec(function (err, HotelUpdate) { 

            //sails.log(ParsedCD, 'ParsedCD');

           });

            
            callback();


        }, function (err) {
            if (Hotels) {
                return res.send({ responseCode: 200, msg: 'Hotels data updated'});
            } else {
                return res.send({ responseCode: 201, msg: 'Unable to Update Hotels' });
            }
        });

       

    },


    Update_hotelier_id: async (req, res) => {

        var Hotels = await Hotel.find();   

        async.forEachOf(Hotels, function (value, i, callback) {

            let hotel_id_org = value.id;
            let hotelier_id = value.hotelierId;

            if(hotel_id_org && hotelier_id){
                User.findOne({userId:hotelier_id}).exec(function (err, HotelierData) { 
                 //   sails.log(HotelierData.userId, 'hotelierid');
                    if(HotelierData){
                        if(HotelierData.hotel_id != hotel_id_org){
                            sails.log('id is not same', hotel_id_org , hotelier_id, 'name->', value.name);
                            User.updateOne({userId:hotelier_id}).set({ hotel_id: hotel_id_org}).exec(function (err, HotelierUpdated) { 
                                callback(); 
                            }); 
                        }else{
                            callback(); 
                        }

                    }else{
                       // sails.log('no need to update->', value.name);
                        callback(); 
                    }
                   });
            }else{
                callback(); 
            }
        }, function (err) {
            if (Hotels) {
                return res.send({ responseCode: 200, msg: 'Hotelier data updated'});
            } else {
                return res.send({ responseCode: 201, msg: 'Unable to Update Hotelier' });
            }
        });

       

    },


    GetAmenities: async (req, res) => {

        var AmenitiesData = await Amenities.find({});

        if (AmenitiesData) {
            return res.send({ responseCode: 200, msg: 'Amenity data fetched', data: AmenitiesData });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch amenities' });
        }

    },

    Manage_Status: async (req, res) => {

        let UpdateOn = req.body.updateOn;
        let elementId = req.body.elementId;
        let status_set = req.body.status;

        if (!UpdateOn || !elementId) {
            return res.send({ responseCode: 201, msg: 'Please provide all required parameters' });
        }
        var elementUpdateObj = [];

        if (UpdateOn == 'AddOn') {
            elementUpdateObj = await AddOn.updateOne({ id: elementId }).set({ is_active: status_set });
        }
        else if (UpdateOn == 'HotelImage') {
            elementUpdateObj = await HotelImages.updateOne({ id: elementId }).set({ is_active: status_set });
        }
        else if (UpdateOn == 'HotelRoom') {
            elementUpdateObj = await HotelRooms.updateOne({ id: elementId }).set({ is_active: status_set });
        }
        else {
            return res.send({ responseCode: 201, msg: 'Status could not be changed' });
        }

        if (elementUpdateObj) {
            return res.send({ responseCode: 200, msg: 'Status Updated', data: elementUpdateObj });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to update status' });
        }

    },

    GetAmenities_ById: async (req, res) => {
        var AmenitiesData = await Amenities.find({});
        if (!req.body.hotel_id) {

            AmenitiesData.forEach(function (value, i) {
                AmenitiesData[i].is_selected = false;
            });


            if (AmenitiesData) {
                return res.send({ responseCode: 200, msg: 'Amenity data fetched', data: AmenitiesData });
            } else {
                return res.send({ responseCode: 201, msg: 'Unable to fetch amenities' });
            }

        } else {

            //-------check mark hotel selected amenities----------------------------------

            let HotelData = await Hotel.findOne({ id: req.body.hotel_id });
            var HotelSelectedAmenities;
            if (!HotelData) {
                HotelSelectedAmenities = [];
            } else {
                var HotelSelectedAmenities = HotelData.hotel_amenities;
            }
            async.forEachOf(AmenitiesData, function (value, i, callback) {

                if (HotelSelectedAmenities.includes(value.id)) {
                    AmenitiesData[i].is_selected = true;
                } else {
                    AmenitiesData[i].is_selected = false;
                }
                callback();


            }, function (err) {

                if (err) { sails.log(err); }
                if (AmenitiesData) {
                    return res.send({ responseCode: 200, msg: 'Amenity data fetched', data: AmenitiesData });
                } else {
                    return res.send({ responseCode: 201, msg: 'Unable to fetch amenities' });
                }

            });

        }

    },

    CreateAmenity: async (req, res) => {

        if (!req.body.name) {
            return res.send({ responseCode: 201, msg: 'Please provide both name & icon' });
        }

        var find_check = await Amenities.findOne({ name: req.body.name });

        if (find_check) {
            return res.send({ responseCode: 201, msg: 'Amenity with this name exists already' });
        }

        var is_custom_icon = false;

        var icon_var = '';

        req.file('custom_icon').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/icons/amenities/')
        }, function (err, uploadedFiles) {
            if (err) return res.serverError(err);

            if (!uploadedFiles[0].fd) {
                return res.send({ responseCode: 201, msg: 'Icon File Not Uploaded' });
            }

            icon_var = functions.Get_Excluded_Path(uploadedFiles[0].fd);

            Amenities.create({ name: req.body.name, icon: icon_var, is_custom: is_custom_icon }).exec(function (err, result) {
                return res.send({ responseCode: 200, msg: 'Amenity Created Successfully' });
            })
        });

    },

    Update_Amenity: async (req, res) => {

        if (!req.body.name && !req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide both name & id' });
        }

        var AmData = await Amenities.findOne({ id: req.body.id });
        let icon_var = AmData.icon;

        req.file('custom_icon').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/icons/amenities/')
        }, function (err, uploadedFiles) {
            if (err) return res.serverError(err);

            if (uploadedFiles.length != 0) {
                if (!uploadedFiles[0].fd) { return res.send({ responseCode: 201, msg: 'Icon File Not Uploaded' }); }
                icon_var = functions.Get_Excluded_Path(uploadedFiles[0].fd);
            }

            Amenities.updateOne({ id: req.body.id }).set({ name: req.body.name, icon: icon_var, is_custom: true }).exec(function (err, result) {
                return res.send({ responseCode: 200, msg: 'Amenity Updated Successfully' });
            })
        });

    },

    Update_Room_Amenity: async (req, res) => {

        if (!req.body.name && !req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide both name & id' });
        }

        var AmData = await RoomAmenities.findOne({ id: req.body.id });
        let icon_var = AmData.icon;

        req.file('custom_icon').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/icons/amenities/')
        }, function (err, uploadedFiles) {
            if (err) return res.serverError(err);

            if (uploadedFiles.length != 0) {
                if (!uploadedFiles[0].fd) { return res.send({ responseCode: 201, msg: 'Icon File Not Uploaded' }); }
                icon_var = functions.Get_Excluded_Path(uploadedFiles[0].fd);
            }

            RoomAmenities.updateOne({ id: req.body.id }).set({ name: req.body.name, icon: icon_var, is_custom: true }).exec(function (err, result) {
                return res.send({ responseCode: 200, msg: 'Room Amenity Updated Successfully' });
            })
        });

    },


    RemoveAmenity: async (req, res) => {

        let Check = await Amenities.destroyOne({ id: req.body.id });

        if (Check) {
            return res.send({ responseCode: 200, msg: 'Amenity removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Amenity not removed' });
        }

    },

    // fontawesome[var]



    // Facilities API's-------------------------------------------------------------------------------------

    GetFacilities: async (req, res) => {

        var FacilitiesData = await Facilities.find({});

        if (FacilitiesData) {
            return res.send({ responseCode: 200, msg: 'Facilities data fetched', data: FacilitiesData });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch facilities' });
        }

    },

    CreateFacility: async (req, res) => {

        if (!req.body.name) {
            return res.send({ responseCode: 201, msg: 'Please provide both name & icon' });
        }

        var find_check = await Facilities.findOne({ name: req.body.name });

        if (find_check) {
            return res.send({ responseCode: 201, msg: 'Facility with this name exists already' });
        }

        var icon_var = '';


        req.file('custom_icon').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/icons/facilities/')
        }, function (err, uploadedFiles) {
            if (err) return res.serverError(err);
            icon_var = functions.Get_Excluded_Path(uploadedFiles[0].fd);

            Facilities.create({ name: req.body.name, icon: icon_var, is_custom: true }).exec(function (err, result) {
                return res.send({ responseCode: 200, msg: 'Facility Created Successfully' });
            });
        });
    },

    RemoveFacility: async (req, res) => {

        await Facilities.destroyOne({ id: req.body.id });

        return res.send({ responseCode: 200, msg: 'Facilities removed successfully' });

    },

    Get_States: async (req, res) => {
        return res.send({ responseCode: 200, msg: 'States Fetched', data: functions.Get_States() });
    },


    Get_Cities: async (req, res) => {
        return res.send({ responseCode: 200, msg: 'Cities Fetched', data: functions.Get_Cities() });
    },

    Get_RoomCategories: async (req, res) => {

        var RoomCategoryData = await RoomCategory.find();

        return res.send({ responseCode: 200, data: RoomCategoryData });

    },

    Save_RoomCategory: async (req, res) => {

        if (!req.body.name) {
            return res.send({ responseCode: 201, msg: 'Please provide room category name' });
        }

        let CheckName = await RoomCategory.findOne({ name: req.body.name });

        if (CheckName) {
            return res.send({ responseCode: 201, msg: "Room category already exists by this name" });
        }


        var RoomCategoryData = await RoomCategory.create({
            name: req.body.name,
            icon: req.body.icon,
            capacity: req.body.capacity
        }).fetch();

        return res.send({ responseCode: 200, data: RoomCategoryData, msg: "Room category saved successfully" });
    },


    Get_RoomCategoryList: async (req, res) => {


        let RoomCategoryData = await RoomCategory.find({});

        if (RoomCategoryData.length == 0) {
            return res.send({ responseCode: 201, msg: "Room category data not found" });
        } else {
            return res.send({ responseCode: 200, msg: "Room category data fetched", data: RoomCategoryData });
        }


    },

    Remove_RoomCategory: async (req, res) => {


        let RoomCategoryData = await RoomCategory.destroyOne({ id: req.body.id });
        return res.send({ responseCode: 200, msg: "Room category removed" });



    },


    Save_RoomAmenities: async (req, res) => {

        if (!req.body.name) {
            return res.send({ responseCode: 201, msg: 'Please provide room category name & icon' });
        }

        let CheckName = await RoomAmenities.findOne({ name: req.body.name });

        if (CheckName) {
            return res.send({ responseCode: 201, msg: "Room amenity already exists with this name" });
        }


        req.file('custom_icon').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/icons/amenities/')
        }, function (err, uploadedFiles) {
            if (err) return res.serverError(err);
            icon_var = functions.Get_Excluded_Path(uploadedFiles[0].fd);


            var RoomCategoryData = RoomAmenities.create({
                name: req.body.name,
                icon: icon_var,
            }).exec(function (err, result) {
                return res.send({ responseCode: 200, data: RoomCategoryData, msg: "Room Amenity Saved Successfully" });

            });

        });

    },


    Get_RoomAmenitiesList: async (req, res) => {

        let RoomAmenitiesData = await RoomAmenities.find({});

        if (RoomAmenitiesData.length == 0) {
            return res.send({ responseCode: 201, msg: "Room category data not found" });
        } else {
            return res.send({ responseCode: 200, msg: "Room category data fetched", data: RoomAmenitiesData });
        }

    },

    Remove_RoomAmenities: async (req, res) => {

        let RoomCategoryData = await RoomAmenities.destroyOne({ id: req.body.id });
        return res.send({ responseCode: 200, msg: "Room category removed" });

    },




    Get_HotelCategories: async (req, res) => {
        return res.send({ responseCode: 200, msg: "Hotel Categories Fetched", data: functions.Get_HotelCategories_ARR(), ratings: ["Budget Hotel", "1 Star", "2 Star", "3 Star", "4 Star", "5 Star"] });
    },

    Get_HotelViews: async (req, res) => {
        return res.send({ responseCode: 200, msg: "Hotel Categories Fetched", data: functions.HotelViews() });
    },

    Get_RoomViews: async (req, res) => {
        return res.send({ responseCode: 200, msg: "Hotel Categories Fetched", data: functions.RoomViews() });
    },




    //-----------------Notifications-------------------------------------------------------------------------------


    Get_AdminNotification: async (req, res) => {

        let NotificationData = await Notifications.find({ role: 1 }).sort('createdAt DESC');
        if (NotificationData) {
            return res.send({ responseCode: 200, msg: 'Notification data fetched', data: NotificationData });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch amenities' });
        }

    },


    Get_BDMAppNotifications: async (req, res) => {

        let BDMNotifications = await Notifications.find().where({ userId: req.body.userId, is_active: true }).sort('createdAt DESC');

        if (BDMNotifications.length != 0) {
            return res.send({ responseCode: 200, data: BDMNotifications, msg: 'Notifications for BDM Fetched' });

        } else {

            return res.send({ responseCode: 201, msg: 'Notifications Not Found' });
        }


    },

    Get_BDEAppNotifications: async (req, res) => {

        let BDMNotifications = await Notifications.find().where({ userId: req.body.userId, is_active: true }).sort('createdAt DESC');

        if (BDMNotifications.length != 0) {
            return res.send({ responseCode: 200, data: BDMNotifications, msg: 'Notifications for BDM Fetched' });

        } else {

            return res.send({ responseCode: 201, msg: 'Notifications Not Found' });
        }

    },

    Get_HotelierNotifications: async (req, res) => {

        if (!req.body.userId) {
            return res.send({ responseCode: 201, msg: 'Notifications Not Found' });
        }

        let BDMNotifications = await Notifications.find({ userId: req.body.userId, is_active: true }).sort('createdAt DESC');
        if (BDMNotifications.length != 0) {
            return res.send({ responseCode: 200, data: BDMNotifications, msg: 'Notifications for Hotelier Fetched' });
        } else {
            return res.send({ responseCode: 201, data: [], msg: 'Notifications Not Found' });
        }

    },

    Get_FrontUserNotifications: async (req, res) => {

        if(!req.body.userId){
            return res.send({ responseCode: 201, data: [], msg: 'UserId not found to fetch notifications' });
        }

        sails.log(req.body.userId, 'req.body.userId-------------------------------notifications');

        let NotificationsData = await Notifications.find({}).where({ userId: req.body.userId, is_active: true }).sort('createdAt DESC');
        if (NotificationsData.length != 0) {
            return res.send({ responseCode: 200, data: NotificationsData, msg: 'Notifications for User Fetched' });
        } else {
            return res.send({ responseCode: 201, data: [], msg: 'Notifications Not Found' });
        }

    },

    Get_Settings: async (req, res) => {

        let GetSettings = await Settings.find({});

        if (GetSettings) {
            return res.send({ responseCode: 200, data: GetSettings, msg: 'Setting Fetched' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Fetched' });
        }

    },

    Get_Zones: async (req, res) => {

        let GetSettings = await Settings.find({ type: { startsWith: 'Zone' } });

        if (GetSettings) {
            return res.send({ responseCode: 200, data: GetSettings, msg: 'Setting Fetched' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Fetched' });
        }

    },

    Get_Setting_ByType: async (req, res) => {

        let GetSettings = await Settings.findOne({
            type: req.body.type
        });

        if (GetSettings) {
            return res.send({ responseCode: 200, data: GetSettings, msg: 'Setting Fetched' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Fetched' });
        }

    },


    Remove_Setting: async (req, res) => {

        if (!req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide required parameters' });
        }

        let GetSettings = await Settings.destroyOne({
            id: req.body.id
        });

        if (GetSettings) {
            return res.send({ responseCode: 200, data: GetSettings, msg: 'Setting Removed' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Removed' });
        }

    },


    Add_Settings: async (req, res) => {

        let Check = await Settings.findOne({ type: req.body.type });

        if (Check) {
            return res.send({ responseCode: 201, msg: 'Settings with this type / name already exists' });
        }

        let AddSettings = await Settings.create({
            type: req.body.type,
            data_string: req.body.data_string,
            data_boolean: req.body.data_boolean,
            data_json: req.body.data_json,
            data_number: req.body.data_number
        }).fetch();

        if (AddSettings) {
            return res.send({ responseCode: 200, data: AddSettings, msg: 'New Setting Saved' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Saved' });
        }

    },


    Update_Settings: async (req, res) => {

        let UpdateSettings = await Settings.updateOne({ id: req.body.id }).set({
            type: req.body.type,
            data_string: req.body.data_string,
            data_boolean: req.body.data_boolean,
            data_json: req.body.data_json,
            data_number: req.body.data_number
        })

        if (UpdateSettings) {
            return res.send({ responseCode: 200, data: UpdateSettings, msg: 'Updated Setting Saved' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Updated' });
        }

    },


    Upload_Image: async (req, res) => {

        var FilePrefixPath = functions.Get_FileUpload_Path();

        if (!fs.existsSync('assets/images/other' + FilePrefixPath)) { fs.mkdir('assets/images/other' + FilePrefixPath, function (err, result) { }); }

        req.file('image').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/other' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (uploadedFiles1.length == 0) {
                return res.send({ responseCode: 201, msg: 'Please provide image file' });
            }

            if (err) return res.serverError(err);

            let image_path = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            return res.send({ responseCode: 200, path: image_path, msg: 'Uploaded' });
        });

    },

    Set_Banner: async (req, res) => {

        if (!req.body.id) { return res.send({ responseCode: 201, msg: 'Banner Update Data Found' }); }

        let Banner = await Settings.findOne({ type: "FrontBanner" });
        var UpdateSettings
        if (Banner) {
            UpdateSettings = await Settings.updateOne({ id: req.body.id }).set({
                type: req.body.type,
                data_string: req.body.data_string,
            })
        } else {
            UpdateSettings = await Settings.create({
                type: req.body.type,
                data_string: req.body.data_string,
            }).fetch();
        }


        if (UpdateSettings) {
            return res.send({ responseCode: 200, data: UpdateSettings, msg: 'Updated Setting Saved' });
        } else {
            return res.send({ responseCode: 201, msg: 'Setting Not Updated' });
        }

    },


    Save_Query: async (req, res) => {

        let userId = req.body.userId;
        let email = req.body.email;
        let mobile = req.body.mobile;
        let subject = req.body.subject;
        let content = req.body.content;
        let startdate = req.body.startdate;
        let enddate = req.body.enddate;
        let persons = req.body.persons;

        if (!content || !mobile) {
            return res.send({ responseCode: 201, msg: 'Please provide all required information to submit your query' });
        }

        let QueryData = await Queries.create({

            userId: userId,
            email: email,
            mobile: mobile,
            subject: subject,
            content: content,
            startdate: startdate,
            enddate: enddate,
            persons: persons

        }).fetch();

        if (QueryData) {
            return res.send({ responseCode: 200, data: QueryData, msg: 'Your query has been saved successfully, we will contact you soon..' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to save your query' });
        }

    },


    Get_Queries: async (req, res) => {

        let QueryData = await Queries.find({}).sort('createdAt DESC');

        if (QueryData) {
            return res.send({ responseCode: 200, data: QueryData, });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch queries' });
        }


    },

    Get_Filter_Cities: async (req, res) => {
        let SettingsData = await Settings.findOne({ type: "FilterCities" });

        if (SettingsData) {
            return res.send({ responseCode: 200, data: SettingsData, });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to fetch filter cities' });
        }
    },

    Notification_By_Role: async (req, res) => {

        let Subject = req.body.subject;
        let Message = req.body.message;
        let roleId = req.body.roleId;

        NotificationsFunctions.SendPush_UserType(Subject, Message, roleId);

        return res.send({ responseCode: 200, msg: 'Sending messages to all users' });

    },

    Notification_All: async (req, res) => {

        let Subject = req.body.subject;
        let Message = req.body.message;

        NotificationsFunctions.SendPush_All(Subject, Message);

        return res.send({ responseCode: 200, msg: 'Sending messages to all users' });

    },

    //------------------Temp----------------------------------------

    SaveTest_Notifications: async (req, res) => {

        NotificationsFunctions.CreateUserNotification("subject", "message", 2, "type", "BhWa3");
        return res.send({ responseCode: 200 });

    },

    Mark_Read_Notifications: async (req, res) => {

        let NotificationId = req.body.notification_id;
        if (!NotificationId) {
            return res.send({ responseCode: 201, msg: 'Notification not found using this ID' });
        } else {
            await Notifications.updateOne({ id: NotificationId }).set({ is_active: false });
            return res.send({ responseCode: 200, msg: 'Notification marked as read successfully' });
        }

    },




};

