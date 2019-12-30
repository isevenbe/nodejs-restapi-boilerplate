const UserValidator = require("../controllers/users");
const Logger = require("../controllers/logger");
module.exports = (app) => {
    
    app.get("/user/register", (req, res, next) => {
        const logger = new Logger();
        const ip = req.ip
        const {
            username,
            password,
            email
        } = req.headers;
        console.log(username, password, email)

        const newUser = new UserValidator({
            username: username,
            password: password,
            email: email
        })
        const validateRegister = newUser.validateRegister();


        if (!validateRegister.error) {
            logger.writeLog({
                ip : ip,
                route : '/user/register',
                message: `Username : ${username} has been created!`,
                type: "API Call",
                level: "1",
                writeType : "local" // database
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