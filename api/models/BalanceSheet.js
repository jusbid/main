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
        hotel_name: {
            type: 'string',
            required: false
        },
        total: {
            type: 'number',
            required: false
        },
        account_type: {
            type: 'string',
            required: false
        },
        grand_total: {
            type: 'number',
            required: false
        },
        expense: {
            type: 'number',
            required: false
        },
        bank_name: {
            type: 'string',
            required: false
        },
        bank_account: {
            type: 'string',
            required: false
        },
        cheque_no: {
            type: 'string',
            required: false
        },
        payment_type: {
            type: 'string',
            required: false
        },
        payment_through: {
            type: 'string',
            required: false
        },
        description: {
            type: 'string',
            required: false
        },
        start_date: {
            type: 'string',
            required: false
        },
        end_date: {
            type: 'string',
            required: false
        }

    }
}