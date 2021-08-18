//  ---------SHA 1------------jusbid internal team---------------

let InternalToken = "25A540F768487C9EAD4EB06CEDFDE8DCD8B8261AE2E5E035F944979DF3CEA9F5";

module.exports = async function (req, res, proceed) {

  //  let Headers = req.headers;
  // // sails.log(Headers, 'Headers');
  //  // sails.log(Headers.jst, 'Headers JST');
  // //get JAT & JST--------------------------------------------------------------------
  // if(Headers.jat){
  //   //-----------set situation for admin-----------------------
  //   if(Headers.jst == "admin"){
  //     //-----Check if Token User Exists-------------------
  //     let TokenValid = functions2.CheckToken(Headers.jat);
  //     if(TokenValid && Headers.jpt == InternalToken){
  //       return proceed();
  //     }else{
  //       res.status(403);
  //       return res.json({
  //           error: 'Invalid Api Key'
  //       });
  //     }
  //   }else if(Headers.jst == "app_user" || Headers.jst == "app_bde" || Headers.jst == "app_hotelier"){

  //     sails.log('running app case');
  //     //-----------------Set for front Users------------------------
  //      //-----Check if Token User Exists-------------------
  //      let TokenValid = functions2.CheckToken(Headers.jat);
  //      if(TokenValid && Headers.jpt == InternalToken){
  //        return proceed();
  //      }else{
  //        res.status(403);
  //        return res.json({
  //            error: 'Invalid Access Token'
  //        });
  //      }

  //   }else{
  //     //return proceed();
  //     res.status(403);
  //     return res.json({
  //         error: 'Invalid Access Token'
  //     });
  //   }

  // }else{
  //   res.status(403);
  //       return res.json({
  //           error: 'Invalid Access Token'
  //       });
  // }


  return proceed();

};
