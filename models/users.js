const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    account: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        origin: {
            type: String,
            enum: ['mobile', 'web', 'postman']
        }
    },
    access_token : {
        expire : Date,
        creation : Date,
        token : String
    },
    informations: {
        firstname: String,
        lastname: String,
        birthdate: Date.parse(),
        phone: Number
    }
});

module.exports = UsersModel = mongoose.model("users", Users);