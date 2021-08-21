module.exports = {

    UploadFile: async function (upload_file, upload_path){

        upload_file.upload({
            dirname: require('path').resolve(sails.config.appPath, upload_path)
          },function (err, uploadedFiles) {
            if (err) return res.serverError(err);
          
            return res.json({
              message: uploadedFiles.length + 'file(s) uploaded successfully!'
            });
        });

    }


   


}