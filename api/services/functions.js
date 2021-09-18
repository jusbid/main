var Jimp = require('jimp');
var async = require('async');
var fs = require('fs');
var dbUri = "mongodb://jusbid_db:jusbid_password@cluster0-shard-00-00.vohwf.mongodb.net:27017,cluster0-shard-00-01.vohwf.mongodb.net:27017,cluster0-shard-00-02.vohwf.mongodb.net:27017/jusbid?ssl=true&replicaSet=atlas-nynmye-shard-0&authSource=admin&retryWrites=true&w=majority";
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

module.exports.Get_Room_Image_Random_Name = function () {
  return Math.random().toString(36).slice(2) + 'roomimg.';
}

module.exports.Get_Format = function (RoomImage_64) {
  var checkformat = RoomImage_64.includes("png;");
  var format = "jpeg";
  if (checkformat) { format = "png"; }

  return format;
}

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

  sails.log('assets' + ImagePath, 'fileminify');

  Jimp.read('assets' + ImagePath)
    .then(ReadImg => {
      sails.log(ReadImg.getWidth());
      var Img_Width = ReadImg.getWidth();
      var Img_Heigth = ReadImg.getHeight();

      if (Img_Width > 2500) {
        var Get_Width = (Img_Width / 100) * 20;
        var Get_Height = (Img_Heigth / 100) * 20;
      }
      else if (Img_Width > 1500) {
        var Get_Width = (Img_Width / 100) * 25;
        var Get_Height = (Img_Heigth / 100) * 25;
      }
      else if (Img_Width > 700) {
        var Get_Width = (Img_Width / 100) * 40;
        var Get_Height = (Img_Heigth / 100) * 40;
      } else if (Img_Width > 500) {
        var Get_Width = (Img_Width / 100) * 60;
        var Get_Height = (Img_Heigth / 100) * 60;
      } else {
        var Get_Width = Img_Width;
        var Get_Height = Img_Heigth;
      }

      var ExportPath = this.Get_MinPath(ImagePath);
      return ReadImg.resize(Get_Width, Get_Height).quality(60).write('assets' + ExportPath);
    })
    .catch(err => {
      sails.log(err, 'minify function');
    });
}


module.exports.Get_MinPath = function (ImagePath) {
  var ExportExtract = ImagePath.split('.');
  return ExportPath = ExportExtract[0] + '_min' + '.jpg';
}


module.exports.GenerateMinifiedImg_New = function (ImagePath, Quality) {

  sails.log('assets' + ImagePath, 'fileminify');

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

      var ExportPath = this.Get_MinPath_New(ImagePath);
      return ReadImg.resize(Get_Width, Get_Height).quality(60).write('assets' + ExportPath);
    })
    .catch(err => {
      sails.log(err, 'minify function');
    });
}

module.exports.Get_MinPath_New = function (ImagePath) {
  var ExportExtract = ImagePath.split('.');
  sails.log(ExportExtract[1], 'ExportExtract[1]');
  return ExportPath = ExportExtract[0] + '_min.' + ExportExtract[1];
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

// module.exports.Get_Date_Diff = function (startdate, enddate) {

//   var date1 = new Date(startdate);
//   var date2 = new Date(enddate);
//   var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
//   return parseInt(diffDays);

// }

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
          Hotel.updateOne({ id: value.id }).set({ hotel_amenities: hotel_amenities_var }).exec(function (err, HotelDataUpdated) { sails.log(HotelDataUpdated.hotel_amenities, 'updated now amentites') });
        }
        catch (err) {
          //sails.log( err );
        }
      } else {
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
        createdAt: { '<': PastDate },
        is_active: true
      }
    }).limit(100).exec(function (err, NotificationData) {
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

  module.exports.Upload_To_Temp = function (hotel_image_link, min_path, create_repo) {
    setTimeout(() => {
      if (!fs.existsSync('.tmp/public' + create_repo)) { fs.mkdir('.tmp/public' + create_repo, { recursive: true }, function (err, result) { }); }
      fs.copyFile('assets' + hotel_image_link, '.tmp/public' + hotel_image_link, (err) => { if (err) { sails.log(err, 'error on copy upload hotel image'); } });
      fs.copyFile('assets' + min_path, '.tmp/public' + min_path, (err) => { if (err) { sails.log(err, 'error on copy upload hotel image'); } });
    }, 2000);
  };

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
      "Port Blair"
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
      "Patna",
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
      "Chandigarh"
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
      "Raipur",
      "Rajnandgaon",
      "Sakti",
      "Tilda Newra"
    ],
    "DH": [
      "Silvassa"
    ],
    "DL": [
      "Delhi",
      "New Delhi"
    ],
    "GA": [
      "Mapusa",
      "Margao",
      "Marmagao",
      "Panaji"
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
      "Bilaspur",
      "Chamba",
      "Hamirpur",
      "Kangra",
      "Kinnaur",
      "Kullu",
      "Lahaul & Spiti",
      "Manali",
      "Mandi",
      "Nahan",
      "Palampur",
      "Shimla",
      "Sirmaur",
      "Solan",
      "Sundarnagar",
      "Una"
    ],
    "JK": [
      "Anantnag",
      "Baramula",
      "Jammu",
      "Kathua",
      "Punch",
      "Rajauri",
      "Sopore",
      "Srinagar",
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
      "Ranchi",
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
      "Munnar",
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
      "Greater Mumbai",
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
      "Imphal",
      "Lilong",
      "Mayang Imphal",
      "Thoubal"
    ],
    "ML": [
      "Nongstoin",
      "Shillong",
      "Tura"
    ],
    "MZ": [
      "Aizawl",
      "Lunglei",
      "Saiha"
    ],
    "NL": [
      "Dimapur",
      "Kohima",
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
      "Bhubaneswar",
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
      "Pondicherry",
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
      "Beawar",
      "Bikaner",
      "Bharatpur",
      "Bhilwara",
      "Jaipur",
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
      "Chennai",
      "Coimbatore",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Gobichettipalayam",
      "Kallakurichi",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Kodaikanal",
      "Krishnagiri",
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
      "Nilgiris",
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
    "TS": [
      "Adilabad",
      "Bellampalle",
      "Bhadrachalam",
      "Bhainsa",
      "Bhongir",
      "Bodhan",
      "Farooqnagar",
      "Gadwal",
      "Hyderabad",
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
      "Agartala",
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
      "Hardoi ",
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
      "Lucknow",
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
      "Almora",
      "Bageshwar",
      "Corbett",
      "Dehradun",
      "Haldwani-cum-Kathgodam",
      "Haridwar",
      "Kashipur",
      "Manglaur",
      "Mukteshwar",
      "Mussoorie",
      "Nagla",
      "Nainital",
      "Pauri",
      "Pithoragarh",
      "Ramnagar",
      "Ranikhet",
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


module.exports.Get_Airports = function () {

  var Airports = [
    {
      "IATA_code": "AGX",
      "ICAO_code": "VOAT",
      "airport_name": "Agatti Island Airport",
      "city_name": "Agatti Island"
    },
    {
      "IATA_code": "AMD",
      "ICAO_code": "VAAH",
      "airport_name": "Ahmedabad Airport",
      "city_name": "Ahmedabad"
    },
    {
      "IATA_code": "AJL",
      "ICAO_code": "VEAZ",
      "airport_name": "Aizawl Airport",
      "city_name": "Aizawl"
    },
    {
      "IATA_code": "AKD",
      "ICAO_code": "VAAK",
      "airport_name": "Akola Airport",
      "city_name": "Akola"
    },
    {
      "IATA_code": "IXV",
      "ICAO_code": "VEAN",
      "airport_name": "Along Airport",
      "city_name": "Along"
    },
    {
      "IATA_code": "LKO",
      "ICAO_code": "VILK",
      "airport_name": "Amausi Airport",
      "city_name": "Lucknow"
    },
    {
      "IATA_code": "LUH",
      "ICAO_code": "VILD",
      "airport_name": "Amritsar Airport",
      "city_name": "Ludhiana"
    },
    {
      "IATA_code": "IXB",
      "ICAO_code": "VEBD",
      "airport_name": "Bagdogra Airport",
      "city_name": "Bagdogra"
    },
    {
      "IATA_code": "IXE",
      "ICAO_code": "VOML",
      "airport_name": "Bajpe Airport",
      "city_name": "Mangalore"
    },
    {
      "IATA_code": "IXL",
      "ICAO_code": "VILH",
      "airport_name": "Bakula Rimpoche Airport",
      "city_name": "Leh"
    },
    {
      "IATA_code": "RGH",
      "ICAO_code": "VEBG",
      "airport_name": "Balurghat Airport",
      "city_name": "Balurghat"
    },
    {
      "IATA_code": "IXD",
      "ICAO_code": "VIAL",
      "airport_name": "Bamrauli Airport",
      "city_name": "Allahabad"
    },
    {
      "IATA_code": "SHL",
      "ICAO_code": "VEBI",
      "airport_name": "Barapani Airport",
      "city_name": "Shillong"
    },
    {
      "IATA_code": "BEK",
      "ICAO_code": "VOPN",
      "airport_name": "Bareli Airport",
      "city_name": "Bareli"
    },
    {
      "IATA_code": "BEP",
      "ICAO_code": "VOBI",
      "airport_name": "Bellary Airport",
      "city_name": "Bellary"
    },
    {
      "IATA_code": "BLR",
      "ICAO_code": "VOBG",
      "airport_name": "Bengaluru International Airport",
      "city_name": "Bangalore"
    },
    {
      "IATA_code": "BUP",
      "ICAO_code": "VIBT",
      "airport_name": "Bhatinda Airport",
      "city_name": "Bhatinda"
    },
    {
      "IATA_code": "BHU",
      "ICAO_code": "VABV",
      "airport_name": "Bhavnagar Airport",
      "city_name": "Bhavnagar"
    },
    {
      "IATA_code": "BHO",
      "ICAO_code": "VABP",
      "airport_name": "Bhopal Airport",
      "city_name": "Bhopal"
    },
    {
      "IATA_code": "BBI",
      "ICAO_code": "VEBS",
      "airport_name": "Bhubaneswar Airport",
      "city_name": "Bhubaneswar"
    },
    {
      "IATA_code": "BKB",
      "ICAO_code": "VIBK",
      "airport_name": "Bikaner Airport",
      "city_name": "Bikaner"
    },
    {
      "IATA_code": "PAB",
      "ICAO_code": "VABI",
      "airport_name": "Bilaspur Airport",
      "city_name": "Bilaspur"
    },
    {
      "IATA_code": "IXR",
      "ICAO_code": "VERC",
      "airport_name": "Birsa Munda International Airport",
      "city_name": "Ranchi"
    },
    {
      "IATA_code": "GAU",
      "ICAO_code": "VEGT",
      "airport_name": "Borjhar Airport",
      "city_name": "Guwahati"
    },
    {
      "IATA_code": "CBD",
      "ICAO_code": "VECX",
      "airport_name": "Car Nicobar Airport",
      "city_name": "Car Nicobar"
    },
    {
      "IATA_code": "IXC",
      "ICAO_code": "VICG",
      "airport_name": "Chandigarh Airport",
      "city_name": "Chandigarh"
    },
    {
      "IATA_code": "MAA",
      "ICAO_code": "VOMM",
      "airport_name": "Chennai International Airport",
      "city_name": "Chennai"
    },
    {
      "IATA_code": "BOM",
      "ICAO_code": "VABB",
      "airport_name": "Chhatrapati Shivaji International Airport",
      "city_name": "Mumbai"
    },
    {
      "IATA_code": "IXU",
      "ICAO_code": "VAAU",
      "airport_name": "Chikkalthana Airport",
      "city_name": "Aurangabad"
    },
    {
      "IATA_code": "COK",
      "ICAO_code": "VOCI",
      "airport_name": "Cochin International Airport",
      "city_name": "Kochi"
    },
    {
      "IATA_code": "COH",
      "ICAO_code": "VECO",
      "airport_name": "Cooch Behar Airport",
      "city_name": "Cooch Behar"
    },
    {
      "IATA_code": "CDP",
      "ICAO_code": "VOCP",
      "airport_name": "Cuddapah Airport",
      "city_name": "Cuddapah"
    },
    {
      "IATA_code": "UDR",
      "ICAO_code": "VAUD",
      "airport_name": "Maharana Pratap Airport",
      "city_name": "Udaipur"
    },
    {
      "IATA_code": "GOI",
      "ICAO_code": "VAGO",
      "airport_name": "Dabolim Airport",
      "city_name": "Goa"
    },
    {
      "IATA_code": "NMB",
      "ICAO_code": "VADN",
      "airport_name": "Daman Airport",
      "city_name": "Daman"
    },
    {
      "IATA_code": "DAE",
      "ICAO_code": "VEDZ",
      "airport_name": "Daparizo Airport",
      "city_name": "Daparizo"
    },
    {
      "IATA_code": "DAI",
      "ICAO_code": "",
      "airport_name": "Darjeeling Airport",
      "city_name": "Darjeeling"
    },
    {
      "IATA_code": "DED",
      "ICAO_code": "VIDN",
      "airport_name": "Dehra Dun Airport",
      "city_name": "Dehra Dun"
    },
    {
      "IATA_code": "DEP",
      "ICAO_code": "",
      "airport_name": "Deparizo Airport",
      "city_name": "Deparizo"
    },
    {
      "IATA_code": "IDR",
      "ICAO_code": "VAID",
      "airport_name": "Devi Ahilyabai Holkar Airport",
      "city_name": "Indore"
    },
    {
      "IATA_code": "DBD",
      "ICAO_code": "VEDB",
      "airport_name": "Dhanbad Airport",
      "city_name": "Dhanbad"
    },
    {
      "IATA_code": "DIB",
      "ICAO_code": "VEMN",
      "airport_name": "Dibrugarh Airport",
      "city_name": "Dibrugarh"
    },
    {
      "IATA_code": "DMU",
      "ICAO_code": "VEMR",
      "airport_name": "Dimapur Airport",
      "city_name": "Dimapur"
    },
    {
      "IATA_code": "DIU",
      "ICAO_code": "VA1P",
      "airport_name": "Diu Airport",
      "city_name": "Diu"
    },
    {
      "IATA_code": "DHM",
      "ICAO_code": "VIGG",
      "airport_name": "Gaggal Airport",
      "city_name": "Dharamsala"
    },
    {
      "IATA_code": "ISK",
      "ICAO_code": "VANR",
      "airport_name": "Gandhinagar Airport",
      "city_name": "Nasik"
    },
    {
      "IATA_code": "GAY",
      "ICAO_code": "VEGY",
      "airport_name": "Gaya Airport",
      "city_name": "Gaya"
    },
    {
      "IATA_code": "GOP",
      "ICAO_code": "VEGK",
      "airport_name": "Gorakhpur Airport",
      "city_name": "Gorakhpur"
    },
    {
      "IATA_code": "JGA",
      "ICAO_code": "VAJM",
      "airport_name": "Govardhanpur Airport",
      "city_name": "Jamnagar"
    },
    {
      "IATA_code": "GUX",
      "ICAO_code": "VAGN",
      "airport_name": "Guna Airport",
      "city_name": "Guna"
    },
    {
      "IATA_code": "GWL",
      "ICAO_code": "VIGR",
      "airport_name": "Gwalior Airport",
      "city_name": "Gwalior"
    },
    {
      "IATA_code": "HSS",
      "ICAO_code": "VIHR",
      "airport_name": "Hissar Airport",
      "city_name": "Hissar"
    },
    {
      "IATA_code": "HBX",
      "ICAO_code": "VAHB",
      "airport_name": "Hubli Airport",
      "city_name": "Hubli"
    },
    {
      "IATA_code": "HYD",
      "ICAO_code": "VOHY",
      "airport_name": "Hyderabad International Airport",
      "city_name": "Hyderabad"
    },
    {
      "IATA_code": "DEL",
      "ICAO_code": "VIDP",
      "airport_name": "Indira Gandhi International Airport",
      "city_name": "New Delhi"
    },
    {
      "IATA_code": "JLR",
      "ICAO_code": "VAJB",
      "airport_name": "Jabalpur Airport",
      "city_name": "Jabalpur"
    },
    {
      "IATA_code": "JGB",
      "ICAO_code": "",
      "airport_name": "Jagdalpur Airport",
      "city_name": "Jagdalpur"
    },
    {
      "IATA_code": "JSA",
      "ICAO_code": "VIJR",
      "airport_name": "Jaisalmer Airport",
      "city_name": "Jaisalmer"
    },
    {
      "IATA_code": "PYB",
      "ICAO_code": "VEJP",
      "airport_name": "Jeypore Airport",
      "city_name": "Jeypore"
    },
    {
      "IATA_code": "JDH",
      "ICAO_code": "VIJO",
      "airport_name": "Jodhpur Airport",
      "city_name": "Jodhpur"
    },
    {
      "IATA_code": "IXH",
      "ICAO_code": "VEKR",
      "airport_name": "Kailashahar Airport",
      "city_name": "Kailashahar"
    },
    {
      "IATA_code": "IXQ",
      "ICAO_code": "VEKM",
      "airport_name": "Kamalpur Airport",
      "city_name": "Kamalpur"
    },
    {
      "IATA_code": "IXY",
      "ICAO_code": "VAKE",
      "airport_name": "Kandla Airport",
      "city_name": "Kandla"
    },
    {
      "IATA_code": "KNU",
      "ICAO_code": "VIKA",
      "airport_name": "Kanpur Airport",
      "city_name": "Kanpur"
    },
    {
      "IATA_code": "IXK",
      "ICAO_code": "VAKS",
      "airport_name": "Keshod Airport",
      "city_name": "Keshod"
    },
    {
      "IATA_code": "HJR",
      "ICAO_code": "VAKJ",
      "airport_name": "Khajuraho Airport",
      "city_name": "Khajuraho"
    },
    {
      "IATA_code": "AGR",
      "ICAO_code": "VIAG",
      "airport_name": "Kheria Airport",
      "city_name": "Agra"
    },
    {
      "IATA_code": "IXN",
      "ICAO_code": "VEKW",
      "airport_name": "Khowai Airport",
      "city_name": "Khowai"
    },
    {
      "IATA_code": "KLH",
      "ICAO_code": "VAKP",
      "airport_name": "Kolhapur Airport",
      "city_name": "Kolhapur"
    },
    {
      "IATA_code": "KTU",
      "ICAO_code": "VIKO",
      "airport_name": "Kota Airport",
      "city_name": "Kota"
    },
    {
      "IATA_code": "CCJ",
      "ICAO_code": "VOCL",
      "airport_name": "Kozhikode Airport",
      "city_name": "Kozhikode"
    },
    {
      "IATA_code": "KUU",
      "ICAO_code": "VIBR",
      "airport_name": "Kullu Manali Airport",
      "city_name": "Bhuntar Kullu."
    },
    {
      "IATA_code": "IXS",
      "ICAO_code": "VEKU",
      "airport_name": "Kumbhirgram Airport",
      "city_name": "Silchar"
    },
    {
      "IATA_code": "IXI",
      "ICAO_code": "VELR",
      "airport_name": "Lilabari Airport",
      "city_name": "Lilabari"
    },
    {
      "IATA_code": "PNQ",
      "ICAO_code": "VAPO",
      "airport_name": "Lohegaon Airport",
      "city_name": "Pune"
    },
    {
      "IATA_code": "IXM",
      "ICAO_code": "VOMD",
      "airport_name": "Madurai Airport",
      "city_name": "Madurai"
    },
    {
      "IATA_code": "LDA",
      "ICAO_code": "VEMH",
      "airport_name": "Malda Airport",
      "city_name": "Malda"
    },
    {
      "IATA_code": "MOH",
      "ICAO_code": "VEMN",
      "airport_name": "Mohanbari Airport",
      "city_name": "Mohanbari"
    },
    {
      "IATA_code": "IMF",
      "ICAO_code": "VEIM",
      "airport_name": "Municipal Airport",
      "city_name": "Imphal"
    },
    {
      "IATA_code": "MZA",
      "ICAO_code": "",
      "airport_name": "Muzaffarnagar Airport",
      "city_name": "Muzaffarnagar"
    },
    {
      "IATA_code": "MZU",
      "ICAO_code": "VEMZ",
      "airport_name": "Muzaffarpur Airport",
      "city_name": "Muzaffarpur"
    },
    {
      "IATA_code": "MYQ",
      "ICAO_code": "VOMY",
      "airport_name": "Mysore Airport",
      "city_name": "Mysore"
    },
    {
      "IATA_code": "NDC",
      "ICAO_code": "VAND",
      "airport_name": "Nanded Airport",
      "city_name": "Nanded"
    },
    {
      "IATA_code": "CCU",
      "ICAO_code": "VECC",
      "airport_name": "Netaji Subhash Chandra Bose International Airport",
      "city_name": "Kolkata"
    },
    {
      "IATA_code": "NVY",
      "ICAO_code": "VONV",
      "airport_name": "Neyveli Airport",
      "city_name": "Neyveli"
    },
    {
      "IATA_code": "OMN",
      "ICAO_code": "",
      "airport_name": "Osmanabad Airport",
      "city_name": "Osmanabad"
    },
    {
      "IATA_code": "PGH",
      "ICAO_code": "VIPT",
      "airport_name": "Pantnagar Airport",
      "city_name": "Pantnagar"
    },
    {
      "IATA_code": "IXT",
      "ICAO_code": "VEPG",
      "airport_name": "Pasighat Airport",
      "city_name": "Pasighat"
    },
    {
      "IATA_code": "IXP",
      "ICAO_code": "VIPK",
      "airport_name": "Pathankot Airport",
      "city_name": "Pathankot"
    },
    {
      "IATA_code": "PAT",
      "ICAO_code": "VEPT",
      "airport_name": "Patna Airport",
      "city_name": "Patna"
    },
    {
      "IATA_code": "CJB",
      "ICAO_code": "VOCB",
      "airport_name": "Peelamedu Airport",
      "city_name": "Coimbatore"
    },
    {
      "IATA_code": "PNY",
      "ICAO_code": "VOPC",
      "airport_name": "Pondicherry Airport",
      "city_name": "Pondicherry"
    },
    {
      "IATA_code": "PBD",
      "ICAO_code": "VAPR",
      "airport_name": "Porbandar Airport",
      "city_name": "Porbandar"
    },
    {
      "IATA_code": "IXZ",
      "ICAO_code": "VOPB",
      "airport_name": "Port Blair Airport",
      "city_name": "Port Blair"
    },
    {
      "IATA_code": "PUT",
      "ICAO_code": "",
      "airport_name": "Puttaparthi Airport",
      "city_name": "Puttaparthi"
    },
    {
      "IATA_code": "RPR",
      "ICAO_code": "VARP",
      "airport_name": "Raipur Airport",
      "city_name": "Raipur"
    },
    {
      "IATA_code": "ATQ",
      "ICAO_code": "VIAR",
      "airport_name": "Raja Sansi Airport",
      "city_name": "Amritsar"
    },
    {
      "IATA_code": "RJA",
      "ICAO_code": "VORY",
      "airport_name": "Rajahmundry Airport",
      "city_name": "Rajahmundry"
    },
    {
      "IATA_code": "RAJ",
      "ICAO_code": "VARK",
      "airport_name": "Rajkot Airport",
      "city_name": "Rajkot"
    },
    {
      "IATA_code": "RJI",
      "ICAO_code": "",
      "airport_name": "Rajouri Airport",
      "city_name": "Rajouri"
    },
    {
      "IATA_code": "RMD",
      "ICAO_code": "",
      "airport_name": "Ramagundam Airport",
      "city_name": "Ramagundam"
    },
    {
      "IATA_code": "RTC",
      "ICAO_code": "VARG",
      "airport_name": "Ratnagiri Airport",
      "city_name": "Ratnagiri"
    },
    {
      "IATA_code": "REW",
      "ICAO_code": "",
      "airport_name": "Rewa Airport",
      "city_name": "Rewa"
    },
    {
      "IATA_code": "RRK",
      "ICAO_code": "VERK",
      "airport_name": "Rourkela Airport",
      "city_name": "Rourkela"
    },
    {
      "IATA_code": "JRH",
      "ICAO_code": "VEJT",
      "airport_name": "Rowriah Airport",
      "city_name": "Jorhat"
    },
    {
      "IATA_code": "BHJ",
      "ICAO_code": "VABJ",
      "airport_name": "Rudra Mata Airport",
      "city_name": "Bhuj"
    },
    {
      "IATA_code": "RUP",
      "ICAO_code": "VERU",
      "airport_name": "Rupsi Airport",
      "city_name": "Rupsi"
    },
    {
      "IATA_code": "SXV",
      "ICAO_code": "VOSM",
      "airport_name": "Salem Airport",
      "city_name": "Salem"
    },
    {
      "IATA_code": "TEZ",
      "ICAO_code": "VETZ",
      "airport_name": "Salonibari Airport",
      "city_name": "Tezpur"
    },
    {
      "IATA_code": "IXG",
      "ICAO_code": "VABM",
      "airport_name": "Sambre Airport",
      "city_name": "Belgaum"
    },
    {
      "IATA_code": "JAI",
      "ICAO_code": "VIJP",
      "airport_name": "Sanganeer Airport",
      "city_name": "Jaipur"
    },
    {
      "IATA_code": "TNI",
      "ICAO_code": "VIST",
      "airport_name": "Satna Airport",
      "city_name": "Satna"
    },
    {
      "IATA_code": "IXJ",
      "ICAO_code": "VIJU",
      "airport_name": "Satwari Airport",
      "city_name": "Jammu"
    },
    {
      "IATA_code": "SSE",
      "ICAO_code": "VASL",
      "airport_name": "Sholapur Airport",
      "city_name": "Sholapur"
    },
    {
      "IATA_code": "SLV",
      "ICAO_code": "VISM",
      "airport_name": "Simla Airport",
      "city_name": "Simla"
    },
    {
      "IATA_code": "IXA",
      "ICAO_code": "VEAT",
      "airport_name": "Singerbhil Airport",
      "city_name": "Agartala"
    },
    {
      "IATA_code": "IXW",
      "ICAO_code": "VEJS",
      "airport_name": "Sonari Airport",
      "city_name": "Jamshedpur"
    },
    {
      "IATA_code": "NAG",
      "ICAO_code": "VANP",
      "airport_name": "Sonegaon Airport",
      "city_name": "Nagpur"
    },
    {
      "IATA_code": "SXR",
      "ICAO_code": "VISR",
      "airport_name": "Srinagar Airport",
      "city_name": "Srinagar"
    },
    {
      "IATA_code": "STV",
      "ICAO_code": "VASU",
      "airport_name": "Surat Airport",
      "city_name": "Surat"
    },
    {
      "IATA_code": "TEI",
      "ICAO_code": "VETJ",
      "airport_name": "Tezu Airport",
      "city_name": "Tezu"
    },
    {
      "IATA_code": "TJV",
      "ICAO_code": "VOTJ",
      "airport_name": "Thanjavur Airport",
      "city_name": "Thanjavur"
    },
    {
      "IATA_code": "TRV",
      "ICAO_code": "VOTV",
      "airport_name": "Thiruvananthapuram International Airport",
      "city_name": "Trivandrum"
    },
    {
      "IATA_code": "TIR",
      "ICAO_code": "VOTP",
      "airport_name": "Tirupati Airport",
      "city_name": "Tirupati"
    },
    {
      "IATA_code": "TRZ",
      "ICAO_code": "VOTR",
      "airport_name": "Trichy Airport",
      "city_name": "Trichy"
    },
    {
      "IATA_code": "TCR",
      "ICAO_code": "",
      "airport_name": "Tuticorin Airport",
      "city_name": "Tuticorin"
    },
    {
      "IATA_code": "BDQ",
      "ICAO_code": "VABO",
      "airport_name": "Vadodara Airport",
      "city_name": "Vadodara"
    },
    {
      "IATA_code": "VNS",
      "ICAO_code": "VIBN",
      "airport_name": "Varanasi Airport",
      "city_name": "Varanasi"
    },
    {
      "IATA_code": "VGA",
      "ICAO_code": "VOBZ",
      "airport_name": "Vijayawada Airport",
      "city_name": "Vijayawada"
    },
    {
      "IATA_code": "VTZ",
      "ICAO_code": "VEVZ",
      "airport_name": "Vishakhapatnam Airport",
      "city_name": "Vishakhapatnam"
    },
    {
      "IATA_code": "WGC",
      "ICAO_code": "VOWA",
      "airport_name": "Warangal Airport",
      "city_name": "Warangal"
    },
    {
      "IATA_code": "ZER",
      "ICAO_code": "VEZO",
      "airport_name": "Zero Airport",
      "city_name": "Zero"
    }
  ];

  return Airports;

}

module.exports.Get_Airlines = function () {

  var Airlines = [

    {
      "airline": "Air India",
      "IATA": "AI",
      "ICAO": "AIC",
      // "callsign": "AIRINDIA",
      // "commenced": 1946,
      // "headquarters": "Delhi",
      // "type": "Full Service",
      "image": "airlines/airindia.png"
    },
    {
      "airline": "Vistara",
      "IATA": "UK",
      "ICAO": "VTI",
      // "callsign": "VISTARA",
      // "commenced": 2015,
      // "headquarters": "Gurugram",
      // "type": "Full Service",
      "image": "airlines/vistara.png"
    },
    {
      "airline": "Air India Express",
      "IATA": "IX",
      "ICAO": "AXB",
      // "callsign": "EXPRESS INDIA",
      // "commenced": 2005,
      // "headquarters": "Kochi",
      // "type": "Low cost",
      "image": "airlines/airindiaexpress.png"
    },
    {
      "airline": "SpiceJet",
      "IATA": "SG",
      "ICAO": "SEJ",
      // "callsign": "SPICEJET",
      // "commenced": 2005,
      // "headquarters": "Gurugram",
      // "type": "Low cost",
      "image": "airlines/spicejet.png"
    },
    {
      "airline": "Go First",
      "IATA": "G8",
      "ICAO": "GOW",
      // "callsign": "GOAIR",
      // "commenced": 2005,
      // "headquarters": "Mumbai",
      // "type": "Low cost",
      "image": "airlines/goair.png"
    },
    {
      "airline": "IndiGo",
      "IATA": "6E",
      "ICAO": "IGO",
      // "callsign": "IFLY",
      // "commenced": 2006,
      // "headquarters": "Gurugram",
      // "type": "Low cost",
      "image": "airlines/indigo.png"
    },
    {
      "airline": "AirAsia India",
      "IATA": "I5",
      "ICAO": "IAD",
      // "callsign": "RED KNIGHT",
      // "commenced": 2014,
      // "headquarters": "Bengaluru",
      // "type": "Low cost",
      "image": "airlines/airasia.png"
    },
    {
      "airline": "AirAsia India",
      "IATA": "I5",
      "ICAO": "IAD",
      // "callsign": "RED KNIGHT",
      // "commenced": 2014,
      // "headquarters": "Bengaluru",
      // "type": "Low cost",
      "image": "airlines/airasia.png"
    },
    {
      "airline": "Hahn Air Lines",
      "IATA": "H1",
      "ICAO": "IAD",
      // "callsign": "RED KNIGHT",
      // "commenced": 2014,
      // "headquarters": "Bengaluru",
      // "type": "Low cost",
      "image": "airlines/hahn.png"
    },



  ];

  return Airlines;

}

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
    "Sea View", "Lake View", "Mountain View", "Valley View", "River Front View", "Airport View", "Nature View", "City View"
  ];

  return HotelViews;

};

module.exports.RoomViews = function () {

  var RoomViews = [
    "Sea View", "Lake View", "Mountain View", "Valley View", "River Front View", "Airport View", "City View", "Nature View"
  ];

  return RoomViews;

};

module.exports.Backup_MongoDB = function () {
  //new Backup(dbUri, basePath).backup();


  // var dbUri_ = dbUri;

  //example dbUri with username and password for the database test
  // var dbUri = "mongodb://username:pwd@127.0.0.1:27017/test";


  var basePath = "./backup";
  var Backup = require("backup-mongodb");

  //========= email configs ========

  var emailSubject = "DATABASE BACKUP";
  var emailText = "This email contains an attachment of the backup of your mongodb in zip format";

  var smtpOptions = {
    host: "smtp.gmail.com",
    port: "465",
    auth: {
      user: "khushal.cornice@gmail.com",
      pass: "Colors9636"
    },
    tls: {
      rejectUnauthorized: false,
      secureProtocol: "TLSv1_method",
      rejectUnauthorized: false
    }
  };


  var emailOptions = {
    from: "khushal.cornice@gmail.com",
    to: "khushal.cornice@gmail.com",
    subject: emailSubject,
    text: emailText
  }

  //======== now do the backup ==========

  new Backup(dbUri, basePath, smtpOptions, emailOptions).backup();
};