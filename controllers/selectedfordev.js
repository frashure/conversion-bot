const fetch = require('node-fetch');
const request = require('request');

let testData = {
    "id":2,
    "timestamp":1525698237764,
    "issue":{
       "id":"99291",
       "self":"https://jira.atlassian.com/rest/api/2/issue/99291",
       "key":"JRA-20002",
       "fields":{
          "summary":"I feel the need for speed",
          "created":"2009-12-16T23:46:10.612-0600",
          "description":"Make the issue nav load 10x faster",
          "labels":[
             "UI",
             "dialogue",
             "move"
          ],
          "priority":"Minor"
       }
    },
    "user":{
       "self":"https://jira.atlassian.com/rest/api/2/user?username=brollins",
       "name":"brollins",
       "key":"brollins",
       "emailAddress":"bryansemail at atlassian dot com",
       "avatarUrls":{
          "16x16":"https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
          "48x48":"https://jira.atlassian.com/secure/useravatar?avatarId=10605"
       },
       "displayName":"Bryan Rollins [Atlassian]",
       "active":"true"
    },
    "changelog":{
       "items":[
          {
             "toString":"A new summary.",
             "to":null,
             "fromString":"What is going on here?????",
             "from":null,
             "fieldtype":"jira",
             "field":"summary"
          },
          {
             "toString":"New Feature",
             "to":"2",
             "fromString":"Improvement",
             "from":"4",
             "fieldtype":"jira",
             "field":"issuetype"
          }
       ],
       "id":10124
    },
    "comment":{
       "self":"https://jira.atlassian.com/rest/api/2/issue/10148/comment/252789",
       "id":"252789",
       "author":{
          "self":"https://jira.atlassian.com/rest/api/2/user?username=brollins",
          "name":"brollins",
          "emailAddress":"bryansemail@atlassian.com",
          "avatarUrls":{
             "16x16":"https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
             "48x48":"https://jira.atlassian.com/secure/useravatar?avatarId=10605"
          },
          "displayName":"Bryan Rollins [Atlassian]",
          "active":true
       },
       "body":"Just in time for AtlasCamp!",
       "updateAuthor":{
          "self":"https://jira.atlassian.com/rest/api/2/user?username=brollins",
          "name":"brollins",
          "emailAddress":"brollins@atlassian.com",
          "avatarUrls":{
             "16x16":"https://jira.atlassian.com/secure/useravatar?size=small&avatarId=10605",
             "48x48":"https://jira.atlassian.com/secure/useravatar?avatarId=10605"
          },
          "displayName":"Bryan Rollins [Atlassian]",
          "active":true
       },
       "created":"2011-06-07T10:31:26.805-0500",
       "updated":"2011-06-07T10:31:26.805-0500"
    },
    "webhookEvent":"jira:issue_updated"
 };

let payload = {
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
                                "url": "https://developer.webex.com/images/webex-teams-logo.png",
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
                                "text": "Date:",
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
                                "text": "Epic:",
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
                                "text": "Aug 6, 2019",
                                "color": "Light"
                            },
                            {
                                "type": "TextBlock",
                                "text": "R2R",
                                "color": "Light",
                                "weight": "Lighter",
                                "spacing": "Small"
                            },
                            {
                                "type": "TextBlock",
                                "text": "Test-Epic",
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

let postOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.bot_token,
    },
    body: JSON.stringify(payload)
};

let url = 'https://webexapis.com/v1/messages';

const controller = {

    // let issueNo = testData.issue.key;
    // let summary = testData.issue.fields.summary;

 

    sfd: (req, res, next) => request.post(url, postOptions, (error, response, body) => {
        if (error) {
            console.log(error);
            console.log(response.statusCode);
            console.log(postOptions.body);
            res.status(response.statusCode).send();
        }
        else {
            console.log(body);
            console.log(response.statusCode);
            res.status(200).send();
        }
    })
}

module.exports = controller;



