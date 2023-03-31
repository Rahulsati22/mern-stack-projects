const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/full_stack_chat_app');
const connection = mongoose.connection;
connection.on('error', console.error.bind("error in connecting to mongodb"));
connection.once('open', function(){
    console.log('successfully connected to mongodb');
})
module.exports = mongoose;