module.exports = {

    attributes: {

        name: {
            type: 'string',
            required: true
        },

        state: {
            type: 'string',
            required: true
        },

        city: {
            type: 'string',
            required: true
        },

        address: {
            type: 'string',
            required: false
        },

        GST: {
            type: 'string',
            required: false
        },

        email: {
            type: 'string',
            columnType: 'citext',
            required: true,
            unique: true,
            isEmail: true,
            maxLength: 200
        },

        phone: {
            type: 'string',
            required: false
        },

        branch_manager: {
            type: 'string',
            required: false
        },

        branch_manager_email: {
            type: 'string',
            required: false
        }

    }
}