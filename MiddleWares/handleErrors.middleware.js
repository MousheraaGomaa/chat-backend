import { validationResult } from "express-validator";

const groupErrorsByField = (errorList) => (
    errorList.reduce((acc, { path, msg }) => {
        (acc[path] ||= []).push(msg);
        return acc;
    }, {

    }))


const handleValidationErrors = (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            status:'Failed',
            message:'Invalid Data',
            errors: groupErrorsByField(errors.array())
        });
    }
    next();
}


export {
    handleValidationErrors
}