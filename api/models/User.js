
module.exports = {

  attributes: {

    userId:{
      type:'string',
      required:false
    },

    company_name:{
      type:'string',
      required:false
    },

    firstname: {
      type: 'string',
      required: true,
    },

    lastname: {
      type: 'string',
      required: false,
    },

    mobile: {
      type: 'string',
      required: true,
      unique: true
    },

    landline: {
      type: 'string',
      required: false,
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

    gender:{
      type:'string',
      required:false
    },

    dob:{
      type:'string',
      required:false
    },

    profile_img:{
      type:'string',
      defaultsTo:''
    },

    house_no:{
      type:'string',
      required:false
    },

    address:{
      type:'string',
      required:false
    },

    landmark:{
      type:'string',
      required:false
    },

    street:{
      type:'string',
      required:false
    },

    area:{
      type:'string',
      required:false
    },

    city:{
      type:'string',
      required:false
    },

    zip:{
      type:'string',
      required:false
    },

    state:{
      type:'string',
      required:false
    },

    country:{
      type:'string',
      required:false
    },

    assigned_state:{
      type:'string',
      required:false
    },

    assigned_city:{
      type:'string',
      required:false
    },

    parent_bdm:{
      type:'string',
      required:false
    },

    parent_bde:{
      type:'string',
      required:false
    },

    hotel_id:{
      type:'string',
      required:false
    },

    role:{
      type:'number',
      required:true
    },

    pan:{
      type:'string',
      required:false
    },

    //------------------doc image link--------------

    aadhar_front:{
      type:'string',
      required:false
    },

    aadhar_back:{
      type:'string',
      required:false
    },

    pan_card_img:{
      type:'string',
      required:false
    },

    gst_cert:{
      type:'string',
      required:false
    },

    bank_proof:{
      type:'string',
      required:false
    },

    other:{
      type:'string',
      required:false
    },

    //------------------doc image link--------------

    gst_no:{
      type:'string',
      required:false
    },
    commission:{
      type:'number',
      required:false
    },

    resume:{
      type:'string',
      required:false
    },

    passwordResetToken: {
      type: 'string',
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
    },

    userToken:{
      type:'string',
      required:false
    },

    deviceToken:{
      type:'string',
      required:false
    },

    uuid:{
      type:'string',
      required:false
    },

    lastSeenAt: {
      type: 'number',
      defaultsTo: 0,
    },

    status:{
      type: 'string',
      defaultsTo:'Processing'
    },

    statusNote:{
      type:'string',
      required:false
    },

    is_deleted:{
      type:'boolean',
      defaultsTo: false
    },

    createdBy:{
      type:'string',
      defaultsTo: ''
    },

    updatedBy:{
      type:'string',
      defaultsTo: ''
    },

  },

};
