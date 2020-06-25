const fetch = require('node-fetch');
const request = require('request');

var payload = {
    "roomId": process.env.roomId,
    "text": "notification text",
    "attachments": [
        {
        "contentType": "application/vnd.microsoft.card.adaptive",
        "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "Image",
                                "style": "Person",
                                "url": 'http://jira.frashure.io/images/bug.png',
                                "size": "Medium",
                                "height": "50px"
                            }
                        ],
                        "width": "auto"
                    },
                    {
                        "type": "Column",
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Data Conversion Notification System",
                                "weight": "Lighter",
                                "color": "Accent"
                            },
                            {
                                "type": "TextBlock",
                                "weight": "Bolder",
                                "text": "Issue Selected for Development",
                                "horizontalAlignment": "Left",
                                "wrap": true,
                                "color": "Light",
                                "size": "Large",
                                "spacing": "Small"
                            }
                        ],
                        "width": "stretch"
                    }
                ]
            },
            {
                "type": "ColumnSet",
                "columns": [
                    {
                        "type": "Column",
                        "width": 35,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Issue Key:",
                                "color": "Light"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Value Stream:",
                                "weight": "Lighter",
                                "color": "Light",
                                "spacing": "Small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Issue Type:",
                                "weight": "Lighter",
                                "color": "Light",
                                "spacing": "Small"
                            }
                        ]
                    },
                    {
                        "type": "Column",
                        "width": 65,
                        "items": [
                            {
                                "type": "TextBlock",
                                "text": "Issue key goes here",
                                "color": "Light"
                            },
                            {
                                "type": "TextBlock",
                                "text": "None",
                                "color": "Light",
                                "weight": "Lighter",
                                "spacing": "Small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Bug",
                                "weight": "Lighter",
                                "color": "Light",
                                "spacing": "Small"
                            }
                        ]
                    }
                ],
                "spacing": "Padding",
                "horizontalAlignment": "Center"
            },
            {
                "type": "TextBlock",
                "text": "Issue summary goes here.",
                "wrap": true
            },
            {
                "type": "ActionSet",
                "horizontalAlignment": "Left",
                "spacing": "None",
                "actions": [
                    {
                        "type": "Action.OpenUrl",
                        "title": "View in JIRA",
                        "url": "http://google.com"
                    }
                ]
            }
        ]
        }
        }
    ]
    };

let url = 'https://webexapis.com/v1/messages';

let team = ["cfrashur", "vfelder", "mramelb", "dmeissne", "rgwilson", "tksmith"]

const controller = {


    sfd: (req, res, next) => {

        // var issue = req.body.issue.fields;
        // console.log(issue);

        // customfield_19100 << assigned project team


    switch(req.body.issue.fields.issuetype.name) {
        case 'Bug':
            payload.attachments[0].content.body[0].columns[0].items[0].url = 'https://jira.frashure.io/images/bug.png';
            break;
        case 'Story':
            payload.attachments[0].content.body[0].columns[0].items[0].url = 'https://jira.frashure.io/images/story.png'
            break;
        case 'Task':
            payload.attachments[0].content.body[0].columns[0].items[0].url = 'https://jira.frashure.io/images/task.png';
            break;
        case 'Project action item':
            payload.attachments[0].content.body[0].columns[0].items[0].url = 'https://jira.frashure.io/images/action_item.png';
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
            console.log(response.statusCode);
            console.log(postOptions.body);
            res.status(response.statusCode).send();
        }
        else if (response.statusCode !== 200) {
            console.log()
            console.log(response.statusMessage);
            res.status(response.statusCode);
            res.json(response.statusMessage);
        }
        else {
            res.status(response.statusCode);
            res.json(response.statusMessage);
        }
    })

    let assignee;
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
    }

    let putAssigneePayload = {
        "name": assignee
    };

    let credsBuffer = new Buffer(process.env.jiraCreds);
    let credsString = credsBuffer.toString('base64');

    let putAssigneeOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + credsString
            },
            body: JSON.stringify(putAssigneePayload)
        };



    } // end sfd function
}

module.exports = controller;