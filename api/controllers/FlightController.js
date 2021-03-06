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
    //--------------------keys---------------------------------
    let is_two_way = req.body.is_two_way;

    let RequestXML = '';

    if (is_two_way == true || is_two_way == 'true') {
      RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="fbd6367e-1e7a-4138-8b1c-57628a36c50a" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="' + segmentKey + '" AvailabilitySource="' + av_source + '" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="' + carrier + '" FlightNumber="' + flightNumber + '" Origin="' + origin + '" Destination="' + origin + '" DepartureTime="' + departure_time + '" ArrivalTime="' + arrival_time + '" FlightTime="' + flight_time + '" Distance="' + distance + '" ProviderCode="' + provider_code + '" ClassOfService="' + class_service + '" /><AirSegment Key="S+xxet/pWDKAUNI0BAAAAA==" AvailabilitySource="S" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="1" Carrier="' + carrier_back + '" FlightNumber="' + flightNumber_back + '" Origin="' + origin_back + '" Destination="' + destination_back + '" DepartureTime="' + departure_time_back + '" ArrivalTime="' + arrival_time_back + '" FlightTime="' + flight_time_back + '" Distance="' + distance_back + '" ProviderCode="' + provider_code_back + '" ClassOfService="' + class_service_back + '" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="dzRLZmg2cHlHT2VGNkRYbg==" Key="dzRLZmg2cHlHT2VGNkRYbg==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="' + segmentKey + '" FareBasisCode="' + fareBasis + '"><PermittedBookingCodes><BookingCode Code="' + book_code + '"" /></PermittedBookingCodes></AirSegmentPricingModifiers><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKAUNI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
      //RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="fbd6367e-1e7a-4138-8b1c-57628a36c50a" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="S+xxet/pWDKA+MI0BAAAAA==" AvailabilitySource="P" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="AI" FlightNumber="864" Origin="BOM" Destination="DEL" DepartureTime="2021-08-25T07:00:00.000+05:30" ArrivalTime="2021-08-25T09:10:00.000+05:30" FlightTime="130" Distance="708" ProviderCode="1G" ClassOfService="S" /><AirSegment Key="S+xxet/pWDKAUNI0BAAAAA==" AvailabilitySource="S" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="1" Carrier="AI" FlightNumber="624" Origin="DEL" Destination="BOM" DepartureTime="2021-08-28T19:00:00.000+05:30" ArrivalTime="2021-08-28T21:15:00.000+05:30" FlightTime="135" Distance="708" ProviderCode="1G" ClassOfService="S" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="dzRLZmg2cHlHT2VGNkRYbg==" Key="dzRLZmg2cHlHT2VGNkRYbg==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKA+MI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers><AirSegmentPricingModifiers AirSegmentRef="S+xxet/pWDKAUNI0BAAAAA==" FareBasisCode="SIP"><PermittedBookingCodes><BookingCode Code="S" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
    }
    else {
      RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="f68fc9d9-8597-4a9e-a84c-c8cc5d650232" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="' + segmentKey + '" AvailabilitySource="' + av_source + '" Equipment="DH8" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="' + carrier + '" FlightNumber="' + flightNumber + '" Origin="' + origin + '" Destination="' + destination + '" DepartureTime="' + departure_time + '" ArrivalTime="' + arrival_time + '" FlightTime="' + flight_time + '" Distance="' + distance + '" ProviderCode="' + provider_code + '" ClassOfService="' + class_service + '"><CodeshareInfo OperatingCarrier="SG" /></AirSegment></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="b1RURGZ3QXBUcWhwNEhSdg==" Key="b1RURGZ3QXBUcWhwNEhSdg==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="' + segmentKey + '" FareBasisCode="' + fareBasis + '"><PermittedBookingCodes><BookingCode Code="' + book_code + '" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
      //RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirPriceReq xmlns="http://www.travelport.com/schema/air_v42_0" TraceId="31b90250-f6ae-44a8-91d0-29eab36f6257" AuthorizedBy="Travelport" TargetBranch="P7154556"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="uAPI" /><AirItinerary><AirSegment Key="'+segmentKey+'" AvailabilitySource="'+av_source+'" Equipment="32B" AvailabilityDisplayType="Fare Shop/Optimal Shop" Group="0" Carrier="'+carrier+'" FlightNumber="'+flightNumber+'" Origin="'+origin+'" Destination="'+destination+'" DepartureTime="'+departure_time+'" ArrivalTime="'+arrival_time+'" FlightTime="'+flight_time+'" Distance="'+distance+'" ProviderCode="'+provider_code+'" ClassOfService="'+class_service+'" /></AirItinerary><AirPricingModifiers InventoryRequestType="DirectAccess"><BrandModifiers ModifierType="FareFamilyDisplay" /></AirPricingModifiers><SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="ADT" BookingTravelerRef="cHNFT0hkRXllMnlmUDdrSw==" Key="cHNFT0hkRXllMnlmUDdrSw==" /><AirPricingCommand><AirSegmentPricingModifiers AirSegmentRef="'+segmentKey+'" FareBasisCode="'+fareBasis+'"><PermittedBookingCodes><BookingCode Code="'+book_code+'" /></PermittedBookingCodes></AirSegmentPricingModifiers></AirPricingCommand><FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Credit" /></AirPriceReq></soapenv:Body></soapenv:Envelope>';
    }

    sails.log(RequestXML, 'RequestXML');

    request({
      method: 'POST',
      url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
      auth: {
        'username': FUser,
        'password': FPass,
      },
      multipart: [{ body: RequestXML }]

    }, function (error, response, body) {

      if (error) {
        sails.log(error, "error in our side");
        return res.send({ responseCode: 201, msg: 'Error while fetching flights, ' + error });

      } else {

        sails.log(body, 'body');

        var jsondata = parser.toJson(body);
        var jsondata = JSON.parse(jsondata);
        if (!jsondata["SOAP:Envelope"]) {
          return res.send({ responseCode: 201, msg: 'Error while fetching flight pricing' + body });
        }
        var jsondata = jsondata["SOAP:Envelope"];
        if (!jsondata["SOAP:Body"]) {
          return res.send({ responseCode: 201, msg: 'Error while fetching flight pricing' + body });
        }
        var jsondata = jsondata["SOAP:Body"];
        return res.send({ responseCode: 200, data: jsondata });
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

    //var PassengerType = '<common:SearchPassenger Code="ADT" />';

    //--------------------------------------Set XML for Passengers---------------------------------------------
    var PassengerAdult = '';
    sails.log(ADT, 'ADT');
    for (var i = 0; i < ADT; i++) {
      if(PassengerAdult == ''){
        PassengerAdult = '<common:SearchPassenger Code="ADT" />';
      }else{
        PassengerAdult = PassengerAdult.concat('<common:SearchPassenger Code="ADT" />')
      }
      sails.log(PassengerAdult, 'PassengerAdult');
    }


    var PassengerINF = '';
    for (var i = 0; i < INF; i++) {
      PassengerINF = PassengerINF.concat('<common:SearchPassenger Code="INF" Age="01" />')
      sails.log(PassengerINF, 'PassengerINF');
    }

    var PassengerCNN = '';
    for (var i = 0; i < CNN; i++) {
      PassengerCNN = PassengerCNN.concat('  <common:SearchPassenger xmlns="http://www.travelport.com/schema/common_v42_0" Code="CNN" Age="10" DOB="2011-09-21" />')
      sails.log(PassengerCNN, 'PassengerCNN');
    }

    //-----------------------------------------------Append All Passenger XML---------------------------------------------------------
    var PassengerType = PassengerAdult.concat(PassengerINF);
    var PassengerType = PassengerType.concat(PassengerCNN);

    sails.log(PassengerType, 'PassengerType');

    if (is_two_way == true || is_two_way == 'true') {
      var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="' + FTargetBranch + '" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="' + departure + '" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="' + arrival + '" /></air:SearchDestination><air:SearchDepTime PreferredTime="' + flightDate + '" /></air:SearchAirLeg><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="' + departure_back + '" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="' + arrival_back + '" /></air:SearchDestination><air:SearchDepTime PreferredTime="' + flightDate_back + '" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers> ' + PassengerType + ' <air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
    } else {
      var RequestPay = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><air:LowFareSearchReq AuthorizedBy="AmbitionTravels" SolutionResult="false" TargetBranch="' + FTargetBranch + '" xmlns:air="http://www.travelport.com/schema/air_v50_0" TraceId="FBUAPI39283" xmlns:common="http://www.travelport.com/schema/common_v50_0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.travelport.com/schema/air_v50_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v50_0/AirReqRsp.xsd"><common:BillingPointOfSaleInfo OriginApplication="uAPI" /><air:SearchAirLeg><air:SearchOrigin><common:CityOrAirport Code="' + departure + '" /></air:SearchOrigin><air:SearchDestination><common:CityOrAirport Code="' + arrival + '" /></air:SearchDestination><air:SearchDepTime PreferredTime="' + flightDate + '" /></air:SearchAirLeg><air:AirSearchModifiers><air:PreferredProviders><common:Provider Code="1G" /></air:PreferredProviders></air:AirSearchModifiers>' + PassengerType + '<air:AirPricingModifiers ETicketability="Yes" FaresIndicator="AllFares" ></air:AirPricingModifiers></air:LowFareSearchReq></soapenv:Body></soapenv:Envelope>';
    }

    sails.log(RequestPay, 'request xml');

    request({
      method: 'POST',
      url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
      auth: {
        'username': FUser,
        'password': FPass,
      },
      multipart: [{ body: RequestPay }]

    }, function (error, response, body) {

      if (error) {
        sails.log(error, "error in our side");
        return res.send({ responseCode: 201, msg: 'Error while fetching flights, ' + error });
      } else {
        var jsondata = parser.toJson(body);
        var jsondata = JSON.parse(jsondata);
        if (!jsondata["SOAP:Envelope"]) {
          return res.send({ responseCode: 201, msg: 'Error while fetching flight details' + error });
        }
        var jsondata = jsondata["SOAP:Envelope"];
        if (!jsondata["SOAP:Body"]) {
          return res.send({ responseCode: 201, msg: 'Error while fetching flight details' + error });
        }
        var jsondata = jsondata["SOAP:Body"];
        return res.send({ responseCode: 200, data: jsondata });
      }

    });
  },



  TicketPNRGeneration: async (req, res) => {

    var AirPricingResData = '<AirPricingSolution xmlns="http://www.travelport.com/schema/air_v42_0" Key="+q1BLv/pWDKA1uQrEAAAAA==" TotalPrice="INR4758" BasePrice="INR3900" ApproximateTotalPrice="INR4758" ApproximateBasePrice="INR3900" Taxes="INR858" Fees="INR0"><AirSegment Key="+q1BLv/pWDKAxuQrEAAAAA==" OptionalServicesIndicator="false" AvailabilityDisplayType="Fare Specific Fare Quote Unbooked" Group="0" Carrier="UK" FlightNumber="627" Origin="DEL" Destination="UDR" DepartureTime="2021-09-30T13:20:00.000+05:30" ArrivalTime="2021-09-30T14:45:00.000+05:30" FlightTime="85" TravelTime="85" Distance="338" ProviderCode="1G" ClassOfService="O"><CodeshareInfo OperatingCarrier="UK" /></AirSegment><AirSegment Key="+q1BLv/pWDKAzuQrEAAAAA==" OptionalServicesIndicator="false" AvailabilityDisplayType="Fare Specific Fare Quote Unbooked" Group="0" Carrier="UK" FlightNumber="614" Origin="UDR" Destination="BOM" DepartureTime="2021-10-01T14:20:00.000+05:30" ArrivalTime="2021-10-01T16:00:00.000+05:30" FlightTime="100" TravelTime="100" Distance="388" ProviderCode="1G" ClassOfService="O"><CodeshareInfo OperatingCarrier="UK" /></AirSegment><AirPricingInfo PricingMethod="Auto" Key="+q1BLv/pWDKA4uQrEAAAAA==" TotalPrice="INR4758" BasePrice="INR3900" ApproximateTotalPrice="INR4758" ApproximateBasePrice="INR3900" Taxes="INR858" ProviderCode="1G"><FareInfo PromotionalFare="false" FareFamily="ECO LITE" DepartureDate="2021-09-30" Amount="" EffectiveDate="2021-09-18T11:24:00.000+05:30" Destination="UDR" Origin="DEL" PassengerTypeCode="ADT" FareBasis="OL8PYL" Key="+q1BLv/pWDKA+uQrEAAAAA=="><FareRuleKey FareInfoRef="+q1BLv/pWDKA+uQrEAAAAA==" ProviderCode="1G">6UUVoSldxwj1TOcDElJsy8bKj3F8T9EyxsqPcXxP0TLGyo9xfE/RMsuWFfXVd1OAly5qxZ3qLwOXLmrFneovA5cuasWd6i8Dly5qxZ3qLwOXLmrFneovAxSSc2iZATDNNAF/izIfuYdfHMK8e3nzhjWsHarFfV1MHH720OHU031SD5QULEHOHUO/fz0eoq3yPeaa1hxKRNmdekI6q2ql3jvQIlbeGa6Ahf6E18cRejF6+WRr8tqYPPqYvJ8trGakdBAjnYwuYaRW8vSBNa8ZUmwC02UUzMsn85EZM3zVwJJfr65lS02MgAy18Rb4CfU+v4Xvb2u1Qx+/he9va7VDH7+F729rtUMfv4Xvb2u1Qx+/he9va7VDHzQapDbCAMr/TUGWlPDKj6v0aMBFljDuP9NE5OQYAbQx30Z6sDvCVR1Wz0CkMKSO0ajTjdTfRhGNYGtwTXC7BL0=</FareRuleKey><Brand Key="+q1BLv/pWDKA+uQrEAAAAA==" BrandID="874911" Name="ECO LITE" Carrier="UK"><Title Type="External">ECO LITE</Title><Title Type="Short">ECOYL</Title><Text Type="ATPCO">//0B5/F/PRE RESERVED SEAT ASSIGNMENT//0BX/F/LOUNGEACCESS//0B3/F/MEAL SERVICES//0LF/F/PRIORITYBAGGAGE//0G6/F/PRIORITY BOARDING//0BW/F/PRIORITYCHECK IN//068/Z/CHANGE ANYTIME//06K/Z/REFUND BEFORE DEPARTURE//06L/Z/REFUNDAFTERDEPARTURE//058/Z/UPGRADE ELIGIBILITY//0M3/F/HANDBAGGAGE 7KG//0ML/F/EXCESS HAND BAGGAGE5KG//0C1/F/1 PC UPTO 15KG BAGGAGE//</Text><Text Type="MarketingConsumer">ECO LITE??? Complimentary beverage on board (tea/coffee) ??? 15 kg (1 piece only) Check-in Baggage Allowance ??? Hand Baggage included ??? Complimentary advance seat selection, select seats only ??? Buy-on-board light snacks  ??? No changes permitted  ??? No refunds permitted??? Please note that if the flight is operated by another airline then the onboard product or service maybe different to that described above.</Text><Text Type="MarketingAgent">ECO LITE ??? Complimentary beverage on board (tea/coffee) ??? 15 kg (1 piece only) Check-in Baggage Allowance  ??? Hand Baggage included ??? Complimentary advance seat selection, select seats only ??? Buy-on-board light snacks ??? No changes permitted ??? No refunds permitted ??? Please note that if the flight is operated by another airline then the onboard product or service maybe different to that described above.</Text><Text Type="Strapline">ECO LITE</Text><ImageLocation Type="Consumer" ImageWidth="1400" ImageHeight="800">https://cdn.travelport.com/vistara/UK_general_large_80634.jpg</ImageLocation><ImageLocation Type="Agent" ImageWidth="150" ImageHeight="150">https://cdn.travelport.com/vistara/UK_general_medium_80633.jpg</ImageLocation><OptionalServices><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKABvQrEAAAAA==" Type="Baggage" ServiceSubCode="0C1"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>1 Pc Upto 15Kg Baggage</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKADvQrEAAAAA==" Type="Baggage" ServiceSubCode="0GT"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 15Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAEvQrEAAAAA==" Type="Baggage" ServiceSubCode="0LX"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 20Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAFvQrEAAAAA==" Type="Baggage" ServiceSubCode="0NE"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 35Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAGvQrEAAAAA==" Type="Baggage" ServiceSubCode="0C8"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 40Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAHvQrEAAAAA==" Type="Baggage" ServiceSubCode="0FL"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Baggage 26 To 30Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKACvQrEAAAAA==" Type="Baggage" ServiceSubCode="0M3"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Baggage 7Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAIvQrEAAAAA==" Type="Baggage" ServiceSubCode="0L5"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Hand Baggage 2Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAJvQrEAAAAA==" Type="Baggage" ServiceSubCode="0ML"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Hand Baggage 5Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAKvQrEAAAAA==" Type="Baggage" ServiceSubCode="0MJ"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Bagagge 10Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKALvQrEAAAAA==" Type="Baggage" ServiceSubCode="0MR"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Baggage 12Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKAMvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="068"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Change Anytime</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKANvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="06K"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Refund Before Departure</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAPvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="06L"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Refund After Departure</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKAQvQrEAAAAA==" Type="PreReservedSeatAssignment" ServiceSubCode="0B5"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Vistara Select</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKARvQrEAAAAA==" Type="MealOrBeverage" ServiceSubCode="0B3"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Meal Services</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKASvQrEAAAAA==" Type="Lounge" ServiceSubCode="0BX"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Lounge Access</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKATvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0G6"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Boarding</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAUvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0BW"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Check In</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAOvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="058"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Upgrade Eligibility</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAVvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0LF"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Baggage Handling</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService></OptionalServices></Brand></FareInfo><FareInfo PromotionalFare="false" FareFamily="ECO LITE" DepartureDate="2021-10-01" Amount="INR1900" EffectiveDate="2021-09-18T11:24:00.000+05:30" Destination="BOM" Origin="UDR" PassengerTypeCode="ADT" FareBasis="OL8PYL" Key="+q1BLv/pWDKAWvQrEAAAAA=="><FareRuleKey FareInfoRef="+q1BLv/pWDKAWvQrEAAAAA==" ProviderCode="1G">6UUVoSldxwj1TOcDElJsy8bKj3F8T9EyxsqPcXxP0TLGyo9xfE/RMsuWFfXVd1OAly5qxZ3qLwOXLmrFneovA5cuasWd6i8Dly5qxZ3qLwOXLmrFneovAxSSc2iZATDNNAF/izIfuYdfHMK8e3nzhmUIAL9LtWTC46pybC7m1r1SD5QULEHOHUO/fz0eoq3yPeaa1hxKRNnBN0nkoinx/jvQIlbeGa6Ahf6E18cRejF6+WRr8tqYPPqYvJ8trGakdBAjnYwuYaRW8vSBNa8ZUmwC02UUzMsna8Sou6CUtbnpCEnA8hRfzAy18Rb4CfU+v4Xvb2u1Qx+/he9va7VDH7+F729rtUMfv4Xvb2u1Qx+/he9va7VDHzQapDbCAMr/TUGWlPDKj6v0aMBFljDuP9NE5OQYAbQx30Z6sDvCVR1Wz0CkMKSO0ajTjdTfRhGNYGtwTXC7BL0=</FareRuleKey><Brand Key="+q1BLv/pWDKAWvQrEAAAAA==" BrandID="874911" Name="ECO LITE" Carrier="UK"><Title Type="External">ECO LITE</Title><Title Type="Short">ECOYL</Title><Text Type="ATPCO">//0B5/F/PRE RESERVED SEAT ASSIGNMENT//0BX/F/LOUNGEACCESS//0B3/F/MEAL SERVICES//0LF/F/PRIORITYBAGGAGE//0G6/F/PRIORITY BOARDING//0BW/F/PRIORITYCHECK IN//068/Z/CHANGE ANYTIME//06K/Z/REFUND BEFORE DEPARTURE//06L/Z/REFUNDAFTERDEPARTURE//058/Z/UPGRADE ELIGIBILITY//0M3/F/HANDBAGGAGE 7KG//0ML/F/EXCESS HAND BAGGAGE5KG//0C1/F/1 PC UPTO 15KG BAGGAGE//</Text><Text Type="MarketingConsumer">ECO LITE  ??? Complimentary beverage on board (tea/coffee)  ??? 15 kg (1 piece only) Check-in Baggage Allowance ??? Hand Baggage included  ??? Complimentary advance seat selection, select seats only ??? Buy-on-board light snacks  ??? No changes permitted ??? No refunds permitted ??? Please note that if the flight is operated by another airline then the onboard product or service maybe different to that described above.</Text><Text Type="MarketingAgent">ECO LITE ??? Complimentary beverage on board (tea/coffee) ??? 15 kg (1 piece only) Check-in Baggage Allowance ??? Hand Baggage included ??? Complimentary advance seat selection, select seats only  ??? Buy-on-board light snacks ??? No changes permitted ??? No refunds permitted ??? Please note that if the flight is operated by another airline then the onboard product or service maybe different to that described above.</Text><Text Type="Strapline">ECO LITE</Text><ImageLocation Type="Consumer" ImageWidth="1400" ImageHeight="800">https://cdn.travelport.com/vistara/UK_general_large_80634.jpg</ImageLocation><ImageLocation Type="Agent" ImageWidth="150" ImageHeight="150">https://cdn.travelport.com/vistara/UK_general_medium_80633.jpg</ImageLocation><OptionalServices><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKAZvQrEAAAAA==" Type="Baggage" ServiceSubCode="0C1"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>1 Pc Upto 15Kg Baggage</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAbvQrEAAAAA==" Type="Baggage" ServiceSubCode="0GT"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 15Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAcvQrEAAAAA==" Type="Baggage" ServiceSubCode="0LX"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 20Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAdvQrEAAAAA==" Type="Baggage" ServiceSubCode="0NE"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 35Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAevQrEAAAAA==" Type="Baggage" ServiceSubCode="0C8"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Baggage Upto 40Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAfvQrEAAAAA==" Type="Baggage" ServiceSubCode="0FL"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Baggage 26 To 30Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKAavQrEAAAAA==" Type="Baggage" ServiceSubCode="0M3"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Baggage 7Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAgvQrEAAAAA==" Type="Baggage" ServiceSubCode="0L5"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Hand Baggage 2Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAhvQrEAAAAA==" Type="Baggage" ServiceSubCode="0ML"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Excess Hand Baggage 5Kg</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAivQrEAAAAA==" Type="Baggage" ServiceSubCode="0MJ"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Bagagge 10Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAjvQrEAAAAA==" Type="Baggage" ServiceSubCode="0MR"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Hand Baggage 12Kg</Description></ServiceInfo><EMD AssociatedItem="Chargeable Baggage" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKAkvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="068"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Change Anytime</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKAlvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="06K"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Refund Before Departure</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAnvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="06L"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Refund After Departure</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Included in the brand" Key="+q1BLv/pWDKAovQrEAAAAA==" Type="PreReservedSeatAssignment" ServiceSubCode="0B5"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Vistara Select</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Available for a charge" Key="+q1BLv/pWDKApvQrEAAAAA==" Type="MealOrBeverage" ServiceSubCode="0B3"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Meal Services</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAqvQrEAAAAA==" Type="Lounge" ServiceSubCode="0BX"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Lounge Access</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKArvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0G6"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Boarding</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAsvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0BW"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Check In</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAmvQrEAAAAA==" Type="Branded Fares" ServiceSubCode="058"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Upgrade Eligibility</Description></ServiceInfo></OptionalService><OptionalService AssessIndicator="MileageAndCurrency" Chargeable="Not offered" Key="+q1BLv/pWDKAtvQrEAAAAA==" Type="TravelServices" ServiceSubCode="0LF"><ServiceData xmlns="http://www.travelport.com/schema/common_v42_0" AirSegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" /><ServiceInfo xmlns="http://www.travelport.com/schema/common_v42_0"><Description>Priority Baggage Handling</Description></ServiceInfo><EMD AssociatedItem="Flight" /></OptionalService></OptionalServices></Brand></FareInfo><BookingInfo BookingCode="O" CabinClass="Economy" FareInfoRef="+q1BLv/pWDKA+uQrEAAAAA==" SegmentRef="+q1BLv/pWDKAxuQrEAAAAA==" HostTokenRef="+q1BLv/pWDKA2uQrEAAAAA==" /><BookingInfo BookingCode="O" CabinClass="Economy" FareInfoRef="+q1BLv/pWDKAWvQrEAAAAA==" SegmentRef="+q1BLv/pWDKAzuQrEAAAAA==" HostTokenRef="+q1BLv/pWDKA3uQrEAAAAA==" /><TaxInfo Amount="INR63" Category="IN" Key="+q1BLv/pWDKA5uQrEAAAAA==" /><TaxInfo Amount="INR208" Category="K3" Key="+q1BLv/pWDKA6uQrEAAAAA==" /><TaxInfo Amount="INR236" Category="P2" Key="+q1BLv/pWDKA7uQrEAAAAA==" /><TaxInfo Amount="INR91" Category="WO" Key="+q1BLv/pWDKA8uQrEAAAAA==" /><TaxInfo Amount="INR260" Category="YR" Key="+q1BLv/pWDKA9uQrEAAAAA==" /><PassengerType Code="ADT" BookingTravelerRef="QkttSVNSMzlUeEpGbDkwRA==" /></AirPricingInfo><HostToken xmlns="http://www.travelport.com/schema/common_v42_0" Key="+q1BLv/pWDKA2uQrEAAAAA==">GFB10101ADT00  01OL8PYL         YL                     010001#GFB200010101NADTV3302IN100030000299Q#GFMCEAP302NIN10 UK ADTOL8PYL</HostToken><HostToken xmlns="http://www.travelport.com/schema/common_v42_0" Key="+q1BLv/pWDKA3uQrEAAAAA==">GFB10101ADT00  02OL8PYL         YL                     010002#GFB200010102NADTV3302IN100040000299Q#GFMCEAP302NIN10 UK ADTOL8PYL</HostToken></AirPricingSolution>';

    //-----------------JSON AirPricing convert to XML-------------------------
    //var XML_Parsed_AirPricing = parser.toXml(AirPricingResData);


    //-------------------Attach Traveller Details------------------------------

    var TravellerData = '<BookingTraveler xmlns="http://www.travelport.com/schema/common_v42_0" Key="QkttSVNSMzlUeEpGbDkwRA==" TravelerType="ADT" Age="40" DOB="1981-09-18" Gender="M" Nationality="US"><BookingTravelerName Prefix="Mr" First="John" Last="Smith" /><DeliveryInfo><ShippingAddress Key="QkttSVNSMzlUeEpGbDkwRA=="><Street>Via Augusta 59 5</Street><City>Madrid</City><State>IA</State><PostalCode>50156</PostalCode><Country>US</Country></ShippingAddress></DeliveryInfo><PhoneNumber Location="DEN" CountryCode="1" AreaCode="303" Number="123456789" /><Email EmailID="johnsmith@travelportuniversalapidemo.com" /><SSR Type="DOCS" FreeText="P/GB/S12345678/GB/20JUL76/M/01JAN16/SMITH/JOHN" Carrier="UK" /><Address><AddressName>DemoSiteAddress</AddressName><Street>Via Augusta 59 5</Street><City>Madrid</City><State>IA</State><PostalCode>50156</PostalCode><Country>US</Country></Address></BookingTraveler>';

    var RequestXML = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Header/><soapenv:Body><AirCreateReservationReq xmlns="http://www.travelport.com/schema/universal_v42_0" TraceId="c1fc63aa-b3f3-4ece-a98e-2854ab5cb44b" AuthorizedBy="Travelport" TargetBranch="P7154556" ProviderCode="1G" RetainReservation="Both"><BillingPointOfSaleInfo xmlns="http://www.travelport.com/schema/common_v42_0" OriginApplication="UAPI" />    ' + TravellerData + '    <FormOfPayment xmlns="http://www.travelport.com/schema/common_v42_0" Type="Check" Key="1"><Check RoutingNumber="456" AccountNumber="7890" CheckNumber="1234567" /></FormOfPayment>  ' + AirPricingResData + '   <ActionStatus xmlns="http://www.travelport.com/schema/common_v42_0" Type="ACTIVE" TicketDate="T*" ProviderCode="1G" /><Payment xmlns="http://www.travelport.com/schema/common_v42_0" Key="2" Type="Itinerary" FormOfPaymentRef="1" Amount="INR4758" /></AirCreateReservationReq></soapenv:Body></soapenv:Envelope>';


    request({
      method: 'POST',
      url: 'https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService',
      auth: {
        'username': FUser,
        'password': FPass,
      },
      multipart: [{ body: RequestXML }]

    }, function (error, response, body) {

      if (error) {
        sails.log(error, "error in our side");
        return res.send({ responseCode: 201, msg: 'Error while fetching flights, ' + error });

      } else {
        sails.log(body, 'body');
        var jsondata = parser.toJson(body);
        var jsondata = JSON.parse(jsondata);

        return res.send({ responseCode: 200, data: jsondata });
      }
    });

  },

  Get_Airports: async (req, res) => {
    let airports = functions.Get_Airports();
    return res.send({ responseCode: 200, data: airports });
  },

  Get_Airlines: async (req, res) => {
    let airports = functions.Get_Airlines();
    return res.send({ responseCode: 200, data: airports });
  }


}