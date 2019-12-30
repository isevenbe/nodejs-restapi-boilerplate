class UserValidator {
    constructor({
        username,
        password,
        age,
        email,
        phone
    }) {
        this.username = username;
        this.password = password;
        this.age = age;
        this.email = email;
        this.phone = phone;
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

    hashPassword() {
        // Concat function for hashing password
    }
}

module.exports = UserValidator;

