import express from 'express'
import { auth } from '../MiddleWares/auth.middleware.js';
import { multerUploadMessage } from '../Services/multer.js';
import { createMessage, deleteMessage, getMessages } from '../Controllers/message.controller.js';
import { createMessageValidator, deleteMessageValidator, getMessagesValidator } from '../Validators/message.validator.js';

const messageRouter = express.Router();

messageRouter.get('/:chatUserId', auth, getMessagesValidator, getMessages )
messageRouter.post('/:chatUserId', auth, multerUploadMessage, createMessageValidator, createMessage);
messageRouter.delete('/:id', auth, deleteMessageValidator, deleteMessage )



export default messageRouter;