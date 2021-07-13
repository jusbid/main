
module.exports = {

  attributes: {

    userId:{
      type: 'string',
      required: true
    },

    bank_account_name: {
      type: 'string',
      required: true
    },

    bank_name: {
      type: 'string',
      required: true
    },

    account_no: {
      type: 'string',
      required: true
    },

    ifsc: {
      type: 'string',
      required: true
    },

    bank_branch: {
      type: 'string',
      required: true
    },

    account_type: {
      type: 'string',
      required: false
    },

    gst_no: {
      type: 'string',
      required: false
    },

    gst_state: {
      type: 'string',
      required: false
    },

  },

};

