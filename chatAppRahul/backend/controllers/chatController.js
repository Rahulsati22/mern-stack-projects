const Chat = require('../Models/chatModel');
const User = require('../Models/userModel');
module.exports.accessChat = async function (request, response) {
    const userId = request.body.userId
    console.log("hello i am accesschat")
    if (!userId) {
        console.log('user doesnot exist');
        response.sendStatus(400);
        return;
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $all: [request.user._id] } },
            { users: { $all: [userId] } }
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name email pic"
    }
    )
    if (isChat.length > 0) {
        response.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [request.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            response.status(200).json(FullChat)
        } catch (error) {
            response.status(400);
            throw new Error(error.message)
        }
    }
}


// function for fetching all the chats of the user
module.exports.fetchChat = async function (request, response) {
    try {
        let allChats = await Chat.find({ users: { $all: [request.user._id] } }).
            populate("users", "-password").
            populate("groupAdmin", "-password").
            populate("latestMessage").
            sort({ updatedAt: -1 })
        allChats = await User.populate(allChats,
            {
                path: "latestMessage.sender",
                select: "name email pic"
            }
        )
        response.status(200).send(allChats);
        return;
    } catch (error) {
        // response.status(400);
        // throw new Error(error.message);
    }
}

module.exports.createGroupChat = async function (request, response) {
    if (!request.body.users || !request.body.name) {
        return response.status(400).send({ message: "Please fill all the fields" })
    }
    var users = JSON.parse(request.body.users);
    console.log(users);
    if (users.length < 2) {
        return response.status(400).send({ message: "More than 2 users are required to create group chat" })
    }
    users.push(request.user);
    try {
        const groupChat = await Chat.create({
            chatName: request.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: request.user,
        })
        const fullGroupChat = await Chat.find({ _id: groupChat._id }).
            populate("users", "-password").
            populate("groupAdmin", "-password");
        response.status(200).json(fullGroupChat);
    } catch (error) {
    };
}

module.exports.renameGroup = async function (request, response) {
    const { chatId, chatName } = request.body;
    const updateChat = await Chat.findByIdAndUpdate(chatId,
        {
            chatName: chatName
        },
        {
            new: true,
        }
    ).
        populate("users", "-password").
        populate("groupAdmin", "-password")
    if (!updateChat) {
        return response.status(400).send("Chat Not found");
    }
    else {
        return response.status(200).json(updateChat)
    }
}

// writing function to add to group
module.exports.addToGroup = async function (request, response) {
    const { chatId, userId } = request.body;
    const added = await Chat.findByIdAndUpdate(chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    ).
        populate("users", "-password").
        populate("groupAdmin", "-password");

    if (!added) {
        response.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        console.log(added);
        response.json(added);
    }
    // return response.json({name : "rahul sati"});
}

module.exports.deleteFromGroup = async function (request, response) {
    const { chatId, userId } = request.body;
    const deleted = await Chat.findByIdAndUpdate(chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    ).populate("users", "-password").populate("groupAdmin", "-password");
    console.log(deleted)
    if (!deleted) {
        response.status(404);
        throw new Error("Chat Not Found");
    }
    else {
        console.log(deleted);
        return response.json(deleted);
    }
}