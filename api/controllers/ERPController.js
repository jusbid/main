var PaymentAPIKey = 'rzp_test_K9YIjvN8gPZkC2';
var PaymentAPISecretKey = 'g85wuHwHK9rLmiUAbk4c7Mlp';
var request = require('request');
var fs = require('fs');
var async = require('async');

module.exports = {

  Get_All_Payments: async (req, res) => {

    request({
      method: 'GET',
      url: 'https://' + PaymentAPIKey + ':' + PaymentAPISecretKey + '@api.razorpay.com/v1/payments',
    }, function (error, response, body) {

      if (error) {
        return res.send({ responseCode: 201, msg: 'Error while fetching payments, ' + error });
      }

      if (!body) {
        return res.send({ responseCode: 201, msg: 'Error while fetching payment' });
      } else {
        return res.send({ responseCode: 200, msg: 'RZP Payment Record Fetched..', data: JSON.parse(body) });
      }
    })
  },

  Get_All_Bookings_ERP: async (req, res) => {

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

    async.forEachOf(BidsAll, function (value, i, callback) {

      if (value.add_on) {
        AddOn.find({ id: value.add_on }).exec(function (err, addons) {
          BidsAll[i].addon_data = addons;
          callback();
        });
      } else {
        callback();
      }

    }, function (err) {

      if (!BidsAll) {
        return res.send({ responseCode: 201, msg: 'Bookings not found' });
      } else {
        return res.send({ responseCode: 200, msg: 'Bookings Fetched', data: BidsAll });

      }

    });

  },

  Upload_Invoice: async (req, res) => {
    var FilePrefixPath = functions.Get_FileUpload_Path();
    if (!fs.existsSync('assets/doc/invoices' + FilePrefixPath)) { fs.mkdir('assets/doc/invoices' + FilePrefixPath, function (err, result) { }); }

    req.file('invoice').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/doc/invoices' + FilePrefixPath)
    }, function (err, uploadedFiles1) {
      if (err) return res.serverError(err);
      if (uploadedFiles1.length == 0) {
        return res.send({ responseCode: 201, msg: 'Invoice image not uploaded, please try again' });
      }
      let invoice_doc = functions.Get_Excluded_Path(uploadedFiles1[0].fd);

      HotelierInvoice.create({
        invoice_path: invoice_doc,
        hotel_id: req.body.hotel_id,
        remark: req.body.remark
      }).fetch().exec(function (err, result) {
        if (!result) {
          return res.send({ responseCode: 201, msg: 'Invoice Document not saved', err: err });
        } else {
          return res.send({ responseCode: 200, msg: 'Invoice image not added successfully', path: invoice_doc });
        }
      })

    });
  },

  Hotel_Invoices: async (req, res) => {

    let HotelInvoices = await HotelierInvoice.find({ hotel_id: req.body.hotel_id });
    if (!HotelInvoices) {
      return res.send({ responseCode: 201, msg: 'Invoice Not Fetched' });
    } else {
      return res.send({ responseCode: 200, data: HotelInvoices });
    }

  },

  Save_Hotelier_Payments: async (req, res) => {

    if (!req.body.hotel_id || !req.body.userId || !req.body.grand_total) {
      return res.send({ responseCode: 201, msg: 'Please provide all required parameters..' });
    }

    let SaveHotelierPayments = await BalanceSheet.create({
      hotel_id: req.body.hotel_id,
      userId: req.body.userId,
      hotel_name: req.body.hotel_name,
      total: req.body.total,
      account_type: req.body.account_type,
      grand_total: req.body.grand_total,
      payment_type: req.body.payment_type,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      type:'hotelier_payment',

    }).fetch();

    if (!SaveHotelierPayments) {
      return res.send({ responseCode: 201, msg: 'Not able to create payment record..' });
    } else {
      return res.send({ responseCode: 200, data: SaveHotelierPayments });
    }


  },

  Get_Hotelier_Payments: async (req, res) => {
    let GetDataHotelierPayments = await BalanceSheet.find({ hotel_id: req.body.hotel_id });

    if (!GetDataHotelierPayments) {
      return res.send({ responseCode: 201, msg: 'Not able to get payment record..' });
    } else {
      return res.send({ responseCode: 200, data: GetDataHotelierPayments });
    }
  },


  Save_Balance_Sheet_Data: async (req, res) => {

    if (!req.body.userId || !req.body.date) {
      return res.send({ responseCode: 201, msg: 'Please provide all required parameters..' });
    }

    let BalanceSheetData = await BalanceSheet.create({
      hotel_id: req.body.hotel_id,
      userId: req.body.userId,
      hotel_name: req.body.hotel_name,
      total: req.body.total,
      account_type: req.body.account_type,
      grand_total: req.body.grand_total,
      payment_type: req.body.payment_type,
      description: req.body.description,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      type:req.body.type,
      //-------------------------------------------
      expense: req.body.expense,
      bank_name: req.body.bank_name,
      bank_account:req.body.bank_account,
      cheque_no: req.body.cheque_no,
      payment_through: req.body.payment_through,
      date: req.body.date
    }).fetch();

    if (!BalanceSheetData) {
      return res.send({ responseCode: 201, msg: 'Not able to create balance sheet record..' });
    } else {
      return res.send({ responseCode: 200, data: BalanceSheetData });
    }


  },



}