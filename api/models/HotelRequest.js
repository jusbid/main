module.exports = {

    attributes: {

        bde_id: {
            type: 'string',
            required: false
        },
        hotelierId: {
            type: 'string',
            required: false
        },
        name: {
            type: 'string',
            required: false
        },
        plot_no: {
            type: 'string',
            required: false
        },
        street: {
            type: 'string',
            required: false
        },
        area: {
            type: 'string',
            required: false
        },
        address: {
            type: 'string',
            required: false
        },
        landmark: {
            type: 'string',
            required: false
        },
        city: {
            type: 'string',
            required: false
        },
        state: {
            type: 'string',
            required: false
        },
        zip: {
            type: 'number',
            required: false
        },
        country: {
            type: 'string',
            required: false,
            defaultsTo: 'IN'
        },
        email: {
            type: 'string',
            required: false
        },
        contact: {
            type: 'string',
            required: false
        },
        status: {
            type: 'string',
            defaultsTo: 'Processing'
        },
        statusNote: {
            type: 'string',
            required: false
        },
        is_deleted: {
            type: 'boolean',
            defaultsTo: false
        },

    },

};

