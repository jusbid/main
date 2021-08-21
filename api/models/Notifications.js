module.exports = {

    attributes: {

        subject: {
            type: 'string',
            required: true
        },

        message: {
            type: 'text',
            required: true
        },

        userId: {
            type: 'string',
            required: false
        },

        role: {
            type: 'number',
            required: false
        },

        type: {
            type: 'string',
            required: false
        },

        is_active: {
            type: 'boolean',
            defaultsTo: true
        }


    }

}