const express = require('express');
const app = express();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const cookie_parser = require('cookie-parser')
app.use(cookie_parser());
const bcryptjs = require('bcryptjs');
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
const mongooseConnection = require('./config/mongoose')
app.use(express.json({ extended: true }));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/message', require('./routes/messageRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
const server = app.listen(process.env.PORT, () => {
    console.log(`successfully running on port ${process.env.PORT}`)
})

const io = require('socket.io')(server, {
    // it will close the connection after 60 secs of unresponsiveness it is used to save the bandwidth
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on('connection', (socket) => {
    console.log('successfully connected to socket.io');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room)
    })

    socket.on('typing', (userId) => {
        socket.in(userId).emit("typing");
    })

    socket.on('stop typing', (userId) => {
        socket.in(userId).emit("stop typing");
    })

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.user) {
            console.log('chat.users not defined');
            return;
        }

        chat.user.forEach(user => {
            if (user._id === newMessageReceived.sender._id) {
                return;
            }
            socket.in(user._id).emit('message received', newMessageReceived);
        })
    })

    socket.off("setup", (userData) => {
        socket.leave(userData._id)
    })
})