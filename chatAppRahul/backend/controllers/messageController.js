// const Message = require('../Models/messageModel');
const User = require("../Models/userModel");
const MessageModel = require("../Models/messageModel");
const Chat = require("../Models/chatModel");
module.exports.sendMessage = async function (request, response) {
  const { content, chatId } = request.body;
  if (!content || !chatId) {
    console.log("invalid data send into the request");
    return response.sendStatus(400);
  }

  var newMessage = {
    sender: request.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await MessageModel.create(newMessage);
    message = await message.populate("sender", "pic name") ;
    message = await message.populate("chat") ;
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(request.body.chatId, {
      latestMessage: message,
    });
    response.json(message);
  } catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
};

module.exports.allMessages = async function (request, response) {
  try {
    console.log(request.params.chatId)
    const messages = await MessageModel.find({ chat: request.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    response.json(messages);  
  } catch (error) {
    response.status(400);
    console.log(error)
    throw new Error(error.message)
  } 
};
