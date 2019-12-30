const UserValidator = require("../controllers/users");
const Logger = require("../controllers/logger");
const UserModel = require("../models/users");

module.exports = (app) => {
    
    app.post("/user/register", async (req, res, next) => {
        
        const logger = new Logger();
        const ip = req.ip
        let {
            username,
            password,
            email,
        } = req.body.account;

        const newUser = new UserValidator({
            username: username,
            password: password,
            email: email
        })
        const validateRegister = newUser.validateRegister();


        if (!validateRegister.error) {
            const hashedPassword = await newUser.hashPassword();
            req.body.account.password = hashedPassword;
            const user = new UserModel(req.body);
            user.save((err, succ) => {
                if(err) {
                    logger.writeLog({
                        ip : ip,
                        route : req.route.path,
                        message: `Cannot save : ${username} into the database!`,
                        type: "API Call || POST",
                        status : "FAILED",
                        level: "3",
                        writeType : "local" // TODO create database insert
                    })
                }
            })

            logger.writeLog({
                ip : ip,
                route : req.route.path,
                message: `Username : ${username} has been created under the ID : ${user._id}`,
                type: "API Call || POST",
                status : "SUCCESS",
                level: "1",
                writeType : "local" // TODO create database insert
            })
            res.sendStatus(200)
        } else {
            logger.writeLog({
                ip : ip,
                message: validateRegister.message,
                route : "/user/register",
                type: "ERROR",
                level: "9"
            })
            res.send(validateRegister.message)
        }

    })
}