const mongoose = require('mongoose');
 mongoose.connect('mongodb://127.0.0.1:27017/mernchatapp');
const connection = mongoose.connection;
connection.on('error', console.error.bind("error in connecting to mongodb"));
connection.once('open', () => {
    console.log('Successfully connected to mongodb');
})
module.exports = mongoose;