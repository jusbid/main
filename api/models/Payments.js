module.exports = {

    attributes: {

        userId: {
            type: 'string',
            required: false
        },

        username:{
            type: 'string',
            required: false
        },

        bid_id: {
            type: 'string',
            required: false
        },

        hotel_id:{
            type: 'string',
            required: false
        },

        hotel_name:{
            type: 'string',
            required: false
        },

        type:{
            type: 'string',
            required: false
        },

        amount:{
            type: 'number',
            required: true
        },

        rzp_payment_id:{
            type: 'string',
            required: false
        },


        rzp_order_id:{
            type: 'string',
            required: false
        },

        rzp_signature:{
            type: 'string',
            required: false
        },

        rzp_payment_data:{
            type: 'json',
            defaultsTo: []
        },

        rzp_payment_status:{
            type: 'string',
            defaultsTo: ''
        },

        payment_via:{
            type: 'string',
            defaultsTo: ''
        },

        hotelier_tax_mismatch:{
            type: 'number',
            defaultsTo: 0
        },

        hotelier_is_paid:{
            type: 'boolean',
            defaultsTo: false
        },

        status:{
            type: 'string',
            defaultsTo: 'Pending'
        }



    }


}