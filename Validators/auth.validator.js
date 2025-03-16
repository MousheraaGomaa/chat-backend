import { body } from 'express-validator';
import { User } from '../Models/user.model.js';
import { EMAIL_REG, PASSWORD_REG } from '../Utils/regular_expressions.js';
import { handleValidationErrors } from '../MiddleWares/handleErrors.middleware.js';

const createEmailChain = () => {
    return body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .matches(EMAIL_REG).withMessage('Invalid email format')
}
const createPasswordChain = () => {
    return body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 12 })
        .withMessage('Password must be between 8 and 12 characters long')
        .matches(PASSWORD_REG)
        .withMessage('Passwords must contain at least one upper case letter, number, and special character');
}
const checkUniquenessChain = (property, { onSuccess, onFailure }) => {
    onSuccess = onSuccess?onSuccess:() =>(true);
    onFailure = onFailure?onFailure:() =>(true);

    return body(property)
        .custom(async (prop) => {
            const user = await User.findOne({ prop });
            if (!user) {
                onFailure();
            }
            else {
                onSuccess() ;
            }
        });
}

const throwError = (message) => {
    return () => {
        throw new Error(message);
    }
}


// auth validators

const registerValidator = [

    //Name Validation
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .matches(EMAIL_REG).withMessage('Invaild Email Format')
        .isLength({ min: 3, max: 20 }).withMessage('Name must be between 3 to 20 charactars long'),
    // Email Validation 
    createEmailChain(),
    // check email uniqueness
    checkUniquenessChain('email', {
        onSuccess: throwError('Email exists already'),
    }),
    // check  password
    createPasswordChain(),
    // check confirm password
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('ConfirmPassword is required')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword === req.body.password) {
                return true;
            }
            else {
                throw new Error('Make sure the password is the same as the confirmation password')
            }
        }),
    //Middleware to handle Express validation errors
    handleValidationErrors
]

const loginValidator = [
    // Email Validation 
    createEmailChain(),
    // check email uniqueness
    checkUniquenessChain('email', {
        onFailure: throwError('Email not found')
    }),
    //validate password  (chain function)
    createPasswordChain(),
    //Middleware to handle Express validation errors
    handleValidationErrors
]

const forgetPasswordValidator = [
    // Email Validation 
     createEmailChain(),
    // check email uniqueness
    checkUniquenessChain('email', {
        onFailure: throwError('Email not found')
    }),
    //Middleware to handle Express validation errors
    handleValidationErrors
]



export {
    loginValidator,
    registerValidator,
    forgetPasswordValidator
}
