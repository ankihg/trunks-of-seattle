'use strict';

module.exports = (req, res, next) => {
  let jwt = require('jsonwebtoken');
  let models = require(__dirname + '/../models');
  let User = models.User;
  let decoded;

  try {
    decoded = jwt.verify(req.headers.token, process.env.APP_SECRET || 'change this');
  } catch (e) {
    return res.status(401).json({message: 'authorization error'})
  }

  User.findOne({_id: decoded.id}, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({message: 'authorization error'});
    }

    if (!user) {
      return res.status(401).json({message: 'authorization error'});
    }

    req.user = user;
    next();
  });
};