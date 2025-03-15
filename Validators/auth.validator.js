import { body } from 'express-validator';
import { User } from '../Models/user.model.js';
import { PHONE_REG } from '../Utils/regular_expressions.js';
import { USER_STATUSES } from '../Utils/constants';
import { handleValidationErrors } from '../MiddleWares/handleErrors.middleware.js';

const updateUserValidator = [
    
    //Name Validation
    body('name')
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be string')
        .trim()
        .isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 to 20 charactars'),
    // Phone Validation 
    body('phone')
        .isLength({ min:11, max:11 }).withMessage('Phone must be Exactly 11 digit number')
        .matches(PHONE_REG).withMessage('Phone is invalid format')
        .custom( async(phone)=>{
            const user = User.findOne({ phone })
            if(user){
                throw new Error('Phone Already Exists');
            }
            return true;
        }),
    // check  status
    body('status')
        .isIn(Object.values(USER_STATUSES))
        .withMessage(`User status must be one of [${Object.values(USER_STATUSES)}]`),
   
     //check about
    body('about')
        .isLength({max:120})
        .withMessage('About must be at most 120 characters'),
        
    //Middleware to handle Express validation errors
    handleValidationErrors
]