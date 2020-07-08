// request module for making the HTTP request
const request = require('request');
// path module for building relative filepath
const path = require('path');
// import Webex card object
const payload = require('../resources/webexCard');

// url to Webex messages API; we send the Webex card (payload object) here
let url = 'https://webexapis.com/v1/messages';

// conversion dev team Atlassian usernames
let team = ["cfrashur", "vfelder", "mramelb", "dmeissne", "rgwilson", "tksmith"]

const controller = {

    // this function runs first - builds and sends Webex notification
    // then it passes the incoming req object to next()
    sfd: (req, res, next) => {

        // TODO: ensure assigned project team field is set to 'Conversion D&D'
        // customfield_19100 << assigned project team
        // << reporting project team

        // set proper icon URL based on incoming issue type
        switch(req.body.issue.fields.issuetype.name) {
            case 'Bug':
                payload.attachments[0].content.body[0].columns[0].items[0].url = path.join(__dirname, '../images/bug.png');
                break;
            case 'Story':
                payload.attachments[0].content.body[0].columns[0].items[0].url = path.join(__dirname, '../images/story.png');
                break;
            case 'Task':
                payload.attachments[0].content.body[0].columns[0].items[0].url = path.join(__dirname, '../images/task.png');
                break;
            case 'Project action item':
                payload.attachments[0].content.body[0].columns[0].items[0].url = path.join(__dirname, '../images/action_item.png');
                break;
        }

        // set issue key
        payload.attachments[0].content.body[1].columns[1].items[0].text = req.body.issue.key;

        // set value stream, if one exists
        if (req.body.issue.fields.components.length > 0) {
            payload.attachments[0].content.body[1].columns[1].items[1].text = req.body.issue.fields.components[0].name;
        }
        else {
            payload.attachments[0].content.body[1].columns[1].items[1].text = "None";
        }
        // set issue type
        payload.attachments[0].content.body[1].columns[1].items[2].text = req.body.issue.fields.issuetype.name;

        // set summary
        payload.attachments[0].content.body[2].text = req.body.issue.fields.summary;

        // set link
        payload.attachments[0].content.body[3].actions[0].url = 'https://alm.cgifederal.com/projects/browse/' + req.body.issue.key;

        let postOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.bot_token,
            },
            body: JSON.stringify(payload)
        };

        request.post(url, postOptions, (error, response, body) => {
            if (error) {
                console.log('Error: ' + error);
                res.status(response.statusCode).send();
            }
            // this should only catch 300 redirects
            else if (!(response.statusCode >= 200 && response.statusCode < 300)) {
                res.status(response.statusCode);
                res.json(response.statusMessage);
            }
            else {
                return next();
            }
        })
    }, // end sfd function

    assign: (req, res, next) => {

        let assignee;
        // check if component field is empty or if already assigned to dev team member
        if (req.body.issue.fields.components.length > 0 && !(team.includes(req.body.issue.fields.assignee))) {

            switch(req.body.issue.fields.components[0].name) {
                case 'R2R': assignee = team[0];
                break;
                case 'RA': assignee = team[1];
                break;
                case 'BF2E': assignee = team[2];
                break;
                case 'P2P':
                case 'A2D': assignee = team[3];
                break;
                case 'R2P': assignee = team[4];
                break;
                case 'GS':
                case 'B2C': assignee = team[5];
                break;
            }

            // this is all the assign API endpoints needs
            let putAssigneePayload = {
                "name": assignee
            };
            
            // encrypt Jira credentials; can't be sent in plain text, even over SSL/TLS
            let credsBuffer = new Buffer(process.env.jiraCreds);
            let credsString = credsBuffer.toString('base64');
        
            let putAssigneeOptions = {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + credsString
                    },
                    body: JSON.stringify(putAssigneePayload)
                };
        
            let assigneeURL = 'https://alm.cgifederal.com/projects/rest/api/latest/issue/' + req.body.issue.key + '/assignee';
    
            request.put(assigneeURL, putAssigneeOptions, (error, response, body) => {
                if (error) {
                    console.log('Error: ' + error);
                    console.log(response.statusCode);
                    res.status(response.statusCode).send();
                }
                else if (!(response.statusCode >= 200 && response.statusCode < 300)) {
                    res.status(response.statusCode);
                    res.json(response.statusMessage);
                }
                else {
                    return next();
                }
            });

        } 
        // else here means there's no component or issue is already assigned to dev team
        // pass request to next() and carry on
        else {
            return next();
        }
    }, //end assign

    updateTeam: (req, res, next) => {
        
        // encryp Jira credentials; cannot send plaintext, even over SSL/TLS
        let credsBuffer = new Buffer(process.env.jiraCreds);
        let credsString = credsBuffer.toString('base64');

        let updateTeamURL = 'https://alm.cgifederal.com/projects/rest/api/latest/issue/' + req.body.issue.key;

        // update Assigned Project Team
        let updateTeamPayload = {
            "fields": {
                "customfield_19100": {
                    "value": "Conversion D&D"
                }
            }
        };

        let updateTeamOptions = {
            method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + credsString
                    },
                    body: JSON.stringify(updateTeamPayload)
        };

        request.put(updateTeamURL, updateTeamOptions, (error, response, body) => {
            if (error) {
                console.log('Error: ' + error);
                console.log(response.statusCode);
                res.status(response.statusCode).send();
            }
            // this should only catch 300 redirects
            else if (!(response.statusCode >= 200 && response.statusCode < 300)) {
                res.status(response.statusCode);
                res.json(response.statusMessage);
            }
            // if this ever ceases to become final function in order
            // change this to return next()
            else {
                res.status(response.statusCode);
                res.json(response.statusMessage);
            }
        });
    }
}



module.exports = controller;