const express = resquire('express');
const app = express();
const bodyparser = require('body-parser');
const env = require('dotenv').config();

let port = process.env.PORT || 3030;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.listen(port, () => {
    console.log('Conversion bot listening on port ' + port);
});

app.use('/selectedfordev', './controllers/selectedfordev.js')