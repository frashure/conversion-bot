const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const env = require('dotenv').config();
const sfd = require('./controllers/selectedfordev');
const ts = require('./controllers/troubleshoot');
const path = require('path');

let port = process.env.PORT || 3030;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.listen(port, () => {
    console.log('Conversion bot listening on port ' + port);
});

app.use('/selectedfordev', sfd.sfd, sfd.assign, sfd.updateTeam);
app.use('/troubleshoot', ts.troubleshoot);
app.use('/images', express.static(path.join(__dirname, 'images')));