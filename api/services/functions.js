var Jimp = require('jimp');
var async = require('async');

var dbUri = "mongodb://localhost:27017/jusbid";
var basePath = "./backup";
var Backup = require("backup-mongodb");


module.exports.Get_FileUpload_Path = function () {
   var today = new Date();
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0');
   var yyyy = today.getFullYear();
   today = '/' + yyyy + '/' + mm + '/' + dd + '/';
   return today;
};


module.exports.Set_Primary_Image = function (hotel_id, imagePath, Type) {

   if (hotel_id && imagePath && Type == 'Front') {
      Hotel.update({ id: hotel_id }).set({ image: imagePath }).exec(function (err, HotelDataUp) { });
   }

};



module.exports.Get_DateSeq = function () {

   var today = new Date();
   var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0');
   var Getyear = String(today.getFullYear());
   var yy = Getyear.substring(2, 4);

   today = yy + '' + mm + '' + dd;
   return today;

};


module.exports.Get_Excluded_Path = function (FilePath) {

   var Temp_FilePath = FilePath.split('assets')[1];
   var Temp_FilePath1 = replaceAll(Temp_FilePath, '\\', '/')
   return Temp_FilePath1;

};


module.exports.GenerateMinifiedImg = function (ImagePath, Quality) {

   Jimp.read('assets' + ImagePath)
      .then(ReadImg => {
         sails.log(ReadImg.getWidth());
         var Img_Width = ReadImg.getWidth();
         var Img_Heigth = ReadImg.getHeight();

         if (Img_Width > 700) {
            var Get_Width = (Img_Width / 100) * 50;
            var Get_Height = (Img_Heigth / 100) * 50;
         } else if (Img_Width > 500) {
            var Get_Width = (Img_Width / 100) * 40;
            var Get_Height = (Img_Heigth / 100) * 40;
         } else {
            var Get_Width = Img_Width;
            var Get_Height = Img_Heigth;
         }

         var ExportPath = this.Get_MinPath(ImagePath);
         return ReadImg.resize(Get_Width, Get_Height).quality(60).write('assets' + ExportPath);
      })
      .catch(err => {
         sails.log(err);
      });
}


module.exports.Get_MinPath = function (ImagePath) {
   var ExportExtract = ImagePath.split('.');
   return ExportPath = ExportExtract[0] + '_min' + '.jpg';
}


function replaceAll(string, search, replace) {
   return string.split(search).join(replace);
}


module.exports.Get_Date_Diff = function (startdate, enddate) {

   var date1 = new Date(startdate);
   var date2 = new Date(enddate);
   var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
   return parseInt(diffDays);

}

module.exports.Get_Date_Diff = function (startdate, enddate) {

   var date1 = new Date(startdate);
   var date2 = new Date(enddate);
   var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
   return parseInt(diffDays);

}

module.exports.Set_Amenities_Array = function () {

   Hotel.find().exec(function (err, HotelData) {
      HotelData.forEach(function (value, i) {

         var hotel_amenities_var = [];
         if (value.hotel_amenities != "") { hotel_amenities = value.hotel_amenities; }

         //sails.log(hotel_amenities_var, 'now amenity', value.hotel_amenities);

         if (typeof hotel_amenities_var == "string" || hotel_amenities_var != '') {
            try {
               hotel_amenities_var = JSON.parse(hotel_amenities_var);
               //sails.log(hotel_amenities_var, 'updated hotel_amenities');
               Hotel.updateOne({id:value.id}).set({hotel_amenities:hotel_amenities_var}).exec(function (err, HotelDataUpdated) { sails.log(HotelDataUpdated.hotel_amenities, 'updated now amentites') });
            }
            catch (err) {
               //sails.log( err );
            }
         }else{
            //sails.log(hotel_amenities, 'updated hotel_amenities');
         }

      });
   });

}


module.exports.Set_Past_Bookings = function () {

   Bookings.find({ status: ["Upcoming", "Current"] }).limit(100).exec(function (err, BookingData) {
      BookingData.forEach(function (value, i) {

         var dateParts = value.departure_date.split("/");

         // month is 0-based, that's why we need dataParts[1] - 1
         var date1 = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
         var date2 = new Date();
         //sails.log(date1, 'value.departure_date', new Date());
         var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
         //sails.log(diffDays, 'diffDays');
         if (diffDays >= 1) {
            Bookings.updateOne({ id: value.id }).set({ status: "Past", reason: "Past status set by system service" }).exec(function (err, BookingsData_U) { });
         }
      });
   });

}

module.exports.Set_Current_Bookings = function () {

   Bookings.find({ status: "Upcoming" }).limit(100).exec(function (err, BookingData) {
      BookingData.forEach(function (value, i) {

         var dateParts = value.arrival_date.split("/");

         // month is 0-based, that's why we need dataParts[1] - 1
         var date1 = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
         var date2 = new Date();
         //sails.log(date1, 'value.departure_date', new Date());
         var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
         //sails.log(diffDays, 'diffDays');
         if (diffDays == 0 || diffDays == -0) {
            //sails.log(diffDays, 'diffDays managing booking current');
            Bookings.updateOne({ id: value.id }).set({ status: "Current" }).exec(function (err, BookingsData_U) { });
         }
      });
   });

}

module.exports.convertLocalDatetoUTCDate = function (date) {

   let Dates = date.split('/');
   let FormatedJSDate = Dates[1] + '/' + Dates[0] + '/' + Dates[2];

   return FormatedJSDate;

}

module.exports.Check_Lat_Long = function (checkPoint, centerPoint, km) {
   var ky = 40000 / 360;
   var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
   var dx = Math.abs(centerPoint.long - checkPoint.long) * kx;
   var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;

   var Result_Dis = Math.sqrt(dx * dx + dy * dy) <= km;

   return Result_Dis;
}


module.exports.Set_Missed_Bids = function () {

   Bids.find({}).where({ is_booked: false, is_paid: false, status: "Processing" }).limit(10).exec(function (err, BidsData) {
      //sails.log(BidsData, 'BidsData sla function')
      BidsData.forEach(function (value, i) {
         var Bid_Updated_Date = new Date(value.updatedAt);
         let BidDate = Bid_Updated_Date.getDate();
         let BidHr = Bid_Updated_Date.getHours();
         let BidMin = Bid_Updated_Date.getMinutes();
         var Current_Date = new Date();
         let CDate = Current_Date.getDate();
         let CHr = Current_Date.getHours();
         let Cmin = Current_Date.getMinutes();
         //sails.log(BidDate, CDate, 'Cdate biddate');
         // ---------------------------handle by date--------------------------------------
         if (BidDate < CDate) {
            Bids.updateOne({ id: value.id }).set({ status: "Missed_SLA", reason: "Missed SLA Updated by System" }).exec(function (err, BidsData_U) { });
            return;
         }
         // ---------------------------handle by timing--------------------------------------
         //sails.log(BidHr, CHr, 'CHrbid');
         if (BidHr < CHr) {
            if (BidMin < Cmin) {
               Bids.updateOne({ id: value.id }).set({ status: "Missed_SLA", reason: "Missed SLA Updated by System" }).exec(function (err, BidsData_U) { });
            }
         }
      });
   });
},


   module.exports.Set_User_Missed_Bids = function () {

      Bids.find({}).where({ is_booked: false, is_paid: false, status: "Approved" }).limit(10).exec(function (err, BidsData) {
         BidsData.forEach(function (value, i) {
            var Bid_Updated_Date = new Date(value.updatedAt);
            let BidHr = Bid_Updated_Date.getHours();
            let BidMin = Bid_Updated_Date.getMinutes();
            var Current_Date = new Date();
            let CHr = Current_Date.getHours();
            let Cmin = Current_Date.getMinutes();
            if (BidHr < CHr) {
               //('greater hour', BidHr, CHr);
               if (BidMin < Cmin) {
                  //sails.log('greater min', BidHr, CHr, BidMin, Cmin, '-----------------', value.series);
                  Bids.updateOne({ id: value.id }).set({ status: "Rejected", reason: "Missed Bid by User, Rejected by System" }).exec(function (err, BidsData_U) { });
               }
            }
         });
      });
   },


   module.exports.Send_Bid_Notification_Hotelier = function () {

      Bids.find({}).where({ is_booked: false, is_paid: false, status: "Processing" }).limit(10).exec(function (err, BidsData) {
         BidsData.forEach(function (value, i) {
            var Bid_Updated_Date = new Date(value.createdAt);
            let BidHr = Bid_Updated_Date.getHours();
            Settings.findOne({ type: "Hotelier_SLA_Mins_First" }).exec(function (err, SLA_Mins_Remind) {
               let mins = 20;
               if (SLA_Mins_Remind) {
                  if (SLA_Mins_Remind.data_number) { mins = SLA_Mins_Remind.data_number };
               }
               let BidMin = Bid_Updated_Date.getMinutes() + mins;
               var Current_Date = new Date();
               let CHr = Current_Date.getHours();
               let Cmin = Current_Date.getMinutes();
               //sails.log(BidHr, BidMin, "BidHr / BidMin", CHr, Cmin, "CHr / BidMin");

               if (BidHr >= CHr) {
                  //sails.log('matched hour', BidHr, CHr);
                  if (Cmin >= BidMin) {
                     //sails.log('matched min', BidHr, CHr, BidMin, Cmin, '-----------------', value.series);
                     var ReminderCount = 0;
                     if (value.reminders) { ReminderCount = value.reminders }
                     //sails.log(ReminderCount, value.reminders, 'value.reminders');
                     if (ReminderCount == 0) {
                        //sails.log(ReminderCount, 'in needed case');
                        ReminderCount = ReminderCount + 1;
                        Bids.updateOne({ id: value.id }).set({ reminders: ReminderCount }).exec(function (err, BidsData_U) {
                           Hotel.findOne({ id: value.hotel_id }).exec(function (err, HotelData) {
                              // Send Notification to Hotelier------------------------------------------------------
                              Notifications.create({
                                 subject: "Please respond to newly placed bid before it gets missed",
                                 message: "Your have received new bid of Rs" + value.price + "/- , room " + value.room_type + ", from - " + value.arrival_date + " to " + value.departure_date,
                                 userId: HotelData.hotelierId,
                                 role: 5,
                                 type: "Hotelier_Bid_Reminder",
                              }).exec(function (err, ReminderNotification) { });
                           });
                        });
                     }
                  }
               }
            });

         });
      });

   },

   module.exports.Send_Bid_Notification_Hotelier2 = function () {

      Bids.find({}).where({ is_booked: false, is_paid: false, status: "Processing" }).limit(10).exec(function (err, BidsData) {
         BidsData.forEach(function (value, i) {
            var Bid_Updated_Date = new Date(value.createdAt);
            let BidHr = Bid_Updated_Date.getHours();
            Settings.findOne({ type: "Hotelier_SLA_Mins_Second" }).exec(function (err, SLA_Mins_Remind) {
               let mins = 39;
               if (SLA_Mins_Remind) {
                  if (SLA_Mins_Remind.data_number) { mins = SLA_Mins_Remind.data_number };
               }
               let BidMin = Bid_Updated_Date.getMinutes() + mins;
               var Current_Date = new Date();
               let CHr = Current_Date.getHours();
               let Cmin = Current_Date.getMinutes();
               //sails.log(BidHr, BidMin, "BidHr / BidMin", CHr, Cmin, "CHr / BidMin");
               if (BidHr >= CHr) {
                  //sails.log('matched hour', BidHr, CHr);
                  if (Cmin >= BidMin) {
                     //sails.log('matched min', BidHr, CHr, BidMin, Cmin, '-----------------', value.series);
                     var ReminderCount = 0;
                     if (value.reminders) { ReminderCount = value.reminders }
                     //sails.log(ReminderCount, value.reminders, 'value.reminders');
                     if (ReminderCount == 1) {
                        //sails.log(ReminderCount, 'in needed case');
                        ReminderCount = ReminderCount + 1;
                        Bids.updateOne({ id: value.id }).set({ reminders: ReminderCount }).exec(function (err, BidsData_U) {
                           Hotel.findOne({ id: value.hotel_id }).exec(function (err, HotelData) {
                              // Send Notification to Hotelier------------------------------------------------------
                              Notifications.create({
                                 subject: "Please respond soon to newly placed bid before it gets missed",
                                 message: "Your have received new bid of Rs" + value.price + "/- , room " + value.room_type + ", from - " + value.arrival_date + " to " + value.departure_date,
                                 userId: HotelData.hotelierId,
                                 role: 5,
                                 type: "Hotelier_Bid_Reminder",
                              }).exec(function (err, ReminderNotification) { });
                           });
                        });
                     }
                  }
               }
            });

         });
      });

   },


   module.exports.RemoveOlderNotificationByTime = function () {
      let PastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      Notifications.find({
         where: {
            createdAt: {
               '<': PastDate
            },
            is_active: true
         }
      }).limit(100).exec(function (err, NotificationData) {
         //sails.log(NotificationData, 'NotificationData');
         if (NotificationData) {
            NotificationData.forEach(function (value, i) {
               Notifications.destroyOne({ id: value.id }).exec(function (err, NotificationDataSet) { });
            });
         }
      });
   },

   module.exports.RemoveOlderNotificationByStatus = function () {
      let PastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      Notifications.find({ is_active: false }).limit(100).exec(function (err, NotificationData) {
         if (NotificationData) {
            NotificationData.forEach(function (value, i) {
               Notifications.destroyOne({ id: value.id }).exec(function (err, NotificationDataSet) { });
            });
         }
      });
   },

   // module.exports.HotelRatings = function (hotel_id){

   //    var RatingsObj = {};

   //    RatingsObj.value = 0;
   //          RatingsObj.clean = 0;
   //          RatingsObj.location = 0;
   //          RatingsObj.service = 0;
   //          RatingsObj.totalRatings = 0;



   // }


   module.exports.Get_States = function () {

      var AllStates =
         [
            { "code": "AN", "name": "Andaman and Nicobar Islands" },
            { "code": "AP", "name": "Andhra Pradesh" },
            { "code": "AR", "name": "Arunachal Pradesh" },
            { "code": "AS", "name": "Assam" },
            { "code": "BR", "name": "Bihar" },
            { "code": "CG", "name": "Chandigarh" },
            { "code": "CH", "name": "Chhattisgarh" },
            { "code": "DH", "name": "Dadra and Nagar Haveli" },
            { "code": "DD", "name": "Daman and Diu" },
            { "code": "DL", "name": "Delhi" },
            { "code": "GA", "name": "Goa" },
            { "code": "GJ", "name": "Gujarat" },
            { "code": "HR", "name": "Haryana" },
            { "code": "HP", "name": "Himachal Pradesh" },
            { "code": "JK", "name": "Jammu and Kashmir" },
            { "code": "JH", "name": "Jharkhand" },
            { "code": "KA", "name": "Karnataka" },
            { "code": "KL", "name": "Kerala" },
            { "code": "LD", "name": "Lakshadweep" },
            { "code": "MP", "name": "Madhya Pradesh" },
            { "code": "MH", "name": "Maharashtra" },
            { "code": "MN", "name": "Manipur" },
            { "code": "ML", "name": "Meghalaya" },
            { "code": "MZ", "name": "Mizoram" },
            { "code": "NL", "name": "Nagaland" },
            { "code": "OR", "name": "Odisha" },
            { "code": "PY", "name": "Puducherry" },
            { "code": "PB", "name": "Punjab" },
            { "code": "RJ", "name": "Rajasthan" },
            { "code": "SK", "name": "Sikkim" },
            { "code": "TN", "name": "Tamil Nadu" },
            { "code": "TS", "name": "Telangana" },
            { "code": "TR", "name": "Tripura" },
            { "code": "UK", "name": "Uttarakhand" },
            { "code": "UP", "name": "Uttar Pradesh" },
            { "code": "WB", "name": "West Bengal" }]

      return AllStates;

   };

module.exports.Get_Cities = function () {

   var AllCities_Array = {
      "AN": [
         "Port Blair*"
      ],
      "AP": [
         "Adoni",
         "Amalapuram",
         "Anakapalle",
         "Anantapur",
         "Bapatla",
         "Bheemunipatnam",
         "Bhimavaram",
         "Bobbili",
         "Chilakaluripet",
         "Chirala",
         "Chittoor",
         "Dharmavaram",
         "Eluru",
         "Gooty",
         "Gudivada",
         "Gudur",
         "Guntakal",
         "Guntur",
         "Hindupur",
         "Jaggaiahpet",
         "Jammalamadugu",
         "Kadapa",
         "Kadiri",
         "Kakinada",
         "Kandukur",
         "Kavali",
         "Kovvur",
         "Kurnool",
         "Macherla",
         "Machilipatnam",
         "Madanapalle",
         "Mandapeta",
         "Markapur",
         "Nagari",
         "Naidupet",
         "Nandyal",
         "Narasapuram",
         "Narasaraopet",
         "Narsipatnam",
         "Nellore",
         "Nidadavole",
         "Nuzvid",
         "Ongole",
         "Palacole",
         "Palasa Kasibugga",
         "Parvathipuram",
         "Pedana",
         "Peddapuram",
         "Pithapuram",
         "Ponnur",
         "Proddatur",
         "Punganur",
         "Puttur",
         "Rajahmundry",
         "Rajam",
         "Rajampet",
         "Ramachandrapuram",
         "Rayachoti",
         "Rayadurg",
         "Renigunta",
         "Repalle",
         "Salur",
         "Samalkot",
         "Sattenapalle",
         "Srikakulam",
         "Srikalahasti",
         "Srisailam Project (Right Flank Colony) Township",
         "Sullurpeta",
         "Tadepalligudem",
         "Tadpatri",
         "Tanuku",
         "Tenali",
         "Tirupati",
         "Tiruvuru",
         "Tuni",
         "Uravakonda",
         "Venkatagiri",
         "Vijayawada",
         "Vinukonda",
         "Visakhapatnam",
         "Vizianagaram",
         "Yemmiganur",
         "Yerraguntla"
      ],
      "AR": [
         "Naharlagun",
         "Pasighat"
      ],
      "AS": [
         "Barpeta",
         "Bongaigaon City",
         "Dhubri",
         "Dibrugarh",
         "Diphu",
         "Goalpara",
         "Guwahati",
         "Jorhat",
         "Karimganj",
         "Lanka",
         "Lumding",
         "Mangaldoi",
         "Mankachar",
         "Margherita",
         "Mariani",
         "Marigaon",
         "Nagaon",
         "Nalbari",
         "North Lakhimpur",
         "Rangia",
         "Sibsagar",
         "Silapathar",
         "Silchar",
         "Tezpur",
         "Tinsukia"
      ],
      "BR": [
         "Araria",
         "Arrah",
         "Arwal",
         "Asarganj",
         "Aurangabad",
         "Bagaha",
         "Barh",
         "Begusarai",
         "Bettiah",
         "Bhabua",
         "Bhagalpur",
         "Buxar",
         "Chhapra",
         "Darbhanga",
         "Dehri-on-Sone",
         "Dumraon",
         "Forbesganj",
         "Gaya",
         "Gopalganj",
         "Hajipur",
         "Jamalpur",
         "Jamui",
         "Jehanabad",
         "Katihar",
         "Kishanganj",
         "Lakhisarai",
         "Lalganj",
         "Madhepura",
         "Madhubani",
         "Maharajganj",
         "Mahnar Bazar",
         "Makhdumpur",
         "Maner",
         "Manihari",
         "Marhaura",
         "Masaurhi",
         "Mirganj",
         "Mokameh",
         "Motihari",
         "Motipur",
         "Munger",
         "Murliganj",
         "Muzaffarpur",
         "Narkatiaganj",
         "Naugachhia",
         "Nawada",
         "Nokha",
         "Patna*",
         "Piro",
         "Purnia",
         "Rafiganj",
         "Rajgir",
         "Ramnagar",
         "Raxaul Bazar",
         "Revelganj",
         "Rosera",
         "Saharsa",
         "Samastipur",
         "Sasaram",
         "Sheikhpura",
         "Sheohar",
         "Sherghati",
         "Silao",
         "Sitamarhi",
         "Siwan",
         "Sonepur",
         "Sugauli",
         "Sultanganj",
         "Supaul",
         "Warisaliganj"
      ],
      "CG": [
         "Chandigarh*"
      ],
      "CH": [
         "Ambikapur",
         "Bhatapara",
         "Bhilai Nagar",
         "Bilaspur",
         "Chirmiri",
         "Dalli-Rajhara",
         "Dhamtari",
         "Durg",
         "Jagdalpur",
         "Korba",
         "Mahasamund",
         "Manendragarh",
         "Mungeli",
         "Naila Janjgir",
         "Raigarh",
         "Raipur*",
         "Rajnandgaon",
         "Sakti",
         "Tilda Newra"
      ],
      "DH": [
         "Silvassa*"
      ],
      "DL": [
         "Delhi",
         "New Delhi*"
      ],
      "GA": [
         "Mapusa",
         "Margao",
         "Marmagao",
         "Panaji*"
      ],
      "GJ": [
         "Adalaj",
         "Ahmedabad",
         "Amreli",
         "Anand",
         "Anjar",
         "Ankleshwar",
         "Bharuch",
         "Bhavnagar",
         "Bhuj",
         "Chhapra",
         "Deesa",
         "Dhoraji",
         "Godhra",
         "Jamnagar",
         "Kadi",
         "Kapadvanj",
         "Keshod",
         "Khambhat",
         "Lathi",
         "Limbdi",
         "Lunawada",
         "Mahesana",
         "Mahuva",
         "Manavadar",
         "Mandvi",
         "Mangrol",
         "Mansa",
         "Mahemdabad",
         "Modasa",
         "Morvi",
         "Nadiad",
         "Navsari",
         "Padra",
         "Palanpur",
         "Palitana",
         "Pardi",
         "Patan",
         "Petlad",
         "Porbandar",
         "Radhanpur",
         "Rajkot",
         "Rajpipla",
         "Rajula",
         "Ranavav",
         "Rapar",
         "Salaya",
         "Sanand",
         "Savarkundla",
         "Sidhpur",
         "Sihor",
         "Songadh",
         "Surat",
         "Talaja",
         "Thangadh",
         "Tharad",
         "Umbergaon",
         "Umreth",
         "Una",
         "Unjha",
         "Upleta",
         "Vadnagar",
         "Vadodara",
         "Valsad",
         "Vapi",
         "Vapi",
         "Veraval",
         "Vijapur",
         "Viramgam",
         "Visnagar",
         "Vyara",
         "Wadhwan",
         "Wankaner"
      ],
      "HR": [
         "Bahadurgarh",
         "Bhiwani",
         "Charkhi Dadri",
         "Faridabad",
         "Fatehabad",
         "Gohana",
         "Gurgaon",
         "Hansi",
         "Hisar",
         "Jind",
         "Kaithal",
         "Karnal",
         "Ladwa",
         "Mahendragarh",
         "Mandi Dabwali",
         "Narnaul",
         "Narwana",
         "Palwal",
         "Panchkula",
         "Panipat",
         "Pehowa",
         "Pinjore",
         "Rania",
         "Ratia",
         "Rewari",
         "Rohtak",
         "Safidon",
         "Samalkha",
         "Sarsod",
         "Shahbad",
         "Sirsa",
         "Sohna",
         "Sonipat",
         "Taraori",
         "Thanesar",
         "Tohana",
         "Yamunanagar"
      ],
      "HP": [
         "Mandi",
         "Nahan",
         "Palampur",
         "Shimla*",
         "Solan",
         "Sundarnagar"
      ],
      "JK": [
         "Anantnag",
         "Baramula",
         "Jammu",
         "Kathua",
         "Punch",
         "Rajauri",
         "Sopore",
         "Srinagar*",
         "Udhampur"
      ],
      "JH": [
         "Adityapur",
         "Bokaro Steel City",
         "Chaibasa",
         "Chatra",
         "Chirkunda",
         "Medininagar (Daltonganj)",
         "Deoghar",
         "Dhanbad",
         "Dumka",
         "Giridih",
         "Gumia",
         "Hazaribag",
         "Jamshedpur",
         "Jhumri Tilaiya",
         "Lohardaga",
         "Madhupur",
         "Mihijam",
         "Musabani",
         "Pakaur",
         "Patratu",
         "Phusro",
         "Ramgarh",
         "Ranchi*",
         "Sahibganj",
         "Saunda",
         "Simdega",
         "Tenu dam-cum-Kathhara"
      ],
      "KA": [
         "Adyar",
         "Afzalpur",
         "Arsikere",
         "Athni",
         "Bengaluru",
         "Belagavi",
         "Ballari",
         "Chikkamagaluru",
         "Davanagere",
         "Gokak",
         "Hubli-Dharwad",
         "Karwar",
         "Kolar",
         "Lakshmeshwar",
         "Lingsugur",
         "Maddur",
         "Madhugiri",
         "Madikeri",
         "Magadi",
         "Mahalingapura",
         "Malavalli",
         "Malur",
         "Mandya",
         "Mangaluru",
         "Manvi",
         "Mudalagi",
         "Mudabidri",
         "Muddebihal",
         "Mudhol",
         "Mulbagal",
         "Mundargi",
         "Mysore",
         "Nanjangud",
         "Nargund",
         "Navalgund",
         "Nelamangala",
         "Pavagada",
         "Piriyapatna",
         "Puttur",
         "Rabkavi Banhatti",
         "Raayachuru",
         "Ranebennuru",
         "Ramanagaram",
         "Ramdurg",
         "Ranibennur",
         "Robertson Pet",
         "Ron",
         "Sadalagi",
         "Sagara",
         "Sakaleshapura",
         "Sindagi",
         "Sanduru",
         "Sankeshwara",
         "Saundatti-Yellamma",
         "Savanur",
         "Sedam",
         "Shahabad",
         "Shahpur",
         "Shiggaon",
         "Shikaripur",
         "Shivamogga",
         "Surapura",
         "Shrirangapattana",
         "Sidlaghatta",
         "Sindhagi",
         "Sindhnur",
         "Sira",
         "Sirsi",
         "Siruguppa",
         "Srinivaspur",
         "Tarikere",
         "Tekkalakote",
         "Terdal",
         "Talikota",
         "Tiptur",
         "Tumkur",
         "Udupi",
         "Vijayapura",
         "Wadi",
         "Yadgir"
      ],

      "KL": [
         "Adoor",
         "Alappuzha",
         "Attingal",
         "Chalakudy",
         "Changanassery",
         "Cherthala",
         "Chittur-Thathamangalam",
         "Guruvayoor",
         "Kanhangad",
         "Kannur",
         "Kasaragod",
         "Kayamkulam",
         "Kochi",
         "Kodungallur",
         "Kollam",
         "Kottayam",
         "Kozhikode",
         "Kunnamkulam",
         "Malappuram",
         "Mattannur",
         "Mavelikkara",
         "Mavoor",
         "Muvattupuzha",
         "Nedumangad",
         "Neyyattinkara",
         "Nilambur",
         "Ottappalam",
         "Palai",
         "Palakkad",
         "Panamattom",
         "Panniyannur",
         "Pappinisseri",
         "Paravoor",
         "Pathanamthitta",
         "Peringathur",
         "Perinthalmanna",
         "Perumbavoor",
         "Ponnani",
         "Punalur",
         "Puthuppally",
         "Koyilandy",
         "Shoranur",
         "Taliparamba",
         "Thekkady",
         "Thiruvalla",
         "Thiruvananthapuram",
         "Thodupuzha",
         "Thrissur",
         "Tirur",
         "Vaikom",
         "Varkala",
         "Vagamon",
         "Vatakara"
      ],
      "MP": [
         "Alirajpur",
         "Ashok Nagar",
         "Balaghat",
         "Bhopal",
         "Ganjbasoda",
         "Gwalior",
         "Indore",
         "Itarsi",
         "Jabalpur",
         "Lahar",
         "Maharajpur",
         "Mahidpur",
         "Maihar",
         "Malaj Khand",
         "Manasa",
         "Manawar",
         "Mandideep",
         "Mandla",
         "Mandsaur",
         "Mauganj",
         "Mhow Cantonment",
         "Mhowgaon",
         "Morena",
         "Multai",
         "Mundi",
         "Murwara (Katni)",
         "Nagda",
         "Nainpur",
         "Narsinghgarh",
         "Narsinghgarh",
         "Neemuch",
         "Nepanagar",
         "Niwari",
         "Nowgong",
         "Nowrozabad (Khodargama)",
         "Pachore",
         "Pali",
         "Panagar",
         "Pandhurna",
         "Panna",
         "Pasan",
         "Pipariya",
         "Pithampur",
         "Porsa",
         "Prithvipur",
         "Raghogarh-Vijaypur",
         "Rahatgarh",
         "Raisen",
         "Rajgarh",
         "Ratlam",
         "Rau",
         "Rehli",
         "Rewa",
         "Sabalgarh",
         "Sagar",
         "Sanawad",
         "Sarangpur",
         "Sarni",
         "Satna",
         "Sausar",
         "Sehore",
         "Sendhwa",
         "Seoni",
         "Seoni-Malwa",
         "Shahdol",
         "Shajapur",
         "Shamgarh",
         "Sheopur",
         "Shivpuri",
         "Shujalpur",
         "Sidhi",
         "Sihora",
         "Singrauli",
         "Sironj",
         "Sohagpur",
         "Tarana",
         "Tikamgarh",
         "Ujjain",
         "Umaria",
         "Vidisha",
         "Vijaypur",
         "Wara Seoni"
      ],
      "MH": [
         "Ahmednagar",
         "Akola",
         "Akot",
         "Amalner",
         "Ambejogai",
         "Amravati",
         "Anjangaon",
         "Arvi",
         "Aurangabad",
         "Bhiwandi",
         "Dhule",
         "Kalyan-Dombivali",
         "Ichalkaranji",
         "Kalyan-Dombivali",
         "Karjat",
         "Latur",
         "Loha",
         "Lonar",
         "Lonavla",
         "Mahad",
         "Malegaon",
         "Malkapur",
         "Mangalvedhe",
         "Mangrulpir",
         "Manjlegaon",
         "Manmad",
         "Manwath",
         "Mehkar",
         "Mhaswad",
         "Mira-Bhayandar",
         "Morshi",
         "Mukhed",
         "Mul",
         "Greater Mumbai*",
         "Murtijapur",
         "Nagpur",
         "Nanded-Waghala",
         "Nandgaon",
         "Nandura",
         "Nandurbar",
         "Narkhed",
         "Nashik",
         "Navi Mumbai",
         "Nawapur",
         "Nilanga",
         "Osmanabad",
         "Ozar",
         "Pachora",
         "Paithan",
         "Palghar",
         "Pandharkaoda",
         "Pandharpur",
         "Panvel",
         "Parbhani",
         "Parli",
         "Partur",
         "Pathardi",
         "Pathri",
         "Patur",
         "Pauni",
         "Pen",
         "Phaltan",
         "Pulgaon",
         "Pune",
         "Purna",
         "Pusad",
         "Rahuri",
         "Rajura",
         "Ramtek",
         "Ratnagiri",
         "Raver",
         "Risod",
         "Sailu",
         "Sangamner",
         "Sangli",
         "Sangole",
         "Sasvad",
         "Satana",
         "Satara",
         "Savner",
         "Sawantwadi",
         "Shahade",
         "Shegaon",
         "Shendurjana",
         "Shirdi",
         "Shirpur-Warwade",
         "Shirur",
         "Shrigonda",
         "Shrirampur",
         "Sillod",
         "Sinnar",
         "Solapur",
         "Soyagaon",
         "Talegaon Dabhade",
         "Talode",
         "Tasgaon",
         "Thane",
         "Tirora",
         "Tuljapur",
         "Tumsar",
         "Uchgaon",
         "Udgir",
         "Umarga",
         "Umarkhed",
         "Umred",
         "Uran",
         "Uran Islampur",
         "Vadgaon Kasba",
         "Vaijapur",
         "Vasai-Virar",
         "Vita",
         "Wadgaon Road",
         "Wai",
         "Wani",
         "Wardha",
         "Warora",
         "Warud",
         "Washim",
         "Yavatmal",
         "Yawal",
         "Yevla"
      ],
      "MN": [
         "Imphal*",
         "Lilong",
         "Mayang Imphal",
         "Thoubal"
      ],
      "ML": [
         "Nongstoin",
         "Shillong*",
         "Tura"
      ],
      "MZ": [
         "Aizawl",
         "Lunglei",
         "Saiha"
      ],
      "NL": [
         "Dimapur",
         "Kohima*",
         "Mokokchung",
         "Tuensang",
         "Wokha",
         "Zunheboto"
      ],
      "OR": [
         "Balangir",
         "Baleshwar Town",
         "Barbil",
         "Bargarh",
         "Baripada Town",
         "Bhadrak",
         "Bhawanipatna",
         "Bhubaneswar*",
         "Brahmapur",
         "Byasanagar",
         "Cuttack",
         "Dhenkanal",
         "Jatani",
         "Jharsuguda",
         "Kendrapara",
         "Kendujhar",
         "Malkangiri",
         "Nabarangapur",
         "Paradip",
         "Parlakhemundi",
         "Pattamundai",
         "Phulabani",
         "Puri",
         "Rairangpur",
         "Rajagangapur",
         "Raurkela",
         "Rayagada",
         "Sambalpur",
         "Soro",
         "Sunabeda",
         "Sundargarh",
         "Talcher",
         "Tarbha",
         "Titlagarh"
      ],
      "PY": [
         "Karaikal",
         "Mahe",
         "Pondicherry*",
         "Yanam"
      ],
      "PB": [
         "Amritsar",
         "Barnala",
         "Batala",
         "Bathinda",
         "Dhuri",
         "Faridkot",
         "Fazilka",
         "Firozpur",
         "Firozpur Cantt.",
         "Gobindgarh",
         "Gurdaspur",
         "Hoshiarpur",
         "Jagraon",
         "Jalandhar Cantt.",
         "Jalandhar",
         "Kapurthala",
         "Khanna",
         "Kharar",
         "Kot Kapura",
         "Longowal",
         "Ludhiana",
         "Malerkotla",
         "Malout",
         "Mansa",
         "Moga",
         "Mohali",
         "Morinda, India",
         "Mukerian",
         "Muktsar",
         "Nabha",
         "Nakodar",
         "Nangal",
         "Nawanshahr",
         "Pathankot",
         "Patiala",
         "Pattran",
         "Patti",
         "Phagwara",
         "Phillaur",
         "Qadian",
         "Raikot",
         "Rajpura",
         "Rampura Phul",
         "Rupnagar",
         "Samana",
         "Sangrur",
         "Sirhind Fatehgarh Sahib",
         "Sujanpur",
         "Sunam",
         "Talwara",
         "Tarn Taran",
         "Urmar Tanda",
         "Zira",
         "Zirakpur"
      ],
      "RJ": [
         "Ajmer",
         "Alwar",
         "Bikaner",
         "Bharatpur",
         "Bhilwara",
         "Jaipur*",
         "Jodhpur",
         "Lachhmangarh",
         "Ladnu",
         "Lakheri",
         "Lalsot",
         "Losal",
         "Makrana",
         "Malpura",
         "Mandalgarh",
         "Mandawa",
         "Mangrol",
         "Merta City",
         "Mount Abu",
         "Nadbai",
         "Nagar",
         "Nagaur",
         "Nasirabad",
         "Nathdwara",
         "Neem-Ka-Thana",
         "Nimbahera",
         "Nohar",
         "Nokha",
         "Pali",
         "Phalodi",
         "Phulera",
         "Pilani",
         "Pilibanga",
         "Pindwara",
         "Pipar City",
         "Prantij",
         "Pratapgarh",
         "Raisinghnagar",
         "Rajakhera",
         "Rajaldesar",
         "Rajgarh (Alwar)",
         "Rajgarh (Churu)",
         "Rajsamand",
         "Ramganj Mandi",
         "Ramngarh",
         "Ratangarh",
         "Rawatbhata",
         "Rawatsar",
         "Reengus",
         "Sadri",
         "Sadulshahar",
         "Sadulpur",
         "Sagwara",
         "Sambhar",
         "Sanchore",
         "Sangaria",
         "Sardarshahar",
         "Sawai Madhopur",
         "Shahpura",
         "Shahpura",
         "Sheoganj",
         "Sikar",
         "Sirohi",
         "Sojat",
         "Sri Madhopur",
         "Sujangarh",
         "Sumerpur",
         "Suratgarh",
         "Taranagar",
         "Todabhim",
         "Todaraisingh",
         "Tonk",
         "Udaipur",
         "Udaipurwati",
         "Vijainagar, Ajmer"
      ],
      "SK": [
         "Gangtok",
         "Lachung",
         "Pelling",
         "Namchi",
         "Ravangla",
         "Tuksom",
         "Lachen",
         "Yumesamdong",
         "Rinchenpong",
         "Monastere De Rumteck",
         "Jorethang",
         "Yangteg",
         "Rumtek",
         "Singtam",
         "Uphper Tadong",
         "Pakyong",
         "Rinchingpong",
         "Dentam",
         "Kakkanad",
         "Padamchen",
         "Yangang",
         "Rhenok",
         "Burtuk",
         "Damthang",
         "Aritar",
         "Rangpo",
         "Kaluk",
         "Zuluk",
         "West Sikkim",
         "Gyalshing",
      ],
      "TN": [
         "Arakkonam",
         "Aruppukkottai",
         "Chennai*",
         "Coimbatore",
         "Erode",
         "Gobichettipalayam",
         "Kancheepuram",
         "Karur",
         "Lalgudi",
         "Madurai",
         "Manachanallur",
         "Nagapattinam",
         "Nagercoil",
         "Namagiripettai",
         "Namakkal",
         "Nandivaram-Guduvancheri",
         "Nanjikottai",
         "Natham",
         "Nellikuppam",
         "Neyveli (TS)",
         "O' Valley",
         "Oddanchatram",
         "P.N.Patti",
         "Pacode",
         "Padmanabhapuram",
         "Palani",
         "Palladam",
         "Pallapatti",
         "Pallikonda",
         "Panagudi",
         "Panruti",
         "Paramakudi",
         "Parangipettai",
         "Pattukkottai",
         "Perambalur",
         "Peravurani",
         "Periyakulam",
         "Periyasemur",
         "Pernampattu",
         "Pollachi",
         "Polur",
         "Ponneri",
         "Pudukkottai",
         "Pudupattinam",
         "Puliyankudi",
         "Punjaipugalur",
         "Ranipet",
         "Rajapalayam",
         "Ramanathapuram",
         "Rameshwaram",
         "Rasipuram",
         "Salem",
         "Sankarankoil",
         "Sankari",
         "Sathyamangalam",
         "Sattur",
         "Shenkottai",
         "Sholavandan",
         "Sholingur",
         "Sirkali",
         "Sivaganga",
         "Sivagiri",
         "Sivakasi",
         "Srivilliputhur",
         "Surandai",
         "Suriyampalayam",
         "Tenkasi",
         "Thammampatti",
         "Thanjavur",
         "Tharamangalam",
         "Tharangambadi",
         "Theni Allinagaram",
         "Thirumangalam",
         "Thirupuvanam",
         "Thiruthuraipoondi",
         "Thiruvallur",
         "Thiruvarur",
         "Thuraiyur",
         "Tindivanam",
         "Tiruchendur",
         "Tiruchengode",
         "Tiruchirappalli",
         "Tirukalukundram",
         "Tirukkoyilur",
         "Tirunelveli",
         "Tirupathur",
         "Tirupathur",
         "Tiruppur",
         "Tiruttani",
         "Tiruvannamalai",
         "Tiruvethipuram",
         "Tittakudi",
         "Udhagamandalam",
         "Udumalaipettai",
         "Unnamalaikadai",
         "Usilampatti",
         "Uthamapalayam",
         "Uthiramerur",
         "Vadakkuvalliyur",
         "Vadalur",
         "Vadipatti",
         "Valparai",
         "Vandavasi",
         "Vaniyambadi",
         "Vedaranyam",
         "Vellakoil",
         "Vellore",
         "Vikramasingapuram",
         "Viluppuram",
         "Virudhachalam",
         "Virudhunagar",
         "Viswanatham"
      ],
      "TL": [
         "Adilabad",
         "Bellampalle",
         "Bhadrachalam",
         "Bhainsa",
         "Bhongir",
         "Bodhan",
         "Farooqnagar",
         "Gadwal",
         "Hyderabad*",
         "Jagtial",
         "Jangaon",
         "Kagaznagar",
         "Kamareddy",
         "Karimnagar",
         "Khammam",
         "Koratla",
         "Kothagudem",
         "Kyathampalle",
         "Mahbubnagar",
         "Mancherial",
         "Mandamarri",
         "Manuguru",
         "Medak",
         "Miryalaguda",
         "Nagarkurnool",
         "Narayanpet",
         "Nirmal",
         "Nizamabad",
         "Palwancha",
         "Ramagundam",
         "Sadasivpet",
         "Sangareddy",
         "Siddipet",
         "Sircilla",
         "Suryapet",
         "Tandur",
         "Vikarabad",
         "Wanaparthy",
         "Warangal",
         "Yellandu"
      ],
      "TR": [
         "Agartala*",
         "Belonia",
         "Dharmanagar",
         "Kailasahar",
         "Khowai",
         "Pratapgarh",
         "Udaipur"
      ],
      "UP": [
         "Achhnera",
         "Agra",
         "Aligarh",
         "Allahabad",
         "Amroha",
         "Azamgarh",
         "Bahraich",
         "Chandausi",
         "Etawah",
         "Firozabad",
         "Fatehpur Sikri",
         "Hapur",
         "Hardoi *",
         "Jhansi",
         "Kalpi",
         "Kanpur",
         "Khair",
         "Laharpur",
         "Lakhimpur",
         "Lal Gopalganj Nindaura",
         "Lalitpur",
         "Lalganj",
         "Lar",
         "Loni",
         "Lucknow*",
         "Mathura",
         "Meerut",
         "Modinagar",
         "Moradabad",
         "Nagina",
         "Najibabad",
         "Nakur",
         "Nanpara",
         "Naraura",
         "Naugawan Sadat",
         "Nautanwa",
         "Nawabganj",
         "Nehtaur",
         "Niwai",
         "Noida",
         "Noorpur",
         "Obra",
         "Orai",
         "Padrauna",
         "Palia Kalan",
         "Parasi",
         "Phulpur",
         "Pihani",
         "Pilibhit",
         "Pilkhuwa",
         "Powayan",
         "Pukhrayan",
         "Puranpur",
         "Purquazi",
         "Purwa",
         "Rae Bareli",
         "Rampur",
         "Rampur Maniharan",
         "Rampur Maniharan",
         "Rasra",
         "Rath",
         "Renukoot",
         "Reoti",
         "Robertsganj",
         "Rudauli",
         "Rudrapur",
         "Sadabad",
         "Safipur",
         "Saharanpur",
         "Sahaspur",
         "Sahaswan",
         "Sahawar",
         "Sahjanwa",
         "Saidpur",
         "Sambhal",
         "Samdhan",
         "Samthar",
         "Sandi",
         "Sandila",
         "Sardhana",
         "Seohara",
         "Shahabad, Hardoi",
         "Shahabad, Rampur",
         "Shahganj",
         "Shahjahanpur",
         "Shamli",
         "Shamsabad, Agra",
         "Shamsabad, Farrukhabad",
         "Sherkot",
         "Shikarpur, Bulandshahr",
         "Shikohabad",
         "Shishgarh",
         "Siana",
         "Sikanderpur",
         "Sikandra Rao",
         "Sikandrabad",
         "Sirsaganj",
         "Sirsi",
         "Sitapur",
         "Soron",
         "Suar",
         "Sultanpur",
         "Sumerpur",
         "Tanda",
         "Thakurdwara",
         "Thana Bhawan",
         "Tilhar",
         "Tirwaganj",
         "Tulsipur",
         "Tundla",
         "Ujhani",
         "Unnao",
         "Utraula",
         "Varanasi",
         "Vrindavan",
         "Warhapur",
         "Zaidpur",
         "Zamania"
      ],
      "UK": [
         "Bageshwar",
         "Dehradun",
         "Haldwani-cum-Kathgodam",
         "Hardwar",
         "Kashipur",
         "Manglaur",
         "Mussoorie",
         "Nagla",
         "Nainital",
         "Pauri",
         "Pithoragarh",
         "Ramnagar",
         "Rishikesh",
         "Roorkee",
         "Rudrapur",
         "Sitarganj",
         "Srinagar",
         "Tehri"
      ],
      "WB": [
         "Adra",
         "Alipurduar",
         "Arambagh",
         "Asansol",
         "Baharampur",
         "Balurghat",
         "Bankura",
         "Darjiling",
         "English Bazar",
         "Gangarampur",
         "Habra",
         "Hugli-Chinsurah",
         "Jalpaiguri",
         "Jhargram",
         "Kalimpong",
         "Kharagpur",
         "Kolkata",
         "Mainaguri",
         "Malda",
         "Mathabhanga",
         "Medinipur",
         "Memari",
         "Monoharpur",
         "Murshidabad",
         "Nabadwip",
         "Naihati",
         "Panchla",
         "Pandua",
         "Paschim Punropara",
         "Purulia",
         "Raghunathpur",
         "Raghunathganj",
         "Raiganj",
         "Rampurhat",
         "Ranaghat",
         "Sainthia",
         "Santipur",
         "Siliguri",
         "Sonamukhi",
         "Srirampore",
         "Suri",
         "Taki",
         "Tamluk",
         "Tarakeswar"
      ]
   }

   return AllCities_Array;
};

module.exports.Get_HotelCategories_ARR = function () {

   var AllHotelCatgeories = [
      "Apartment Hotel",

      "Boutique Hotel", "Heritage", "Grand Heritage", "Home Stay", "Premium Home Stay", "Beach Resort", "Capsule Hotel", "Casino Hotel", "Eco Hotel", "Extended stay Hotel",

      "Flophouse", "Garden Hotels", "Guest House", "Holiday Cottage", "House Hotel", "Hotel Barge",

      "Motel", "Resort", "Roadhouse (premises)", "Ryokan (inn)", "Serviced Apartment",

      "Hotelship", "Single Room Occupancy", "Stopping House", "Spa Hotel",

      "Themed Hotels", "Transit Hotel"
   ]

   return AllHotelCatgeories;

};

module.exports.HotelViews = function () {

   var HotelViews = [
      "Sea View", "Lake View", "Mountain View", "Valley View", "River Front View", "Airport View"
   ];

   return HotelViews;

};

module.exports.RoomViews = function () {

   var HotelViews = [
      "Sea View", "Lake View", "Mountain View", "Valley View", "River Front View", "Airport View", "City View"
   ];

   return HotelViews;

};

module.exports.Backup_MongoDB = function () {
   new Backup(dbUri, basePath).backup();
};