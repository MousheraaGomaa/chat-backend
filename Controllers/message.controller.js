import Message from "../Models/message.model.js";
import { cloudinaryUpload, generateSignedUrl } from "../Services/cloudinary.js";
import AppErorr from "../Utils/app_error.js";
import { resetUnseenMgsCount, updateChatSummary } from "./chatSummary.controller.js";

const uploadFileToCloud = async (file) => {
  let type = file.mimetype.split("/")[0];
  if (type == "audio") type = "video";
  let path = `messages/${type}s`;
  const result = await cloudinaryUpload(file.buffer, type, path);
  if (!result) throw new Error("Failed to upload file");
  return result;
};

const customizeMessage = (message, userId) => {
  let signedUrl = "";
  if (message.messageType !== "text") {
    signedUrl = generateSignedUrl(message.content, message.messageType);
  }
  return {
    id: message._id,
    messageType: message.messageType,
    content: signedUrl || message.content,
    createdAt: message.createdAt,
    isSentByMe: message.senderId.toString() == userId,
  };
};

const createMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    let { receiverId, content } = req.body;

    let type = "text";
    // filePublicID = "";
    if (!content && !req.file)
      return res.status(400).json({ message: "Message Content is required" });

    if (req.file) {
      let result = await uploadFileToCloud(req.file);
      type = result.resource_type;
      // filePublicID = result.public_id;
      content = result.public_id;
    }
    const message = new Message({
      content,
      receiverId,
      messageType: type,
      // filePublicId: filePublicID,
      senderId,
    });

    const createdMessage = await message.save();
    
    const summary = await updateChatSummary( createdMessage );
    if (!summary)
      return res.status(201).json({
        status: "Faild",
        message: "Faild to update chat summary",
        data: customizeMessage(createdMessage, senderId),
      });
    res.status(201).json({
      status: "Success",
      message: "Your message has been added successfully!",
      data: customizeMessage(createdMessage, senderId),
    });
  } catch (err) {
    console.log(err);
    if (err instanceof AppErorr)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const messageId = req.params.id;

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
        senderId: userId,
        // $or:[{senderId: userId},{receiverId: userId}]
      },
      { deleted: true },
      { new: true }
    );
    if (!message)
      return res.status(404).json({
        status: "Failed",
        message: "Message not found.",
      });
    res.status(200).json({
      status: "Success",
      message: "The message has been successfully deleted!",
    });
  } catch (err) {
    if (err instanceof AppErorr)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatUserId = req.params.chatUserId;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: chatUserId },
        { senderId: chatUserId, receiverId: userId },
      ],
      deleted: false,
    })
      .select("-receiverId -__v -updatedAt -deleted ")
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg) => {
      return customizeMessage(msg, userId);
    });
    await resetUnseenMgsCount(userId, chatUserId);
    res.status(200).json({ status: "Success", data: formattedMessages });
  } catch (err) {
    if (err instanceof AppErorr)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

    res.status(500).json({
      status: "Failed",
      message: "Something went wrong",
    });
  }
};

export { createMessage, deleteMessage, getMessages };
