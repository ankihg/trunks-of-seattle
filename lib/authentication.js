'use strict';
module.exports = ()=>{
  let authorizationArray = req.headers.authorization.split(' ');
  let method = authorizationArray[0];
  let base64ed = authorization[1];
  let authArray = new Buffer(base64, 'base64').toString.split(':');
  let name = authArray[0];
  let password = authArray[1];
  let newUser = new User({name: name, password: password});
  newUser.save((err, data)=>{
    if(err){
      return res.json({msg: err});
    }
    res.json(data);
  });
};
