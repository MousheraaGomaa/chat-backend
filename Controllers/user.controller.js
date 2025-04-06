import { matchedData } from "express-validator";
import User from "../Models/user.model.js";
import { cloudinaryUpload, generateSignedUrl } from "../Services/cloudinary.js";
import AppErorr from "../Utils/app_error.js";
const customizeUsers = (users) => {
  return users.map(({ avatar, chatSummary, ...user }) => {
    let isSender = user._id.toString() === chatSummary.senderId.toString();
    return {
      ...user,
      avatar: avatar ? generateSignedUrl(avatar, "image") : "",
      chatSummary: chatSummary
        ? {
            lastMessage:
              chatSummary.messageType == "text"
                ? chatSummary.lastMessage
                : generateSignedUrl(
                    chatSummary.lastMessage,
                    chatSummary.messageType
                  ),
            messageType: chatSummary.messageType,
            lastMessageDate: chatSummary.lastMessageDate,
            unseenMsgCount: isSender
              ? chatSummary.senderMsgCount
              : chatSummary.receiverMsgCount,
          }
        : null,
    };
  });
};

const updateProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const userData = matchedData(req);
    if (req.file) {
      let path = `users/avatar`;
      const result = await cloudinaryUpload(req.file.buffer, "image", path);
      if (!result) throw new Error("Failed to upload file");
      userData.avatar = result.public_id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    });

    if (!updatedUser)
      return res.status(404).json({
        status: "Failed",
        message: "User not found.",
      });
    res.status(200).json({
      status: "Success",
      message: "The user profile has been successfully updated!",
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

const getAllUsers = async (req, res) => {
  try {
    const id = req.user._id;
    const usersWithLastMessage = await User.aggregate([
      {
        $match: {
          _id: { $ne: id },
        },
      },
      {
        $lookup: {
          from: "chatsummaries",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$senderId", "$$userId"] },
                    { $eq: ["$receiverId", "$$userId"] },
                  ],
                },
              },
            },
          ],
          as: "chatSummary",
        },
      },
      {
        $addFields: {
          chatSummary: { $arrayElemAt: ["$chatSummary", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          status: 1,
          avatar: 1,
          chatSummary: 1,
        },
      },
    ]);

    res.status(200).json({
      data: customizeUsers(usersWithLastMessage),
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

export { updateProfile, getAllUsers };
