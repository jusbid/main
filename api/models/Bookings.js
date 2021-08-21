
module.exports = {

    attributes: {

        series: {
            type: 'string',
            required: true
        },

        bid_id: {
            type: 'string',
            required: false
        },

        hotel_id: {
            type: 'string',
            required: true
        },
        hotel_name: {
            type: 'string',
            required: true
        },
        userId: {
            type: 'string',
            required: true
        },
        firstname: {
            type: 'string',
            required: true
        },
        lastname: {
            type: 'string',
            required: false
        },
        email: {
            type: 'string'
        },
        //new keys----------------------------
        is_agent_booking: {
            type: 'boolean',
            defaultsTo: false
        },
        customer_name: {
            type: 'string',
            defaultsTo: ""
        },
        customer_email: {
            type: 'string',
            required: false,
            unique: true,
            isEmail: true,
            maxLength: 200
        },
        customer_contact: {
            type: 'string',
            defaultsTo: ""
        },
        customer_address: {
            type: 'string',
            defaultsTo: ""
        },
        //new keys----------------------------
        rooms: {
            type: 'number'
        },
        price: {
            type: 'number',
            required: true
        },
        taxClass: {
            type: 'number',
            required: false
        },
        add_on: {
            type: 'json',
            defaultsTo: []
        },
        arrival_date: {
            type: 'string',
            required: true
        },
        departure_date: {
            type: 'string'
        },
        adult: {
            type: 'number',
            required: true
        },
        child: {
            type: 'number',
            required: false
        },
        room_type: {
            type: 'string',
            required: false
        },
        room_price: {
            type: 'number',
            required: true
        },
        days: {
            type: 'number',
            required: true
        },
        payment_id: {
            type: 'string',
            required: false
        },
        is_rated: {
            type: 'boolean',
            defaultsTo: false
        },
        // is_missed_sla_booking:{
        //     type: 'boolean',
        //     defaultsTo: false
        // },
        // is_refunded:{
        //     type: 'boolean',
        //     defaultsTo: false
        // },
        refund_id: {
            type: 'string',
            required: false
        },
        status: {
            type: 'string',
            defaultsTo: "Upcoming"
        },
        room_status:{
            type: 'string',
            defaultsTo: "checkin_pending"
        }
    }
}