const { response } = require("express");

const controller = {

    troubleshoot: (req, res, next) => {

        console.log(req.body.webhookEvent);
        console.log(req.body.issue_event_type_name)


        // var events = req.body.issue.events;

        // for (i = 0; i < events.length; i++) {

        //     console.log(events[i]);

        // }

        res.status(200).send();

    }

}

module.exports = controller;