module.exports = {

    attributes: {

        gst_code:{
            type: "number",
            required:true   
        },
  
        gst_state:{
            type: "string",
            required:true   
        },

        gst_no:{
            type: "string",
            required:false   
        },

        gst_address:{
            type: "string",
            defaultsTo:""   
        },

        gst_city:{
            type: "string",
            defaultsTo:""   
        },
  
    },
  
  };
  