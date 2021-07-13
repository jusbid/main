
var fs = require('fs');
var async = require('async');


module.exports = {

    Get_Booking_Refunds: async (req, res) => {
        let AllRefunds = await Refunds.find({ }).sort("createdAt DESC");

        if (!AllRefunds) {
            return res.send({ responseCode: 201, msg: 'Refunds not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Refunds fetched successfully', data: AllRefunds });

        }

    },


    Get_Hotel_Booking_Refunds: async (req, res) => {
        let hotel_id = req.body.hotel_id;
        if(!hotel_id){
            return res.send({ responseCode: 201, msg: 'Hotel ID not found' });
        }
        let AllRefunds = await Refunds.find({ hotel_id:hotel_id }).sort("createdAt DESC");

        if (!AllRefunds) {
            return res.send({ responseCode: 201, msg: 'Refunds not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Refunds fetched successfully', data: AllRefunds });

        }

    },


    Get_User_Booking_Refunds: async (req, res) => {
        let userId = req.body.userId;
        if(!userId){
            return res.send({ responseCode: 201, msg: 'userId not found' });
        }
        let AllRefunds = await Refunds.find({ userId:userId }).sort("createdAt DESC");

        if (!AllRefunds) {
            return res.send({ responseCode: 201, msg: 'Refunds not found' });
        } else {
            return res.send({ responseCode: 200, msg: 'Refunds fetched successfully', data: AllRefunds });

        }

    },

    


}