const User = require('../models/userSchema');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');


//this function will help us to send the message
module.exports.sendMessage = async function (request, response) {
    try {
        const { content, chatId } = request.body;
        if (!content || !chatId) {
            return response.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        var newMessage = {
            sender: request.user._id,
            content: content,
            chat: chatId
        }

        let msg = await Message.create(newMessage);
        msg = await msg.populate("sender", "name email avatar");
        msg = await msg.populate("chat");
        await User.populate(msg, {
            path: 'chat.user',
            select: 'name avatar email'
        })

        console.log(msg);
        await Chat.findByIdAndUpdate(chatId, { latestMessage: msg })

        return response.status(200).json({
            success: true,
            message: msg
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// it will help us to fetch all messages of a chat 
module.exports.allMessages = async function (request, response) {
    try {
        const messages = await Message.find({
            chat: request.params.id
        }).populate("sender", "name avatar email").populate("chat");

         return response.status(200).json({
            success: true,
            messages 
        }) 

    } catch (error) {
        return response.status(500).json({
            success: false, 
            message: error.message
        })
    }
}