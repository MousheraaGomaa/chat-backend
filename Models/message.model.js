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
        emun: Object.values(MESSAGE_TYPES)
    },
    reciverId:{
        type : ObjectId,
        require:true
    },
    senderId:{
        type: ObjectId,
        required: true
    },
    deleted:{
        type: Boolean,
        default: false
    }
},{
    timeStamps: true
})


const Message = mongoose.model( 'message', messageSchema );

export default Message;