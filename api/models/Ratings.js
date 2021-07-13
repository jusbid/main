module.exports = {

    attributes: {

        hotel_id: {
            type: 'string',
            required: true
        },
        userId: {
            type: 'string',
            required: true
        },
        booking_id: {
            type: 'string',
            required: true
        },
        rating:{
            type: 'number',
            required: false
        },
        value:{
            type: 'number',
            required: false
        },
        clean:{
            type: 'number',
            required: false
        },
        location:{
            type: 'number',
            required: false
        },
        service:{
            type: 'number',
            required: false
        },
        feedback:{
            type: 'string',
            required: false
        },
        is_active:{
            type: 'boolean',
            defaultsTo: false
        }



    }

}