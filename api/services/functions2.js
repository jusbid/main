var request = require('request');
var JusbidBase64 = "anVzYmlk";
var userId_sms = encodeURIComponent("rudroalt");
var passwd_sms = "rudro_7alt";
var CryptoJS = require("crypto-js");

// module.exports.RecievePaymentStatus = function (payment_id) {

//     sails.log(payment_id, 'payment_id over fun2');

//     request({
//         method: 'GET',
//         url: 'https://rzp_test_SF1Xn1tfhexJK5:71AyCxhqqE0dqgjsInHNxkFu@api.razorpay.com/v1/payments/'+payment_id,
//     }, function (error, response, body) {
//         sails.log('Status:', response.statusCode);
//         sails.log('Headers:', JSON.stringify(response.headers));
//         sails.log('Response:', body);
//     });


// }

module.exports.Test_Single_SMS = function () {

  let R_Bid_SMS ='Hello Avdesh, Your Bid for Hotel abctest of test has been tested please test.\nThank you\nTeam Jusbid';

  sails.log(R_Bid_SMS, 'R_Bid_SMS');


  let mobileSend = '7412064075';
  let URL = "https://push3.aclgateway.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener?appid=rudroalt&userId=rudroalt&pass=rudro_7alt&contenttype=1&from=JBDBID&to="+mobileSend+"&text="+R_Bid_SMS+"&alert=1&selfid=true&dlrreq=true&intflag=false";

  request({
    method: 'GET',
    url: URL,
  }, function (error, response, body) {
    sails.log(response, 'Test_Single_SMS');
    if (error) {
      sails.log(error);
    }else{
      sails.log( body);
    }
  });

}


module.exports.Send_Single_SMS = function (mobile_no, message) {

    let mobileSend = mobile_no;
    let URL = "https://push3.aclgateway.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener?appid=rudroalt&userId=rudroalt&pass=rudro_7alt&contenttype=1&from=JBDBID&to="+mobileSend+"&text="+message+"&alert=1&selfid=true&dlrreq=true&intflag=false";

    request({
      method: 'GET',
      url: URL,
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }else{
        sails.log( body);
      }
    });

  }


  module.exports.Send_Single_SMS_Booking = function (mobile_no, message) {

    let mobileSend = mobile_no;
    let URL = "https://push3.aclgateway.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener?appid=rudroalt&userId=rudroalt&pass=rudro_7alt&contenttype=1&from=JBDBOOK&to="+mobileSend+"&text="+message+"&alert=1&selfid=true&dlrreq=true&intflag=false";

    request({
      method: 'GET',
      url: URL,
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }else{
        sails.log( body);
      }
    });

  }


  module.exports.Send_Single_SMS_Test = function () {

    let mobileSend = "9785558507";
    let msg = "Hello, Khushal Your JusBid booking Has been Confirmed for Hotel Amargarh Room Deluxe_Suite Guest 2 your Booking Price is 5000. Thank you for choosing Us!"

    let URL = "https://push3.aclgateway.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener?appid=rudroalt&userId=rudroalt&pass=rudro_7alt&contenttype=1&from=JBDBID&to="+mobileSend+"&text="+msg+"&alert=1&selfid=true&dlrreq=true&intflag=false";
    sails.log(msg);
    request({
      method: 'GET',
      url: URL,
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }else{
        sails.log( body);
      }
    });

  }

  


  module.exports.Send_OTP_SMS = function (mobile_no, OTP) {

    let URL = "https://otp2.aclgateway.com/OTP_ACL_Web/OtpRequestListener?enterpriseid=rudrotp&subEnterpriseid=rudrotp&pusheid=rudrotp&pushepwd=rudro_7tp&msisdn="+mobile_no+"&sender=JBDREG&msgtext=Your one-time password for Log-in on Jusbid is "+OTP+". Thank you Team Jusbid.";
    sails.log(URL, 'URL');
    request({
      method: 'GET',
      url: URL,
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }else{
        sails.log( body);
      }
    });

  }

  // module.exports.CheckToken = function () {

  // }


  module.exports.CheckToken = function (ciphertext) {
    var JusbidKey = "jusbid key2020";

    var bytes  = CryptoJS.AES.decrypt(ciphertext, JusbidKey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    sails.log(originalText, 'originalText-', ciphertext);

    


    if(!originalText){
      return false;
    }else{
      return true;
    }

    

  }