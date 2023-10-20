// const mongoose = require('mongoose');

const {connect, connection} = require ('mongoose');

// Wrap Mongoose around local connection to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/userDB');
connect('mongodb://127.0.0.1:27017/userDB');

// Export connection
// module.exports = mongoose.connection;

module.exports = connection;
