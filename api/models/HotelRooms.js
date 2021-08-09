module.exports = {

    attributes: {

        hotel_id: {
            type: 'string',
            required: false
        },

        room_views: {
            type: 'json',
            required: false
        },

        image: {
            type: 'json',
            required: false
        },

        min_path: {
            type: 'string',
            defaultsTo: ''
        },

        room_type: {
            type: 'string',
            required: false
        },

        room_amenities: {
            type: 'json',
            required: false
        },

        price: {
            type: 'number',
            required: true
        },

        capacity: {
            type: 'number',
            required: false
        },

        size: {
            type: 'string',
            defaultsTo: ""
        },

        description: {
            type: 'string',
            required: false
        },

        bed_size: {
            type: 'string',
            required: false
        },

        quantity: {
            type: 'number',
            required: false
        },
        is_active: {
            type: 'boolean',
            defaultsTo: true
        },

    }

}