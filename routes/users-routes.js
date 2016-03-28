'use strict';

module.exports = (router, models) => {
  let User = models.User;

  router.route('/users')
    .get((req, res) => {
      User.find({}, (err, users) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json({data: users});
      });
    })
    .post((req, res) => {
      var newUser = new User(req.body);
      newUser.save((err, user) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(user);
      });
    });

  router.route('/users/:user')
    .get((req, res) => {
      User.findById(req.params.user, (err, user) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(user);
      });
    })
    .put((req, res) => {
      User.findByIdAndUpdate(req.params.user, req.body, {new: true}, (err, user) => {
        if (err) {
          return res.send(err);
        }
        res.status(200).json(user);
      });
    })
    .delete((req, res) => {
      User.findByIdAndRemove(req.params.user, (err, user) => {
        res.status(200).json({message: 'Deleted User', data: user});
      });
    });
};
