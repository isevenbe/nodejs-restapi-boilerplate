const express = require('express');
const app = express();


// Controllers
const User = require("./controllers/users");

//Routes
require("./routes/users")(app);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(2525, () => {
    console.log("Server is ON")
})
