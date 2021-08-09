
module.exports = {

    attributes: {
  
      userId:{
        type:'string',
        required:false
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
  
      profile_img:{
        type:'string',
        defaultsTo:''
      },
  
      city:{
        type:'string',
        required:false
      },
  
      state:{
        type:'string',
        required:false
      },

      zone:{
        type:'json',
        defaultsTo:[] 
      },
  
      country:{
        type:'string',
        required:false
      },
  
      role:{
        type:'number',
        required:true
      },

      role_name:{
        type:'string',
        required:false
      },

      department:{
        type:'string',
        defaultsTo:''
      },

      status:{
        type:'string',
        defaultsTo:'Approved'
      },
  
      is_deleted:{
        type:'boolean',
        defaultsTo: false
      },
  
      createdBy:{
        type:'string',
        defaultsTo: 'India'
      },
  
      updatedBy:{
        type:'string',
        defaultsTo: ''
      },
  
    },
  
  };
  