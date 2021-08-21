module.exports = {

    attributes: {
  
        type:{
            type: "string",
            required:true   
        },

        data_string:{
            type: "string",
            required:false   
        },

        data_number:{
            type: "number",
            defaultsTo:0    
        },

        data_boolean:{
            type: "boolean",
            defaultsTo:false   
        },

        data_json:{
            type: "json",
            required:false   
        },
  
    },
  
  };
  