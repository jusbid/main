
module.exports = {

    attributes: {

        userId: {
            type: 'string',
            required: false
        },

        name: {
            type: 'string',
            required: true,
        },

        mobile: {
            type: 'string',
            required: true,
            unique: true
        },

        email: {
            type: 'string',
            columnType: 'citext',
            required: true,
            unique: true,
            isEmail: true,
            maxLength: 200
        },

        password: {
            type: 'string',
            required: true,
            description: 'Securely hashed representation of the user\'s login password.',
            protect: true,
            example: '2$28a8eabna301089103-13948134nad'
        },

        address: {
            type: 'string',
            required: false
        },

        branch_state: {
            type: 'string',
            required: false
        },

        branch_id: {
            type: 'string',
            required: true
        },

        lastSeenAt: {
            type: 'number',
            defaultsTo: 0,
        },

        is_deleted: {
            type: 'boolean',
            defaultsTo: false
        },

        createdBy: {
            type: 'string',
            defaultsTo: ''
        },

        updatedBy: {
            type: 'string',
            defaultsTo: ''
        },

    },

};
