import { body, param } from 'express-validator'
import User from '../Models/user.model.js'
import { handleValidationErrors } from '../MiddleWares/handleErrors.middleware.js'

// const createIDchain = (property) => {
//     return body(property)
//             .trim()
//             .notEmpty().withMessage('Receiver ID is required')
//             .isMongoId().withMessage('Invalid ID format')
//             .custom(async (id) => {
//                 try {
//                     const user = await User.findById(id);
//                     if (user)
//                         return true;
//                     throw new Error('User Not Found')
//                 } catch (err) {
//                     throw new Error('User Not Found')
//                 }
//             })
// }


//validators
const createMessageValidator = [
   
    // validate receiver ID and check if exists
    body('receiverId')
            .trim()
            .notEmpty().withMessage('Receiver ID is required')
            .isMongoId().withMessage('Invalid ID format')
            .custom(async (id) => {
                try {
                    const user = await User.findById(id);
                    if (user)
                        return true;
                    throw new Error('Receiver Not Found')
                } catch (err) {
                    throw new Error('Receiver Not Found')
                }
            }),

    //Middleware to handle Express validation errors
    handleValidationErrors
]
const deleteMessageValidator = [
   
    // validate message ID 
    param('id')
        .trim()
        .notEmpty().withMessage('Message ID is required')
        .isMongoId().withMessage('Invalid ID format'),
    
    //Middleware to handle Express validation errors
    handleValidationErrors
]

const getMessagesValidator = [
    // validate receiver ID
    param('chatUserId')
    .trim()
    .notEmpty().withMessage('Chat user ID is required')
    .isMongoId().withMessage('Invalid ID format')
    .custom(async (id) => {
        try {
            const user = await User.findById(id);
            if (user)
                return true;
            throw new Error('Chat user Not Found')
        } catch (err) {
            throw new Error('Chat user Not Found')
        }
    }),
    
    //Middleware to handle Express validation errors
    handleValidationErrors
]
export {
    createMessageValidator,
    deleteMessageValidator,
    getMessagesValidator
}

