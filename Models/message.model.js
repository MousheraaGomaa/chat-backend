import mongoose from "mongoose";
import { MESSAGE_TYPES } from "../Utils/enums.js";

const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
    content :{
        type:String,
        required:true
    },
    messageType:{
        type: String,
        default:'text',
        emun: Object.values(MESSAGE_TYPES)
    },
    // filePublicId:{
    //     type:String
    // },
    receiverId:{
        type : ObjectId,
        ref:'User',
        required:true
    },
    senderId:{
        type: ObjectId,
        ref:'User',
        required: true
    },
    deleted:{
        type: Boolean,
        default: false
    }
} ,{ timestamps: true });


const Message = mongoose.model( 'message', messageSchema );

export default Message;