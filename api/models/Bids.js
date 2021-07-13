
module.exports = {

    attributes: {

        series:{
            type: 'string',
            required:true
        },

        hotel_id: {
            type: 'string',
            required:true
        },
        hotel_name: {
            type: 'string',
            required:true
        },
        userId: {
            type: 'string',
            required:true
        },
        firstname: {
            type: 'string',
            required:true
        },
        lastname: {
            type: 'string',
            required:false
        },
        email: {
            type: 'string'
        },
        rooms: {
            type: 'number',
            required:true
        },
        price: {
            type: 'number',
            required:true
        },
        taxClass: {
            type: 'number',
            required:false
        },
        add_on: {
            type: 'json',
            defaultsTo:[]
        },
        arrival_date: {
            type: 'string',
            required:true
        },
        departure_date: {
            type: 'string'
        },
        adult: {
            type: 'number',
            required:true
        },
        child: {
            type: 'number',
            required:false
        },
        room_type: {
            type: 'string',
            required:false
        },
        room_price: {
            type: 'number',
            required:true
        },
        days:{
            type: 'number',
            required:true
        },
        is_refundable:{
            type: 'boolean',
            defaultsTo:false
        },
        is_missed_sla_booking:{
            type: 'boolean',
            defaultsTo:false
        },
        reminders:{
            type: 'number',
            defaultsTo:0
        },
        is_booked:{
            type: 'boolean',
            defaultsTo:false
        },
        is_paid:{
            type: 'boolean',
            defaultsTo:false
        },
        reason: {
            type: 'string'
        },
        rzp_order_data:{
            type: 'json',
            defaultsTo: {}
        },
        status: {
            type: 'string'
        }
       

    }

}