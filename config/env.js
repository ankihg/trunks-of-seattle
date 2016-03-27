'use strict';

exports.PORT = process.env.PORT || 3000;
exports.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/db';

// TO-DO: replace mongodb with mongolab url