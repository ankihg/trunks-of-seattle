'use strict';

module.exports = (mongoose, models) => {
  let UserSchema = mongoose.Schema({

  });

  let User = mongoose.model('User', UserSchema);
  models.User = User;
};