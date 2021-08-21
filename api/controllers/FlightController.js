var async = require('async');
var request = require('request');
var parser = require('xml2json');
var FUser = 'Universal API/uAPI7527371964-0a8054f8';
var FPass = 'Wt5?9$rBS6';
var FTargetBranch = 'P7154556';

module.exports = {


    Search_Low_Fare_Flight: async (req, res) => {

      sails.log(req.body, 'flight payload');

      let arrival = req.body.arrival;
      let departure = req.body.departure;
      let flightDate = req.body.flightDate;
      //-----------------------------------
      let arrival_back = req.body.arrival_back;
      let departure_back = req.body.departure_back;
      let flightDate_back = req.body.flightDate_back;
      //----------------------------------------------
      let is_two_way = req.body.is_two_way;

      if(is_two_way == true || is_two_way == 'true'){
         var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="'+FTargetBranch+'" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+arrival+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+departure+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate+'" /></air:SearchAirLeg><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+arrival_back+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+departure_back+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate_back+'" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers><common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/><common:SearchPassenger Code="INF" Age="01" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A=="/><common:SearchPassenger Code="CNN" Age="10" BookingTravelerRef="IAmvmlf5SO+ZVfy5o8VPuA=="/><air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
      }else{
         var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="'+FTargetBranch+'" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+arrival+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+departure+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate+'" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers><common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/><common:SearchPassenger Code="INF" Age="01" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A=="/><common:SearchPassenger Code="CNN" Age="10" BookingTravelerRef="IAmvmlf5SO+ZVfy5o8VPuA=="/><air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
      }

 //     sails.log(Two_Way);

      request({
          method: 'POST',
          url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
          auth: {
            'username': FUser,
            'password': FPass,
           },
            multipart:[ { body:  RequestPay} ]
       
        }, function (error, response, body) {
    
          if (error) {
            return res.send({ responseCode: 201, msg: 'Error while creating payment, ' + error });
          }else{
            var jsondata = parser.toJson(body);
            var jsondata = JSON.parse(jsondata);
             if(!jsondata["SOAP:Envelope"]){
               return res.send({ responseCode: 201, msg: 'Error while fetching flight details' + error });
             }
            var jsondata = jsondata["SOAP:Envelope"];
            if(!jsondata["SOAP:Body"]){
               return res.send({ responseCode: 201, msg: 'Error while fetching flight details' + error });
             }
            var jsondata = jsondata["SOAP:Body"];
             return res.send({ responseCode: 200, data:jsondata });
          }
         
        });
  },


  Get_Airports: async (req, res) => {
   let airports = functions.Get_Airports();
   return res.send({ responseCode: 200, data:airports });
  },

  Get_Airlines: async (req, res) => {
   let airports = functions.Get_Airlines();
   return res.send({ responseCode: 200, data:airports });
  }


}