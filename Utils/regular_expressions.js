const EMAIL_REG = /^[\w-]+(\.[\w-]+)*@([a-zA-Z]+\w+\.)+[a-zA-Z]{2,}$/;
const PHONE_REG = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/;
const PASSWORD_REG = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z!@#$%^&*?\d]{8,12}$/
const CONFIRMATIONCOND_REG = /^\d{6}$/

export {
    PHONE_REG,
    EMAIL_REG,
    PASSWORD_REG,
    CONFIRMATIONCOND_REG
}