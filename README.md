# nodejs-restapi-boilerplate
A boilerplate for a NodeJS Rest API Server

# HOW TO USER LOGGER

## Write log

The logger is made to read dynamicly the params you sent. So you just have to use the function Logger.writeLog

EX : 

``logger.writeLog({
                ip : ip,
                route : '/user/register',
                message: `Username : ${username} has been created!`,
                type: "API Call",
                level: "1"
            })``