const express = require('express');
const app = express();
const bodyparser = require('body-parser');
// dotenv used to configure environment variables
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

// primary route
app.use('/selectedfordev', sfd.sfd, sfd.assign, sfd.updateTeam);
// used only for troubleshooting/logging request body
app.use('/troubleshoot', ts.troubleshoot);
// static route to images directory, used on Webex card
app.use('/images', express.static(path.join(__dirname, 'images')));