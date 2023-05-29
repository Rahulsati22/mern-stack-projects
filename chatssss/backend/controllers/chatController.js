/*
*this will require the following things users, chatName, groupAdmin, isGroupChat, latestMessage of the chat
*/
const Chat = require('../models/chatModel')
const User = require('../models/userSchema')
const LatestMessage = require('../models/messageModel')
// In this we will access a particular chat if it is present and if it is not present we will create it
module.exports.accessChat = async function (request, response) {
    const userId = request.body.userId;
    if (!userId) {
        return response.status(400).json({
            success: "false",
            message: "Please login first"
        })
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { user: { $all: [request.user._id] } },
            { user: { $all: [userId] } }
        ]
    }).populate("user", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name avatar email"
    })

    if (isChat.length > 0) {
        return response.status(200).json({
            isChat: isChat[0]
        })
    }

    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            user: [request.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const isChat = await Chat.findOne({ _id: createdChat._id }).populate("user", "-password");
            return response.status(200).json({
                success: true,
                isChat
            })
        } catch (error) {
            return response.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}


// In this we will fetch all the chats of the user
module.exports.fetchChat = async function (request, response) {
    try {
        let allChats = await Chat.find({ user: { $all: [request.user._id] } }).populate("latestMessage").populate("user", "-password").populate("groupAdmin", "-password").sort({
            updatedAt: -1
        })
        allChats = await User.populate(allChats, {
            path: "latestMessage.sender",
            select: "name avatar email"
        })
        response.status(200).json({
            success: true,
            allChats
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

 // this model will help us to create group chat
module.exports.createGroupChat = async function (request, response) {
    try {
        if (!request.body.chatName || !request.body.users) {
            return response.status(400).json({
                success: false,
                message: "chatName and atleast 3 users are required"
            })
        }
        var userArray = JSON.parse(request.body.users);
        console.log(typeof (userArray[0]));
        if (userArray.length < 2) {
            return response.status(400).json({
                success: false,
                message: "Atleast 3 users are required"
            })
        }
        userArray.push(request.user._id);
        const groupChat = await Chat.create({
            chatName: request.body.chatName,
            isGroupChat: true,
            user: userArray,
            groupAdmin: request.user._id,
        })

        const fullGroupChat = await Chat.find({ _id: groupChat._id }).populate('user', '-password').populate('groupAdmin', '-password');
        return response.status(200).json({
            success: true,
            fullGroupChat
        })

    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// this function will help us to rename the group
module.exports.renameGroup = async function (request, response) {
    try {
        const { chatId, chatName } = request.body;
        const updateChat = await Chat.findByIdAndUpdate(chatId, {
            chatName: chatName,
        },
            {
                // it will return the updated chat
                new: true,
            }).populate("user", '-password').populate('groupAdmin', '-password')

        if (!updateChat) {
            return response.status(400).json({
                success: false,
                message: "Cannot update the Chat"
            })
        }
        else {
            return response.status(200).json({
                success: true,
                updateChat
            })
        }
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// it will help us to add user to the the group
module.exports.addToGroup = async function (request, response) {
    try {
        const { chatId, userId } = request.body;
        const chat = await Chat.findByIdAndUpdate(chatId, {
            $push: { user: userId }
        },
            {
                new: true
            }).populate("user", '-password').populate('groupAdmin', '-password');

        if (!chat) {
            return response.status(400).json({
                success: false,
                message: "User cannot be added"
            })
        }
        return response.status(200).json({
            success: true,
            chat
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }

}

// it will help us to remove user from the group
module.exports.deleteFromGroup = async function (request, response) {
    try {
        const { chatId, userId } = request.body;
        const deleted = await Chat.findByIdAndUpdate(chatId, {
            $pull: { user: userId }
        },
            {
                new: true,
            }).populate("user", '-password').populate('groupAdmin', '-password');
        if (!deleted) {
            return response.status(404).json({
                success: false,
                message: "User cannot be removed"
            })
        }
        return response.status(200).json({
            success: true,
            deleted
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
}