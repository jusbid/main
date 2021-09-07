var Razorpay = require('razorpay');
var MD5 = require("crypto-js/md5");
var request = require('fs');
var async = require('async');
var request = require('request');

var PaymentAPIKey = 'rzp_test_yYIkXBKJo7prO1';
var PaymentAPISecretKey = 'TQzbonkdOQLUzQ94VupHv3VS';
var DefaultGST = "06KIUJUSBID2333";

module.exports = {


  Test: async (req, res) => {

    var reqParams = req.params;

    var instance = new Razorpay({
      key_id: PaymentAPIKey,
      key_secret: PaymentAPISecretKey,
    });

    var OrderData = {};
    sails.log(req.params, 'req.params');

    var AmountPay = reqParams.strictkey;
    let bufferObj = Buffer.from(AmountPay, "base64");
    let decodedString = bufferObj.toString("utf8");
    OrderData.amount = decodedString;


    var options = {
      amount: '',  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };

    options.amount = OrderData.amount * 100;

    let PaymentsCheck = await Payments.findOne({ bid_id: reqParams.bidid, rzp_payment_status: 'captured' });

    if (PaymentsCheck) {

      return res.send({ responseCode: 201, msg: 'Payment already processed' });

    }

    // var AmountPay = reqParams.strictkey;
    // let bufferObj = Buffer.from(AmountPay, "base64");
    // let decodedString = bufferObj.toString("utf8");
    // options.amount = OrderData.amount = decodedString;

    instance.orders.create(options, function (err, order) {
      sails.log(order, 'order rzp');
      if (!order) order = {};
      OrderData = order;
      OrderData.name = reqParams.name;
      OrderData.email = reqParams.email;
      OrderData.mobile = reqParams.mobile;
      OrderData.bidid = reqParams.bidid;
      OrderData.strict_key = reqParams.strictkey;

      Bids.findOne({ id: OrderData.bidid }).exec(function (err, BidDetails) {

        Payments.create({
          userId: BidDetails.userId,
          bid_id: OrderData.bidid,
          type: "Booking_Payment",
          username: BidDetails.firstname + ' ' + BidDetails.lastname,
          hotel_id: BidDetails.hotel_id,
          hotel_name: BidDetails.hotel_name,
          amount: OrderData.amount
        }).fetch().exec(function (err, PaymentRecord) {

          Bookings.updateOne({ bid_id: OrderData.bidid }).set({ payment_id: PaymentRecord.id }).exec(function (err, BidDetails) {

            OrderData.payment_id = PaymentRecord.id;
            return res.view('pages/payment/pay-now', {
              OrderData: OrderData
            });
          });
        });
      });
    });
  },


  App_Payments: async (req, res) => {

    if (!req.body.userId || !req.body.bid_id || !req.body.hotel_id || !req.body.amount || !req.body.rzp_payment_id ) {
      return res.send({ responseCode: 201, msg: 'Please provide all required parameters to create a payment request record..' });
    }

    var PaymentData = await Payments.create({
      userId: req.body.userId,
      bid_id: req.body.bid_id,
      type: "Booking_Payment",
      username: req.body.username,
      hotel_id: req.body.hotel_id,
      hotel_name: req.body.hotel_name,
      amount: req.body.amount,
      //payment details--------------------------------------------
      rzp_payment_id: req.body.rzp_payment_id,
      rzp_order_id: req.body.rzp_order_id,
      rzp_signature: req.body.rzp_signature,
      rzp_payment_status: req.body.rzp_payment_status,
      status: req.body.rzp_payment_status,
      payment_via: 'Mobile_App'
    }).fetch();

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
        taxClass: BidsUpdated.taxClass,
        add_on: BidsUpdated.add_on,
        payment_id: PaymentData.id
      }).fetch();

      //----Update Bid Status By Paid------------------------------------------------
      await Bids.updateOne({ id: bid_id }).set({ is_booked: true, is_paid: true });

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
      //-------------------sending confirmation sms--------------------------------
      let sms_msg = "Hello, "+BookingData.series+" Your JusBid booking Has been Confirmed for Hotel "+BookingData.hotel_name+" Room "+BookingData.room_type+" Guest "+BookingData.adult+" your Booking Price is "+BookingData.price+". Thank you for choosing Us!";
      if(BookingData)functions2.Send_Single_SMS_Booking(userdata.mobile, sms_msg);
      if (BookingData) {
        return res.send({ responseCode: 200, msg: 'Booking generated & payment record saved successfully', data: BookingData });
      } else {
        return res.send({ responseCode: 201, msg: 'Booking not generated' });
      }

    } else {
      return res.send({ responseCode: 201, msg: 'Booking already exists using this Bid ID' });
    }
  },




  Save_Payment_Record: async (req, res) => {

    var userId = req.body.userId;
    var payment_id = req.body.payment_id;
    var rzp_payment_id = req.body.rzp_payment_id;
    var rzp_order_id = req.body.rzp_order_id;
    var rzp_signature = req.body.rzp_signature;

    //get all payment records----------------------------------------------------------------

    request({
      method: 'GET',
      url: 'https://'+PaymentAPIKey+':'+PaymentAPISecretKey+'@api.razorpay.com/v1/payments/' + rzp_payment_id,
    }, function (error, response, body) {

      if (error) {
        return res.send({ responseCode: 201, msg: 'Error while creating payment, ' + error });
      }
      sails.log('Status:', response.statusCode);
      sails.log('Headers:', JSON.stringify(response.headers));
      sails.log('Response:', body);

      let payment_data = JSON.parse(body);


      Payments.updateOne({ id: payment_id }).set({
        rzp_payment_id: rzp_payment_id,
        rzp_order_id: rzp_order_id,
        rzp_signature: rzp_signature,
        status: "Paid",
        rzp_payment_data: payment_data,
        rzp_payment_status: payment_data.status
      }).exec(function (err, CreatePay) {
        sails.log(rzp_payment_id, 'rzp_payment_id', CreatePay, payment_id);

        if (!CreatePay) {
          return res.send({ responseCode: 201, msg: 'Error while creating payment' });
        } else {
          return res.send({ responseCode: 200, msg: 'Payment Record Created..', data: CreatePay });
        }
      })
    });
  },



  Init_Refund_Service: async (req, res) => {

    let booking_id = req.body.booking_id;

    let BookingData = await Bookings.findOne({ id: booking_id });

    let PaymentData = await Payments.findOne({ id: BookingData.payment_id });

    sails.log(PaymentData, BookingData.payment_id);

    if (!BookingData || !PaymentData) { return res.send({ responseCode: 201, msg: 'Booking / Payment data not found..' }); }

    let Payment_ID = PaymentData.rzp_payment_id;

    sails.log(Payment_ID);

    let refund_data = {
      "amount": BookingData.amount,
      "speed": "optimum",
      "receipt": booking_id,
    }

    request({
      method: 'POST',
      data: refund_data,
      url: 'https://'+PaymentAPIKey+':'+PaymentAPISecretKey+'@api.razorpay.com/v1/payments/' + Payment_ID + '/refund',
    }, function (error, response, body) {

      if (error) {
        return res.send({ responseCode: 201, msg: 'Refund request failed due to: ' + error });
      }

      if (response.statusCode == 200) {

        Payments.updateOne({ id: BookingData.payment_id }).set({ status: 'Refund_Paid' }).exec(function (err, paymentUpdate) {
          if (!paymentUpdate) {
            return res.send({ responseCode: 201, msg: 'Refund request send but got error while updating payment record, please try manually to update refund payment status' });
          }
        });

        return res.send({ responseCode: 201, msg: 'Refund request sent successfully: ', response: JSON.parse(body) });
      } else {
        return res.send({ responseCode: 201, msg: 'Refund request failed due to: ', response: JSON.parse(body) });
      }
    });
  },



  Generate_Order_Request_RZP: async (req, res) => {

    if (!req.body.bid_id) {
      return res.send({ responseCode: 201, msg: 'Bid ID not found' });
    }

    let BiddingData = await Bids.findOne({ id: req.body.bid_id });

    if (!BiddingData) {
      return res.send({ responseCode: 201, msg: 'Bid record data not found..' });
    }

    const formData = {
      amount: req.body.amount,
      currency: "INR",
      receipt: "rcptid_"+BiddingData.series+'1'
    }


   
      sails.log(formData);
      request.post({url:'https://'+PaymentAPIKey+':'+PaymentAPISecretKey+'@api.razorpay.com/v1/orders', formData:formData}, function optionalCallback(error, response, body) {
      // request({
      //   method: 'POST',
      //   data: options,
      //   url: 'https://rzp_test_SF1Xn1tfhexJK5:71AyCxhqqE0dqgjsInHNxkFu@api.razorpay.com/v1/orders',
      // }, function (error, response, body) {
  
        if (error) {
          return res.send({ responseCode: 201, msg: 'Order request failed due to: ' + error });
        }
  
        if (response.statusCode == 200) {
  
          Bids.updateOne({ id: BiddingData.id }).set({ rzp_order_data: JSON.parse(body) }).exec(function (err, BidData) {
          });
  
          return res.send({ responseCode: 200, msg: 'Order generated successfully: ', response: JSON.parse(body) });
        } else {
          return res.send({ responseCode: 201, msg: 'Refund request failed due to: ', response: JSON.parse(body) });
        }
      });


    

  },



  Get_Hotel_With_Payments_Records: async (req, res) => {

    var HotelsData = await Hotel.find({ status: 'Approved' });

    async.forEachOf(HotelsData, function (hotel, i, callback) {

      Payments.count({ hotel_id: hotel.id }).exec(function (err, HotelPayCounts) {
        HotelsData[i].payment_records = HotelPayCounts;
      });

      Refunds.count({ hotel_id: hotel.id }).exec(function (err, HotelRefundCounts) {
        HotelsData[i].refund_records = HotelRefundCounts;
      });

      User.findOne({ select: ['userId', 'firstname', 'lastname'] }).where({ userId: hotel.bdeId }).exec(function (err, HotelBde) {
        HotelsData[i].bde = HotelBde.firstname + ' ' + HotelBde.lastname;

      });

      callback();

    }, function (err) {
      return res.send({ responseCode: 200, data: HotelsData, msg: 'Hotel Records Fetched' });
    });

  },


  Update_Booking_Info: async (req, res) => {

    let bid_id = req.body.bid_id;

    let UpdatedBooking = await Bids.updateOne({ id: bid_id }).set({ add_on: req.body.add_on, taxClass: req.body.taxClass });

    //let UpdatedBooking = await Bookings.updateOne({ bid_id: bid_id }).set({ add_on: req.body.add_on, taxClass: req.body.taxClass });

    if (UpdatedBooking) {
      return res.send({ responseCode: 200, msg: 'Booking data updated' });
    } else {
      return res.send({ responseCode: 201, msg: 'unable to update booking data' });
    }


  },


  Payment_Thanks: async (req, res) => {
    return res.view('pages/payment/pay-thanks', {

    });

  },


  Get_All_Payments: async (req, res) => {

    let Payments_Data = await Payments.find({}).sort('createdAt DESC');
    async.forEachOf(Payments_Data, function (payObj, i, callback) {
      Hotel.findOne({ id: payObj.hotel_id }).exec(function (err, hotelObj) {
        if (err) { sails.log(err); }
        if (hotelObj) {
          Payments_Data[i].hotel_state = hotelObj.state;
          Payments_Data[i].hotel_city = hotelObj.city;
          Payments_Data[i].commission = hotelObj.commission;
        }
      callback();
      })

    }, function (err) {

      if (err) { sails.log(err) }

      if (!Payments_Data) {
        return res.send({ responseCode: 201, msg: 'Error while fetching payment records' });
      } else {
        return res.send({ responseCode: 200, msg: 'Payment Record Fetched..', data: Payments_Data });

      }

    })

  },


  Get_All_Hotel_Payments: async (req, res) => {

    if (!req.body.hotel_id) {
      return res.send({ responseCode: 201, msg: 'Hotel ID not found' });
    }

    let Payments_Data = await Payments.find({ hotel_id: req.body.hotel_id }).sort("createdAt DESC");

    async.forEachOf(Payments_Data, function (payObj, i, callback) {

      Hotel.findOne({ id: payObj.hotel_id }).exec(function (err, hotelObj) {
        if (err) { sails.log(err); }
        if (hotelObj) {
          Payments_Data[i].hotel_state = hotelObj.state;
          Payments_Data[i].hotel_city = hotelObj.city;
          Payments_Data[i].commission = hotelObj.commission;
        }
        

        
        sails.log('reached in case', payObj.bid_id);
        //get booking data----------------------------------------------------------------
        Bookings.findOne({ bid_id: payObj.bid_id }).exec(function (err, bookingObj) {
          sails.log('reached in case booking', bookingObj);
          if (err) { sails.log(err); }
          if (bookingObj) {
            Payments_Data[i].booking = bookingObj;
          }
          //get booking data ends----------------------------------------------------------------
          callback();
        })

        
      })


    }, function (err) {

      if (err) { sails.log(err) }

      if (!Payments_Data) {
        return res.send({ responseCode: 201, msg: 'Error while fetching payment records' });
      } else {
        return res.send({ responseCode: 200, msg: 'Payment Record Fetched..', data: Payments_Data });

      }

    })





  },



  Get_Payments_ByDate: async (req, res) => {

    let StartDate = req.body.start_date;
    let EnDate = req.body.end_date;
    var PayAll = [];

    if (StartDate && EnDate) {
      PayAll = await Payments.find({
        where: {
          createdAt: {
            '>': new Date(StartDate),
            '<': new Date(EnDate)
          }
        }
      }).sort('createdAt DESC');

      sails.log(PayAll, 'PayAll', new Date(StartDate), EnDate);
    }
    else {
      PayAll = await Payments.find({
        where: {
          createdAt: {
            '>': new Date('2018-08-24T14:56:21.774Z')
          }
        }
      }).limit(500).sort('createdAt DESC');
    }

    if (!PayAll) {
      return res.send({ responseCode: 201, msg: 'Payments not found' });
    } else {
      return res.send({ responseCode: 200, msg: 'Payments Fetched', data: PayAll });
    }

  },



  Get_Refunds_ByDate: async (req, res) => {

    let StartDate = req.body.start_date;
    let EnDate = req.body.end_date;
    var PayAll = [];

    if (StartDate && EnDate) {
      PayAll = await Refunds.find({
        where: {
          createdAt: {
            '>': new Date(StartDate),
            '<': new Date(EnDate)
          }
        }
      }).sort('createdAt DESC');

      sails.log(PayAll, 'PayAll', new Date(StartDate), EnDate);
    }
    else {
      PayAll = await Refunds.find({
        where: {
          createdAt: {
            '>': new Date('2018-08-24T14:56:21.774Z')
          }
        }
      }).limit(500).sort('createdAt DESC');
    }

    if (!PayAll) {
      return res.send({ responseCode: 201, msg: 'Refunds not found' });
    } else {
      return res.send({ responseCode: 200, msg: 'Refunds Fetched', data: PayAll });
    }

  },



  Get_Hotel_Counts: async (req, res) => {

    if (!req.body.hotel_id) {
      return res.send({ responseCode: 201, msg: 'Hotel ID not found' });
    }

    let hotel_id = req.body.hotel_id;

    let HotelRefundProcessing = Refunds.count({ hotel_id: hotel_id, is_paid: true });
    let HotelRefundProcessed = Refunds.count({ hotel_id: hotel_id, is_paid: false });

    let AllData = {
      RefundProcessed: HotelRefundProcessed,
      RefundProcessing: HotelRefundProcessing,
    }

    return res.send({ responseCode: 200, msg: 'Data Fetched', data: AllData });

  },

  My_Booking_Invoice: async (req, res) => {

    var reqParams = req.params;
    var BookingId = reqParams.booking_id;
    var BookingData = await Bookings.findOne({ series: BookingId });

    if (BookingData) {
        //-----------Get Hotel State to Get GST--------------------------
      let BookedHotel = await Hotel.findOne({ select:['id', 'state'] }).where({id:BookingData.hotel_id});

      sails.log(BookedHotel.state, 'Booking state');

      if(!BookedHotel){ return res.send({ responseCode: 201, msg: 'Hotel Not Found' }); }

      //-----------------Get Booking GST------------------------------------------------------------------------

      let GSTState = await StateGST.findOne({gst_state:BookedHotel.state});
      if(GSTState){
        BookingData.gst = GSTState.gst_no;
        BookingData.gst_address = GSTState.gst_address;
      }else{
        BookingData.gst = DefaultGST;
      }

      let UserData = await User.findOne({ select: ['id', 'userId', 'firstname', 'lastname', 'mobile', 'email', 'address'] }).where({ userId: BookingData.userId });
      if (UserData) {
        BookingData.userdata = UserData;
      } else {
        BookingData.userdata = {};
      }
      // get payment details-----------------------------------------
      let PaymentData = await Payments.findOne({ bid_id: BookingData.bid_id });

      if (PaymentData) {
        BookingData.payment = PaymentData;
      } else {
        return res.send({ responseCode: 201, msg: 'Booking Invoice Not Found' });;
      }
    } else {
      return res.send({ responseCode: 201, msg: 'Booking Invoice Not Found' });
    }
    sails.log(BookingData, "BookingData");

    return res.view('pages/payment/invoice', {
      BookingData: BookingData
    });

  },





}