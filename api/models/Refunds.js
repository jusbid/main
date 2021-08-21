module.exports = {

    attributes: {

        userId: {
            type: 'string',
            required: true
        },

        username: {
            type: 'string',
            required: false
        },

        booking_id:{
            type: 'string',
            required: true
        },

        booking_amount:{
            type: 'number',
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

        is_paid:{
            type: 'boolean',
            defaultsTo: false 
        },

        payment_id:{
            type: 'string',
            required: false
        },


    }

}