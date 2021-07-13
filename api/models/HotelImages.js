module.exports = {

  attributes: {

    hotel_id: {
      type: 'string',
      required: false
    },
    name: {
      type: 'string',
      required: false
    },
    path: {
      type: 'string',
      required: false
    },
    min_path: {
      type: 'string',
      required: false
    },
    is_active: {
      type: 'boolean',
      defaultsTo: true
    },

  }
}