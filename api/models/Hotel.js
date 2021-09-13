module.exports = {

  attributes: {

    bdeId: {
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
    view_name: {
      type: 'string',
      required: false
    },
    description: {
      type: 'string',
      required: false
    },
    category: {
      type: 'string',
      required: false
    },
    star_rating: {
      type: 'string',
      required: false
    },
    image: {
      type: 'string',
      defaultsTo: ''
    },
    threesixty_view: {
      type: 'string',
      defaultsTo: ''
    },
    rating: {
      type: 'string',
      required: false
    },
    hotel_amenities: {
      type: 'json',
      defaultsTo: []
    },
    hotel_views: {
      type: 'json',
      defaultsTo: []
    },
    seasonal_months: {
      type: 'json',
      defaultsTo: []
    },
    downfall: {
      type: 'number',
      required: false
    },
    commission: {
      type: 'number',
      required: false
    },
    latitude: {
      type: 'string',
      required: false
    },
    longitude: {
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
    occupancy: {
      type: 'string',
      required: false
    },
    landline: {
      type: 'string',
      required: false
    },
    mobile: {
      type: 'string',
      required: false
    },
    email: {
      type: 'string',
      required: false
    },
    secondary_email: {
      type: 'string',
      required: false
    },
    owner_name: {
      type: 'string',
      required: false
    },
    owner_mobile: {
      type: 'string',
      required: false
    },
    owner_email: {
      type: 'string',
      required: false
    },
    manager_name: {
      type: 'string',
      required: false
    },
    manager_mobile: {
      type: 'string',
      required: false
    },
    manager_email: {
      type: 'string',
      required: false
    },
    exec_name: {
      type: 'string',
      required: false
    },
    exec_mobile: {
      type: 'string',
      required: false
    },
    exec_email: {
      type: 'string',
      required: false
    },
    fax: {
      type: 'string',
      required: false
    },
    total_rooms: {
      type: 'number',
      required: false
    },
    is_multichain: {
      type: 'boolean',
      defaultsTo: false
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

