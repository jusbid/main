module.exports = {

    attributes: {

        hotel_id:{
            type: "string",
            required:true
        },

        hotel_name:{
            type: "string",
            required:true
        },

        hotel_state:{
            type: "string",
            required:true
        },

        hotel_city:{
            type: "string",
            required:true
        },

        booking_id:{
            type: "string",
            required:false
        },

        userId:{
            type: "string",
            required:false
        },

        username:{
            type: "string",
            required:false
        },

        useremail:{
            type: "string",
            required:false
        },

        usercontact:{
            type: "string",
            required:false
        },
  
        subject:{
            type: "string",
            required:true   
        },
  
        description:{
            type: "text",
            required:true   
        },

        images:{
            type: "json",
            required:false   
        },

        status:{
            type: "string",
            defaultsTo:"Processing"   
        },
  
    },
  
  };
  