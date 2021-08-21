module.exports = {

    attributes: {

        hotel_id: {
            type: 'string',
            required: true
        },

        name: {
            type: 'string',
            required: true
        },

        code: {
            type: 'string',
            required: true
        },

        discount: {
            type: 'number',
            required: true
        },

        discount_by: {
            type: 'string',
            defaultsTo: 'A'
        },

        min_amount: {
            type: 'number',
            required: true
        },

        start_date: {
            type: 'string',
            required: true
        },

        end_date: {
            type: 'string',
            required: true
        },

        status:{
            type: 'boolean',
            defaultsTo: true
        }


    }


}