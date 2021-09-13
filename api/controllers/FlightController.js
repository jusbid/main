var async = require('async');
var request = require('request');
var parser = require('xml2json');
var FUser = 'Universal API/uAPI7527371964-0a8054f8';
var FPass = 'Wt5?9$rBS6';
var FTargetBranch = 'P7154556';

module.exports = {

    Get_Flight_Pricing: async (req, res) => {
      let carrier = req.body.carrier;
      let flightNumber = req.body.flightNumber;
      let origin = req.body.origin;
      let destination = req.body.destination;
      let departure_time = req.body.departure_time;
      let arrival_time = req.body.arrival_time;
      let flight_time = req.body.flight_time;
      let provider_code = req.body.provider_code;
      let class_service = req.body.class_service;
      let distance = req.body.distance;
      let av_source = req.body.av_source;
      let book_code = req.body.book_code;
      let segmentKey = req.body.segmentKey;
      let fareBasis = req.body.fareBasis;

      //--------------------return keys--------------------------
      let carrier_back = req.body.carrier_back;
      let flightNumber_back = req.body.flightNumber_back;
      let departure_time_back = req.body.departure_time_back;
      let arrival_time_back = req.body.arrival_time_back;
      let flight_time_back = req.body.flight_time_back;
      let provider_code_back = req.body.provider_code_back;
      let class_service_back = req.body.class_service_back;
      //--------------------keys--------------------------
      let is_two_way = req.body.is_two_way;

      let RequestXML = '';

      if(is_two_way == true || is_two_way == 'true'){
        RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="fbd6367e-1e7a-4138-8b1c-57628a36c50a" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="'+segmentKey+'" AvailabilitySource="'+av_source+'" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="'+carrier+'" FlightNumber="'+flightNumber+'" Origin="'+origin+'" Destination="'+origin+'" DepartureTime="'+departure_time+'" ArrivalTime="'+arrival_time+'" FlightTime="'+flight_time+'" Distance="'+distance+'" ProviderCode="'+provider_code+'" ClassOfService="'+class_service+'" /><AirSegment Key="S+xxet/pWDKAUNI0BAAAAA==" AvailabilitySource="S" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="1" Carrier="'+carrier_back+'" FlightNumber="'+flightNumber_back+'" Origin="'+origin_back+'" Destination="'+destination_back+'" DepartureTime="'+departure_time_back+'" ArrivalTime="'+arrival_time_back+'" FlightTime="'+flight_time_back+'" Distance="'+distance_back+'" ProviderCode="'+provider_code_back+'" ClassOfService="'+class_service_back+'" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="dzRLZmg2cHlHT2VGNkRYbg==" Key="dzRLZmg2cHlHT2VGNkRYbg==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="'+segmentKey+'" FareBasisCode="'+fareBasis+'"><PermittedBookingCodes><BookingCode Code="'+book_code+'"" /></PermittedBookingCodes></AirSegmentPricingModifiers><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKAUNI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
       //RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="fbd6367e-1e7a-4138-8b1c-57628a36c50a" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="S+xxet/pWDKA+MI0BAAAAA==" AvailabilitySource="P" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="AI" FlightNumber="864" Origin="BOM" Destination="DEL" DepartureTime="2021-08-25T07:00:00.000+05:30" ArrivalTime="2021-08-25T09:10:00.000+05:30" FlightTime="130" Distance="708" ProviderCode="1G" ClassOfService="S" /><AirSegment Key="S+xxet/pWDKAUNI0BAAAAA==" AvailabilitySource="S" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="1" Carrier="AI" FlightNumber="624" Origin="DEL" Destination="BOM" DepartureTime="2021-08-28T19:00:00.000+05:30" ArrivalTime="2021-08-28T21:15:00.000+05:30" FlightTime="135" Distance="708" ProviderCode="1G" ClassOfService="S" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="dzRLZmg2cHlHT2VGNkRYbg==" Key="dzRLZmg2cHlHT2VGNkRYbg==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKA+MI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKAUNI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
      }
      else{
        RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="31b90250-f6ae-44a8-91d0-29eab36f6257" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="'+segmentKey+'" AvailabilitySource="'+av_source+'" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="'+carrier+'" FlightNumber="'+flightNumber+'" Origin="'+origin+'" Destination="'+destination+'" DepartureTime="'+departure_time+'" ArrivalTime="'+arrival_time+'" FlightTime="'+flight_time+'" Distance="'+distance+'" ProviderCode="'+provider_code+'" ClassOfService="'+class_service+'" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="cHNFT0hkRXllMnlmUDdrSw==" Key="cHNFT0hkRXllMnlmUDdrSw==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="'+segmentKey+'" FareBasisCode="'+fareBasis+'"><PermittedBookingCodes><BookingCode Code="'+book_code+'" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
      }

      sails.log(RequestXML, 'RequestXML');

      request({
        method: 'POST',
        url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
        auth: {
          'username': FUser,
          'password': FPass,
         },
          multipart:[ { body:  RequestXML} ]
     
      }, function (error, response, body) {
  
        if (error) {
          sails.log(error, "error in our side");
          return res.send({ responseCode: 201, msg: 'Error while fetching flights, ' + error });
          
        }else{

          sails.log(body, 'body');

          var jsondata = parser.toJson(body);
          var jsondata = JSON.parse(jsondata);
           if(!jsondata["SOAP:Envelope"]){
             return res.send({ responseCode: 201, msg: 'Error while fetching flight pricing' + error });
           }
          var jsondata = jsondata["SOAP:Envelope"];
          if(!jsondata["SOAP:Body"]){
             return res.send({ responseCode: 201, msg: 'Error while fetching flight pricing' + error });
           }
          var jsondata = jsondata["SOAP:Body"];
           return res.send({ responseCode: 200, data:jsondata });
        }
       
      });

    },


    Search_Low_Fare_Flight: async (req, res) => {

      let arrival = req.body.arrival;
      let departure = req.body.departure;
      let flightDate = req.body.flightDate;
      //-----------------------------------
      let arrival_back = req.body.arrival_back;
      let departure_back = req.body.departure_back;
      let flightDate_back = req.body.flightDate_back;
      //----------------------------------------------
      let is_two_way = req.body.is_two_way;
      //-----------------------------------------------------------
      let ADT = req.body.ADT;
      let INF = req.body.INF;
      let CNN = req.body.CNN;

      var PassengerType = '<common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/>';


      if(ADT != 0 && INF!=0){
        PassengerType = '<common:SearchPassenger Code="ADT" BookingTravelerRef="ilay2SzXTkSUYRO+0owUNw=="/><common:SearchPassenger Code="INF" Age="01" PricePTCOnly="true" BookingTravelerRef="8hLudMvaTjOj4QViG7Dz2A=="/>';
      }


      if(is_two_way == true || is_two_way == 'true'){
         var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="'+FTargetBranch+'" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+departure+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+arrival+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate+'" /></air:SearchAirLeg><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+departure_back+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+arrival_back+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate_back+'" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers> '+PassengerType+' <air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
      }else{
         var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="'+FTargetBranch+'" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="'+departure+'" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="'+arrival+'" /></air:SearchDestination><air:SearchDepTime PreferredTime="'+flightDate+'" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers>'+PassengerType+'<air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
      }

      sails.log(RequestPay, 'request xml');

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
            sails.log(error, "error in our side");
            return res.send({ responseCode: 201, msg: 'Error while fetching flights, ' + error });
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