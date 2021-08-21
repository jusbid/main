var async = require('async');

module.exports = {


    Save_And_Update_Coupon: async (req, res) => {

        let coupon_id = req.body.coupon_id;
        var CouponData;
        if(coupon_id){
            CouponData = await Coupons.update({ id: coupon_id,   hotel_id:req.body.hotel_id }).set({
                name:req.body.name,
                code:req.body.code,
                discount:req.body.discount,
                discount_by:req.body.discount_by,
                min_amount:req.body.min_amount,
                start_date:req.body.start_date,
                end_date:req.body.end_date,
                status:req.body.status
            });
        }else{
            CouponData = await Coupons.create({
                hotel_id:req.body.hotel_id,
                name:req.body.name,
                code:req.body.code,
                discount:req.body.discount,
                discount_by:req.body.discount_by,
                min_amount:req.body.min_amount,
                start_date:req.body.start_date,
                end_date:req.body.end_date,
            }).fetch();
        }
        if(CouponData){
            return res.send({ responseCode: 200, msg: 'coupon data added / updated successfully', data:CouponData });
        }else{
            return res.send({ responseCode: 201, msg: 'coupon not added'});
        }
    },

    Get_Hotel_Coupons: async (req, res) => {

        let HotelCoupons = await Coupons.find().where({ hotel_id: req.body.hotel_id }).sort('createdAt DESC');
        if (HotelCoupons.length!=0) {
            return res.send({ responseCode: 200, data: HotelCoupons, msg: 'Hotel Coupon Fetched' });
        } else {
            return res.send({ responseCode: 201, msg: 'Hotel Coupon not found' });
        }

    },


    



}