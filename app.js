const express = require('express');
const app = express();

const User = require("./controllers/users")

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(2525, () => {
    console.log("Server is ON")
})
