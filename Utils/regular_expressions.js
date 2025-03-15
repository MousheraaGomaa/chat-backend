const EMAIL_REG = /^[\w-]+(\.[\w-]+)*@([a-zA-Z]+\w+\.)+[a-zA-Z]{2,}$/;
const PHONE_REG = /^$/;
const PASSWORD_REG = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z!@#$%^&*?\d]{8,}$/
const CONFIRMATIONCOND = /^\d{6}$/

export {

    PHONE_REG,
    EMAIL_REG,
    PASSWORD_REG,
    CONFIRMATIONCOND
}