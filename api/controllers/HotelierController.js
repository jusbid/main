var fs = require('fs');
var async = require('async');

module.exports = {

    Get_My_Hotel: async (req, res) => {

        if (!req.body.id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id' });
        }

        let HotelData = await Hotel.findOne({
            id: req.body.id
        });

        if (!HotelData) {
            return res.send({ responseCode: 201, msg: 'Hotel not found using this ID' });
        }

        let GetBDEName = await User.findOne({ select: ['userId', 'firstname', 'lastname', 'parent_bdm'] }).where({ userId: HotelData.bdeId });

        if (GetBDEName) {
            HotelData.bde_name = GetBDEName.firstname + ' ' + GetBDEName.lastname;

            let GetBDMname = await User.findOne({ select: ['userId', 'firstname', 'lastname'] }).where({ userId: GetBDEName.parent_bdm });

            if (GetBDMname) {
                HotelData.bdm_name = GetBDMname.firstname + ' ' + GetBDMname.lastname;
            }else{
                HotelData.bdm_name = "";
            }
        } else {
            HotelData.bde_name = ""; 
            HotelData.bdm_name = "";
        }

        let HotelImagesData = await HotelImages.find({ hotel_id: req.body.id }).sort('name ASC');

        let HotelRoomsData = await HotelRooms.find({ hotel_id: req.body.id }).sort('createdAt DESC');

        // deprecated get logo----------------------------------------------------------------------------
        let HotelLogo = await HotelImages.findOne({ hotel_id: req.body.id, name:'Logo' });
        //------------------------------------------------------------------------------------------------

        HotelData.hotel_images = HotelImagesData;

        HotelData.hotel_rooms = HotelRoomsData;

        HotelData.logo = HotelLogo;

        if (!HotelData) {
            return res.send({ responseCode: 201, msg: 'No hotel found using this id' });
        }
        else {
            return res.send({ responseCode: 200, data: HotelData });
        }

    },

    Get_hotel_logo: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id' });
        }

        let CheckLogo = await HotelImages.find({ hotel_id: req.body.hotel_id, name: "Logo" });

        if (CheckLogo.length > 1) {
            await HotelImages.destroy({ hotel_id: req.body.hotel_id, name: "Logo" });
            return res.send({ responseCode: 200, msg: 'Logo has been removed due to conflicted images, please add again' });
        }else{
            return res.send({ responseCode: 201, msg: '', data:CheckLogo[0] });
        }


    },


    Remove_FAQ: async (req, res) => {

        if (!req.body.faq_id) {
            return res.send({ responseCode: 201, msg: 'FAQ ID not found' });
        }

        let FAQRemoved = await faq.destroyOne({id:req.body.faq_id});

        if (!FAQRemoved) {
            return res.send({ responseCode: 201, msg: 'Error while removing FAQ' });
        }
        else {
            return res.send({ responseCode: 200, data: "FAQ Removed" });
        }

    },


    Save_FAQ: async (req, res) => {

        let Question = req.body.question;
        let Answer = req.body.answer;
        let hotel_id_req = req.body.hotel_id;

        if (!Question || !Answer || !hotel_id_req) {
            return res.send({ responseCode: 201, msg: 'please provide all keys to add FAQ' });
        }

        let FAQCreated = await faq.create({
            question: Question,
            answer: req.body.answer,
            hotel_id: hotel_id_req
        }).fetch();

        if (!FAQCreated) {
            return res.send({ responseCode: 201, msg: 'FAQ Added' });
        }
        else {
            return res.send({ responseCode: 200, data: FAQCreated });
        }

    },

    Update_FAQ: async (req, res) => {

        let Question = req.body.question;
        let Answer = req.body.answer;
        let hotel_id_req = req.body.hotel_id;
        let faq_id = req.body.faq_id;

        if (!Question || !Answer || !hotel_id_req || !faq_id) {
            return res.send({ responseCode: 201, msg: 'please provide all keys to update FAQ' });
        }

        let FAQCreated = await faq.update({  hotel_id: hotel_id_req, id:req.body.faq_id}).set({
            question: Question,
            answer: req.body.answer,
        }).fetch();

        if (!FAQCreated) {
            return res.send({ responseCode: 201, msg: 'FAQ Updated' });
        }
        else {
            return res.send({ responseCode: 200, data: FAQCreated });
        }

    },

    Get_Hotel_FAQ: async (req, res) => {

        let hotel_id_req = req.body.hotel_id;

        if (!hotel_id_req) {
            return res.send({ responseCode: 201, msg: 'please provide all keys to add FAQ' });
        }

        let FAQCreated = await faq.find({ hotel_id: hotel_id_req });

        if (!FAQCreated) {
            return res.send({ responseCode: 201, msg: 'FAQ Added' });
        }
        else {
            return res.send({ responseCode: 200, data: FAQCreated });
        }

    },


    Save_Hotel_Other_Info: async (req, res) => {

        let type = req.body.type;
        let content = req.body.content;
        let hotel_id_req = req.body.hotel_id;

        if (!type || !content || !hotel_id_req) {
            return res.send({ responseCode: 201, msg: 'please provide all keys to add hotel any info' });
        }

        // check if hotel other info exists one, if more than one remove both or one------------------------------------------------

        let Check = await HotelOther.find({
            hotel_id: hotel_id_req,
            type: type,
        });

        var DataSet = {}

        sails.log(Check.length, Check, 'Check.length');

        if (Check.length == 0) {
            DataSet = await HotelOther.create({
                type: type,
                content: req.body.content,
                hotel_id: hotel_id_req
            }).fetch();
        }

        
        else if(Check.length > 1){

            await HotelOther.destroy({
                hotel_id: hotel_id_req,
                type: type,
            });
            return res.send({ responseCode: 201, data: 'Old '+type+' has been removed due to conflict, please add it again' });

        }

        else {
            DataSet = await HotelOther.update({ hotel_id: hotel_id_req, type: type }).set({
                content: req.body.content
            }).fetch();
        }


        if (!DataSet) {
            return res.send({ responseCode: 201, msg: 'Hotel Info. not Added / updated' });
        }
        else {
            return res.send({ responseCode: 200, data: DataSet });
        }

    },


    Get_My_Hotel_Other_Details: async (req, res) => {

        if (!req.body.hotel_id) {
            return res.send({ responseCode: 201, msg: 'please provide all keys to get hotel info' });
        }

        let DataSet_Policy = await HotelOther.find({ hotel_id: req.body.hotel_id, type: 'Policy' });
        let DataSet_Terms = await HotelOther.find({ hotel_id: req.body.hotel_id, type: 'Terms' });
        let DataSet_Refund = await HotelOther.find({ hotel_id: req.body.hotel_id, type: 'Refund' });
        let DataSet_Notice = await HotelOther.find({ hotel_id: req.body.hotel_id, type: 'Notice' });

        if(DataSet_Policy.length > 1){
            await HotelOther.destroy({hotel_id: req.body.hotel_id, type: 'Policy'});
            //return res.send({ responseCode: 201, data: 'Privacy Policy has been removed due to conflict, please add it again' });
        }

        if(DataSet_Terms.length > 1){
            await HotelOther.destroy({hotel_id: req.body.hotel_id, type: 'Terms'});
            //return res.send({ responseCode: 201, data: 'Terms & Conditions has been removed due to conflict, please add it again' });
        }

        if(DataSet_Refund.length > 1){
            await HotelOther.destroy({hotel_id: req.body.hotel_id, type: 'Refund'});
           // return res.send({ responseCode: 201, data: 'Cancellation & Refund policy has been removed due to conflict, please add it again' });
        }

        if(DataSet_Notice.length > 1){
            await HotelOther.destroy({hotel_id: req.body.hotel_id, type: 'Notice'});
            //return res.send({ responseCode: 201, data: 'Notice has been removed due to conflict, please add it again' });
        }

        let DataSet_Policy_Obj = await HotelOther.findOne({ hotel_id: req.body.hotel_id, type: 'Policy' });
        let DataSet_Terms_Obj = await HotelOther.findOne({ hotel_id: req.body.hotel_id, type: 'Terms' });
        let DataSet_Refund_Obj = await HotelOther.findOne({ hotel_id: req.body.hotel_id, type: 'Refund' });
        let DataSet_Notice_Obj = await HotelOther.findOne({ hotel_id: req.body.hotel_id, type: 'Notice' });

        let ExportData = {
            policy: DataSet_Policy_Obj,
            terms: DataSet_Terms_Obj,
            refund: DataSet_Refund_Obj,
            notice:DataSet_Notice_Obj
        }

        if (!ExportData) {
            return res.send({ responseCode: 201, msg: 'Hotel Info. fetched' });
        }
        else {
            return res.send({ responseCode: 200, data: ExportData });
        }

    },


    Hotelier_Documents_Upload: async (req, res) => {

        if (!req.body.userId && !req.body.type) {
            return res.send({ responseCode: 201, msg: 'Provide userId & type to add an image' });
        }

        var FilePrefixPath = functions.Get_FileUpload_Path();

        if (!fs.existsSync('assets/images/documents' + FilePrefixPath)) { fs.mkdir('assets/images/documents' + FilePrefixPath, function (err, result) { }); }

        req.file('document').upload({
            dirname: require('path').resolve(sails.config.appPath, 'assets/images/documents' + FilePrefixPath)
        }, function (err, uploadedFiles1) {

            if (!uploadedFiles1) {
                return res.send({ responseCode: 201, msg: 'Please provide document file' });
            }

            if(uploadedFiles1.length == 0){
                return res.send({ responseCode: 201, msg: 'Document file not uploaded, please try again..' });
            }

            if (err) return res.serverError(err);

            image_link = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

            Documents.create({
                userId: req.body.userId,
                role: 5,
                path: image_link,
                type:req.body.type
            }).fetch().exec(function (err, result) {
                if (result) {
                    return res.send({ responseCode: 200, msg: 'Hotelier document file uploaded successfully', path: image_link });
                } else {
                    return res.send({ responseCode: 201, msg: 'error while saving document file, please try again..' , err:err});
                }
            })

        });

    },


    Get_My_Documents: async (req, res) => {

        if(!req.body.userId){
            return res.send({ responseCode: 201, msg: 'Please provide User ID' });
        }

        let MyDocs = await Documents.find({userId:req.body.userId});

        if (MyDocs) {
            return res.send({ responseCode: 200, msg: 'document fetched successfully', data: MyDocs });
        } else {
            return res.send({ responseCode: 201, msg: 'No documents found' , data:[]});
        }

    },


    Remove_My_Documents: async (req, res) => {

        if(!req.body.userId  && !req.body.document_id){
            return res.send({ responseCode: 201, msg: 'Please provide User ID' });
        }

        let MyDocs = await Documents.destroyOne({userId:req.body.userId, id:req.body.document_id});

        if (MyDocs) {
            return res.send({ responseCode: 200, msg: 'document removed successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'No documents found'});
        }

    },

    Hotelier_Dashboard_Counts: async (req, res) => {

        if(!req.body.hotel_id){
            return res.send({ responseCode: 201, msg: 'Please provide required parameters' });
        }

        let hotel_id = req.body.hotel_id;
        let hoteldata = await Hotel.findOne({ select:['id', 'rating'] }).where({id:hotel_id});
        let IssuesCount = await Complaints.count({hotel_id:req.body.hotel_id});
        All_Hotel_Booking = await Bookings.find({ hotel_id: hotel_id }).sort('createdAt DESC');

        var ActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Upcoming"; });
        var PastBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Past"; });

        var InActiveBookings = All_Hotel_Booking.filter(function (itm) { return itm.status == "Cancelled" || itm.status == "Refund_Init" || itm.status == "Refund_Paid" });
        var TotalBookingCost = 0;
        var avg_booking = 0;
        var CurrentBookings =[];
        async.forEachOf(All_Hotel_Booking, function (value, i, callback) {
            if(value.price){
                TotalBookingCost = TotalBookingCost + parseInt(value.price);
            }
            let ArrivalDate = new Date(value.arrival_date);
            var todaysDate = new Date();
            if (ArrivalDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
                CurrentBookings.push(value);
            }

            if(All_Hotel_Booking.length == i+1){
                avg_booking = TotalBookingCost / All_Hotel_Booking.length;
            }

            callback();

        }, function (err) {

            if(err){sails.log(err);}

            let Counts = {
                upcoming: ActiveBookings.length,
                past: PastBookings.length,
                current:CurrentBookings.length,
                cancelled: InActiveBookings.length,
                revenue: Math.floor(TotalBookingCost),
                avg_booking:Math.floor(avg_booking),
                rating:hoteldata.rating,
                queries:12,
                complaints:IssuesCount
    
            };
    
            if (Counts) {
                return res.send({ responseCode: 200, msg: 'dashboard count fetched', data:Counts });
            }

        });
    },


    Hotelier_Cred_Resend : async (req, res) => {

            let HotEmail = req.body.email;

            if(!HotEmail){
                return res.send({ responseCode: 201, msg: 'Please provide registered hotelier email address' });
            }

            let Hotelier = await User.find({ role:5, email:req.body.email });
            if(Hotelier.length==0){
                return res.send({ responseCode: 201, msg: 'Email not registered with us to use hotelier portal' });
            }
            // send an email to hotel-------------------------------------------------------------------------------------------

            async.forEachOf(Hotelier, function (value, i, callback) {

                sails.log(value, 'hotelierdata-')
                mailer.HotelierWelcome(value, '');
                callback();
            }, function (err) {
              if(err)  sails.log(err);
                return res.send({ responseCode: 200, msg: 'Email sent to your registered email address' });

            });
    },


    Update_Group_Hotel_Status: async (req, res) => {

        if (!req.body.hotel_id && !req.body.status) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id & status' });
        }

        var HotelCheckStatus = await Hotel.findOne({ id: req.body.hotel_id, name: req.body.name });
        sails.log(HotelCheckStatus, 'HotelCheckStatus');
        var HotelPrimaryMail = HotelCheckStatus.email;
        if (!HotelPrimaryMail) {
            return res.send({ responseCode: 201, msg: 'Please update hotel primary email' });
        }

        var HotelData = await Hotel.updateOne({ id: req.body.hotel_id, name: req.body.name }).set({ status: req.body.status, statusNote: req.body.statusNote });

        let UserCounts = await User.count();
        let randomString = (Math.random() + 1).toString(36).substring(8);
        let save_userid = HotelCheckStatus.name.substring(0, 3) + '' + randomString + (parseInt(UserCounts) + 1);

        //----------set password same as other hotels of this group using respected common keys--------------------------------------------------------
        let save_password = HotelPrimaryMail.substring(0, 5)+''+'jsgp21';

        // check if hotelier user is created in system--------------------------------------------------------------------------
        var FindHotelier = await User.findOne({}).where({ hotel_id: req.body.hotel_id, role: 5 });

        if(save_userid){ save_userid = save_userid.replace(/ /g,"j");}

        if(save_password){ save_password = save_password.replace(/ /g,"j");}

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




    Create_Hotel_Room_New: async (req, res) => {

        var FilePrefixPath = functions.Get_FileUpload_Path();

        if (!req.body.hotel_id || !req.body.price || !req.body.capacity) {
            return res.send({ responseCode: 201, msg: 'Please provide all params to create a room' });
        }

        let CheckRoomForHotel = await HotelRooms.findOne({ hotel_id: req.body.hotel_id, room_type: req.body.room_type });

        if (CheckRoomForHotel) {
            return res.send({ responseCode: 201, msg: 'Room with this name already exist for your hotel' });
        }

        let RoomImage_64 = req.body.room_64;
        var base64Data = RoomImage_64.split(",")[1];
        //create directory-------------------------------------------------------------------------------------------------------------------------------------
        if (!fs.existsSync('assets/images/room' + FilePrefixPath)) { fs.mkdir('assets/images/room' + FilePrefixPath,  {recursive: true}, function (err, result) { sails.log(err, result, 'createdire res'); }); }
        if (!fs.existsSync('.tmp/public/images/room' + FilePrefixPath)) { fs.mkdir('.tmp/public/images/room' + FilePrefixPath, {recursive: true}, function (err, result) { }); }
        var checkformat = RoomImage_64.includes("png;");
        var format = "jpeg";
        if(checkformat){format = "png";}

        var filename = Math.random().toString(36).slice(2)+'roomimg.'+format;
        var TmpFinalPath = '.tmp/public/images/room' + FilePrefixPath + filename;
        var FinalPath = 'assets/images/room' + FilePrefixPath + filename;
        var FinalPathSave = '/images/room' + FilePrefixPath + filename;
        let room_image_link = FinalPathSave;
        
        let Min_Path = functions.Get_MinPath_New(room_image_link);
        sails.log(Min_Path, "Min_Path");
        require("fs").writeFile(FinalPath, base64Data, 'base64', function(err) {
         if(err) console.log(err);
            functions.GenerateMinifiedImg_New(room_image_link, 50);
            // copyfiles to tmp--------------------------------------------

            setTimeout(() => {
                //-----------------copy assets to tmp folder---------------------------------------------
            fs.copyFile(FinalPath, TmpFinalPath, (err) => { if (err) { throw err; } });
            fs.copyFile('assets'+Min_Path, '.tmp/public'+Min_Path, (err) => { if (err) { throw err; } });
            }, 2000);

          let SaveData = {
            hotel_id: req.body.hotel_id,
            room_views: req.body.room_view,
            room_type: req.body.room_type,
            room_amenities: req.body.room_amenities,
            price: req.body.price,
            quantity: req.body.quantity,
            capacity: req.body.capacity,
            size: req.body.size,
            bed_size: req.body.bed_size,
            description: req.body.description,
            image: FinalPathSave,
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



    Update_Hotel_Room_New: async (req, res) => {

        var FilePrefixPath = functions.Get_FileUpload_Path();

        if (!req.body.hotel_id || !req.body.price || !req.body.capacity || !req.body.room_id) {
            return res.send({ responseCode: 201, msg: 'Please provide all params to update a room' });
        }

        if(req.body.room_64){

            let RoomImage_64 = req.body.room_64;
            var base64Data = RoomImage_64.split(",")[1];
            //create directory-------------------------------------------------------------------------------------------------------------------------------------
            if (!fs.existsSync('assets/images/room' + FilePrefixPath)) { fs.mkdir('assets/images/room' + FilePrefixPath,  {recursive: true}, function (err, result) { sails.log(err, result, 'createdire res'); }); }
            if (!fs.existsSync('.tmp/public/images/room' + FilePrefixPath)) { fs.mkdir('.tmp/public/images/room' + FilePrefixPath, {recursive: true}, function (err, result) { }); }
            var checkformat = RoomImage_64.includes("png;");
            var format = "jpeg";
            if(checkformat){format = "png";}
    
            var filename = Math.random().toString(36).slice(2)+'roomimg.'+format;
            var TmpFinalPath = '.tmp/public/images/room' + FilePrefixPath + filename;
            var FinalPath = 'assets/images/room' + FilePrefixPath + filename;
            var FinalPathSave = '/images/room' + FilePrefixPath + filename;
            let room_image_link = FinalPathSave;
            
            let Min_Path = functions.Get_MinPath_New(room_image_link);
            sails.log(Min_Path, "Min_Path");
            require("fs").writeFile(FinalPath, base64Data, 'base64', function(err) {
             if(err) console.log(err);
                functions.GenerateMinifiedImg_New(room_image_link, 50);
                // copyfiles to tmp--------------------------------------------
    
                setTimeout(() => {
                    //-----------------copy assets to tmp folder---------------------------------------------
                fs.copyFile(FinalPath, TmpFinalPath, (err) => { if (err) { throw err; } });
                fs.copyFile('assets'+Min_Path, '.tmp/public'+Min_Path, (err) => { if (err) { throw err; } });
                }, 2000);

          let SaveData = {
            hotel_id: req.body.hotel_id,
            room_views: req.body.room_view,
            room_type: req.body.room_type,
            room_amenities: req.body.room_amenities,
            price: req.body.price,
            quantity: req.body.quantity,
            capacity: req.body.capacity,
            size: req.body.size,
            bed_size: req.body.bed_size,
            description: req.body.description,
            image: FinalPathSave,
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


    }else{


        let SaveData = {
            hotel_id: req.body.hotel_id,
            room_views: req.body.room_view,
            room_type: req.body.room_type,
            room_amenities: req.body.room_amenities,
            price: req.body.price,
            quantity: req.body.quantity,
            capacity: req.body.capacity,
            size: req.body.size,
            bed_size: req.body.bed_size,
            description: req.body.description,
        }

      let UpdatedRoom = await HotelRooms.updateOne({ id: req.body.room_id }).set(SaveData);

            if (!UpdatedRoom) {
                return res.send({ responseCode: 201, msg: 'Error occured while updating hotel rooms' });
            } else {
                return res.send({ responseCode: 200, msg: 'Hotel Room updated' });
            }

    }

    },


    Unlink_Primary_Image: async (req, res) => {

        if (!req.body.hotel_id || !req.body.image_id) {
            return res.send({ responseCode: 201, msg: 'Please provide hotel id && image id' });
        }

        let Update_Primary_Image = await Hotel.updateOne({ id: req.body.hotel_id }).set({ image: "" });

        if (Update_Primary_Image) {
            return res.send({ responseCode: 200, msg: 'Hotel primary image unlinked successfully' });
        } else {
            return res.send({ responseCode: 201, msg: 'Unable to unlink hotel primary image' });
        }

    },





}