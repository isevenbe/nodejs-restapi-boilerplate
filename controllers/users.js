const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserValidator {
    constructor({
        username,
        password,
        age,
        email,
        phone,
        firstname,
        lastname
    }) {
        this.username = username;
        this.password = password;
        this.age = age;
        this.email = email;
        this.phone = phone;
        this.firstname = firstname;
        this.lastname = lastname;
    };

    validateRegister() {
        if (!!this.isEmpty(this.username, this.password, this.email)) {
            if (this.validateEmail()) {
                if (this.validateStrongPassword()) {
                    return {
                        error: false,
                        message: "Validation success"
                    }
                } else {
                    return {
                        error: true,
                        message: "Password validation error"
                    }
                }
            } else {
                return {
                    error: true,
                    message: "Email validation error"
                }
            }

        } else {
            return {
                error: true,
                message: "One or multiple arguments are empty"
            }
        }
    };

    validateStrongPassword() {
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        return strongRegex.test(this.password)
    };

    validateEmail() {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(String(this.email).toLowerCase());
    };

    isEmpty() {
        let flag = 0;
        const argsToArray = [...arguments];
        argsToArray.map((item) => {
            if (item === null || item === "" || typeof item === "undefined") {
                return;
            } else {
                flag++
            }
        })
        if (flag == argsToArray.length) {
            return true;
        } else {
            return false;
        }
    };

    async hashPassword() {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        return hashedPassword;
    }

    async comparePassword(password) {
        const comparePassword = await bcrypt.compare(this.password, password);
        return comparePassword;
    }

    generateToken(userid) {
        require('dotenv').config()
        const token = jwt.sign({ id: userid }, process.env.SECRET_JWT, {
            expiresIn: "7d" // expires in 24 hours
        });

        const creation = new Date();
        const expire = new Date();
        expire.setDate(creation.getDate() + 7);

        return {
            "access_token.expire" : expire,
            "access_token.creation" : creation,
            "access_token.token" : token
        }
    }
}

module.exports = UserValidator;

