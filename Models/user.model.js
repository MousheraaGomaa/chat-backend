import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import {
    PHONE_REG, EMAIL_REG,
    PASSWORD_REG, CONFIRMATIONCOND_REG
} from "../Utils/regular_expressions.js";
import { USER_STATUSES } from '../Utils/enums.js';

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
        minLength: 8,
        maxLength: 12,
        required: true,
        match: PASSWORD_REG
    },
    phone: {
        type: String,
        unique: true,
        match: PHONE_REG,
    },
    about: {
        type: String,
        maxLength: 120
    },
    status: {
        type: String,
        enum: Object.values(USER_STATUSES),
        default: 'Offline'
    },
    confirmationCode: {
        type: Number,
        match: CONFIRMATIONCOND_REG
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    avatar: String,
    job: String,
    workingHours: String
});

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const saltRounds = +process.env.SALTROUND || 10;
            const salt = await bcrypt.genSalt(saltRounds) //why
            this.password = await bcrypt.hash(this.password, salt);
        }
        next()
    } catch (err) {
        next(err)
    }
})

const User = mongoose.model('user', userSchema);

export default User;
