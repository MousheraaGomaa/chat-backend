import { validationResult } from "express-validator";

const groupErrorsByField = (errorList) => (
    errorList.reduce((acc, { path, Msg }) => {
        (acc[path] ||= []).push(Msg);
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