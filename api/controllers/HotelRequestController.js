var async = require('async');
var fs = require('fs');

module.exports = {


    CreateHotelRequest: async (req, res) => {

        let email_Check = await HotelRequest.findOne({
            email: req.body.email
        });

        if (email_Check) {
            return res.send({ responseCode: 201, data: {}, msg: 'Hotel with this email already exists..' });
        }

        if (!req.body.bdeId && !req.body.name && !req.body.city) {
            return res.send({ responseCode: 201, data: {}, msg: 'Please provide all mandatory details to add a hotel' });
        }

        let HotelData = await HotelRequest.create({
            name: req.body.name,
            address: req.body.address,
            landmark: req.body.landmark,
            city: req.body.city,
            state: req.body.state,
            email: req.body.email,
            contact: req.body.contact,
            plot_no: req.body.plot_no,

        }).fetch();

        if (HotelData) {
            NotificationsFunctions.HotelCreationNotification_BDM_BDE(req.body.bdeId, req.body.name);
        }

        return res.send({ responseCode: 200, msg: 'Hotel data saved successfully', data: HotelData });
    },

    GetHotelRequest: async (req, res) => {

        let HotelRequestData = await HotelRequest.find({}).sort('createdAt DESC');


        if (HotelRequestData) {
            return res.send({ responseCode: 200, msg: 'Hotel request data fetched successfully', data: HotelRequestData });
        }else{
            return res.send({ responseCode: 201, msg: 'Unable to find requests' });

        }

    },

    Send_Request_BDE:async (req, res) => {

        let bde_id = req.body.bde_id;
        let RequestId = req.body.request_id;

        if(!bde_id && !RequestId){
            return res.send({ responseCode: 201, msg: 'Please provide required parameters..' });
        }

        let UpdateRequest = await HotelRequest.updateOne({id:RequestId}).set({bde_id:bde_id, status:'Assigned'});

        let BDEData = await User.findOne({userId:bde_id});

        if(!BDEData){return res.send({ responseCode: 201, msg: 'BDE not found or deactivated by admin' });}

        BDEData.request = UpdateRequest;

        if (UpdateRequest) {
            mailer.sendHotelRequestBDE(BDEData);
            return res.send({ responseCode: 200, msg: 'Hotel request updated successfully', data: UpdateRequest });
        }else{
            return res.send({ responseCode: 201, msg: 'Unable to update request' });

        }

    },

}



