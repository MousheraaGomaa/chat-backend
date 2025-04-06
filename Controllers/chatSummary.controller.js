import chatSummary from "../Models/chatSummary.js";
import AppErorr from "../Utils/app_error.js";

const updateChatSummary = async ({
  senderId,
  receiverId,
  content,
  createdAt,
  messageType,
}) => {
  try {
    const summary = await chatSummary.findOneAndUpdate(
      {
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      {
        $setOnInsert: {
          senderId,
          receiverId,
        },
        $set: {
          messageType,
          lastMessage: content,
          lastMessageDate: createdAt,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const isSender = summary.senderId.toString() === senderId.toString();
    if (isSender) summary.senderMsgCount++;
    else summary.receiverMsgCount++;

    await summary.save();
    return summary;
  } catch (err) {
    throw new AppErorr(`Failed to update chat summary:${err.message}`, 500);
  }
};

const resetUnseenMgsCount = async (userId, chatUserId) => {
  try {
    const summary = await chatSummary.findOne({
      $or: [
        { senderId: userId, receiverId: chatUserId },
        { senderId: chatUserId, receiverId: userId },
      ],
    });

    if (summary) {
      const isSender = userId.toString() == summary.senderId.toString();
      isSender ? (summary.receiverMsgCount = 0) : (summary.senderMsgCount = 0);
      await summary.save()
    }
  } catch (err) {
    throw new AppErorr(
      `Failed to reset unseen messages count summary:${err.message}`,
      500
    );
  }
};
export { updateChatSummary, resetUnseenMgsCount };
