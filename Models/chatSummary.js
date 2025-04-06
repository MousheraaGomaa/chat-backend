import mongoose from "mongoose";
import { MESSAGE_TYPES } from "../Utils/enums.js";
const ObjectId = mongoose.Schema.Types.ObjectId;

const chatSummarySchema = new mongoose.Schema({
    senderId:{
        type: ObjectId,
        ref:'User',
        required: true
    },
    receiverId:{
        type: ObjectId,
        ref:'User',
        required: true
    },
    senderMsgCount:{
        type: Number,
        default:0
    },
    receiverMsgCount:{
        type: Number,
        default:0
    },
    lastMessage:{
        type:String,
        required:true
    },
    lastMessageDate:{
        type:Date,
        required:true
    },
    messageType:{
        type:String,
        required:true,
        enum:Object.values(MESSAGE_TYPES)
    }
});

const ChatSummary = mongoose.model('chatSummary',chatSummarySchema);

export default ChatSummary;