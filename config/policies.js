module.exports.policies = {
  '*': 'is-logged-in',
  LoginController: {'*': true}

};
