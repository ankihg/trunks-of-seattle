'use strict';

module.exports = (router, models) => {
  let User = models.User;

  router.route('/login')
    .post((req, res) => {
      let authorizationArray = req.headers.authorization.split(' ');
      
    });
};
