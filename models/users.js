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
    },
    informations: {
        firstname: String,
        lastname: String,
        birthdate: Date.parse(),
        phone: Number
    }
});

module.exports = UsersModel = mongoose.model("users", Users);