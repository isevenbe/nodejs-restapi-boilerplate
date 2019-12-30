// Packages
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Controllers
const User = require("./controllers/users");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

//Routes
require("./routes/users")(app);

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        // LOGGER IF ERROR
    }
})();
app.listen(2525, () => {
    console.log("Server is ON")
})