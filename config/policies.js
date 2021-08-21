module.exports.policies = {

  '*': 'is-logged-in',
  LoginController: {'*': true},
  FrontendController: {'*': true},
  UserController: {'CreateFrontUser': true, 'CreateUser': true},
  MasterController: {'HomePage':true},
  FlightController: {'*':true}
  //'user/login': true

};
