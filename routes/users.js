const UserValidator = require("../controllers/users");
const Logger = require("../controllers/logger");
const UserModel = require("../models/users");
const logger = new Logger();
module.exports = (app) => {

    app.post("/user/register", async (req, res) => {

        const ip = req.ip;
        let log = {
            ip: ip,
            route: req.route.path
        };

        let username, password, email;
        if (req.body.account) {
            const account = req.body.account;
            username = account.username;
            password = account.password;
            email = account.email;
        } else {
            log = {
                ...log,
                message: "Required information are not valid!",
                type: "ERROR",
                level: "2"
            };
            res.send({
                success: false,
                message: "Required information are not valid!"
            })
        }

        const newUser = new UserValidator({
            username: username,
            password: password,
            email: email
        })
        const validateRegister = newUser.validateRegister();

        if (!validateRegister.error) {
            const emailCheck = await UserModel.findOne({
                $or: [{
                        "account.email": email
                    },
                    {
                        "account.username": username
                    },
                ]
            });
            console.log(emailCheck)
            if (!emailCheck) {
                const hashedPassword = await newUser.hashPassword();
                req.body.account.password = hashedPassword;
                const user = new UserModel(req.body);
                const saveUser = await user.save();

                if (saveUser != user) {
                    log = {
                        ...log,
                        message: `Cannot save : ${username} into the database!`,
                        type: "API Call || POST",
                        status: "FAILED",
                        level: "3"
                    };
                    res.send({
                        success: false,
                        message: `Cannot add : ${username} into the database!`
                    })
                } else {
                    log = {
                        ...log,
                        message: `Username : ${username} has been created under the ID : ${user._id}`,
                        type: "API Call || POST",
                        status: "SUCCESS",
                        level: "1"
                    };
                    res.send({
                        success: true,
                        message: `Username : ${username} has been created!`
                    })
                }
            } else {
                log = {
                    ...log,
                    message: `Email or username already use!`,
                    type: "API Call || POST",
                    status: "FAILED",
                    level: "3"
                };
                res.send({
                    success: false,
                    message: `Email or username already use!`
                })
            }


        } else {
            log = {
                ...log,
                message: validateRegister.message,
                type: "ERROR",
                level: "2"
            };
            res.send(validateRegister.message)
        }

        logger.writeLog(log)

    });

    app.post('/user/login', async (req, res, next) => {

        const logger = new Logger();
        const ip = req.ip;

        let log = {
            ip: ip,
            route: req.route.path
        };

        const {
            email,
            password,
            phone,
            username
        } = req.headers;

        const loginUser = new UserValidator({
            password: password,
            email: email,
            phone: phone
        })

        const informationValidate = (loginUser.validateStrongPassword() && (loginUser.validateEmail() || loginUser.isEmpty(username)));
        if (informationValidate) {
            const user = await UserModel.findOne({
                $or: [{
                        "account.email": email
                    },
                    {
                        "account.username": username
                    },
                ]
            });

            if (user) {

                const generateToken = loginUser.generateToken(user._id);

                const updateUser = await UserModel.updateOne({
                    _id: user._id
                }, generateToken);

                if (updateUser.nModified != 0) {

                    log = {
                        ...log,
                        message: `Login success : ${email || username}`,
                        type: "INVALID UPDATE",
                        level: "2"
                    };
                    res.send({
                        success: true,
                        "token": generateToken["access_token.token"],
                        "expire": generateToken["access_token.expire"],
                        "creation": generateToken["access_token.creation"]
                    })
                } else {
                    log = {
                        ...log,
                        message: `Cannot save the new token for user : ${email || username}`,
                        type: "LOGIN SUCCESS",
                        level: "2"
                    };
                    res.send({
                        success: false,
                        message: `Cannot save the new token! Please login again.`
                    })
                }
            } else {
                log = {
                    ...log,
                    message: `Wrong login informations!`,
                    type: "INVALID INFORMATIONS",
                    level: "2"
                };
                res.send({
                    success: false,
                    message: `Wrong login informations!`
                })
            }



        } else {
            log = {
                ...log,
                message: `Wrong login informations!`,
                type: "INVALID INFORMATIONS",
                level: "2"
            };
            res.send({
                success: false,
                message: `Wrong login informations!`
            })
        }

        logger.writeLog(log)
    })
}