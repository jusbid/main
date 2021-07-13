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

        description: {
            type: 'string',
            required: false
        },

        price: {
            type: 'number',
            required: false
        },

        is_active: {
            type: 'boolean',
            defaultsTo: true
        },


    }

}