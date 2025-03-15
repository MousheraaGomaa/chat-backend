import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { PHONE_REG, EMAIL_REG, PASSWORD_REG, CONFIRMATIONCOND } from "../Utils/regular_expressions.js";
import { USER_SATAUSES } from '../Utils/enums.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 20,
        minLength: 3,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [EMAIL_REG, 'Invalid Email Format']
    },
    password: {
        type: String,
        match: PASSWORD_REG
    },
    phone: {
        type: Number,
        unique: true,
        match: PHONE_REG,
    },
    about: {
        type: String,
        maxLength: 120
    },
    status: {
        type: String,
        emun: Object.values(USER_SATAUSES),
        default: 'Offline'
    },
    confirmationCode: {
        type: Number,
        match: CONFIRMATIONCOND
    },
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    // lastActiveDate: {
    //     type: Date
    // },
    avatar: String,
    job: String,
    workingHours: String
});

userSchema.pre('save', function (next) {

    if (this.password.isModified()) {
        bcrypt.genSalt(process.env.SALTROUND)
            .then((salt)=>{
                bcrypt.hash( this.password, salt )
                    .then(( hashedPassword )=>{
                        this.password =  hashedPassword;
                    })
                    .catch((err)=>{
                        throw new Error(err.message);
                    })
            })
            .catch((err)=>{
                throw new Error(err.message);
            });
    }
})

const User = mongoose.model('user', userSchema);

export {
    User
}
