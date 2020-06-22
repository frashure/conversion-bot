const { response } = require("express");

const controller = {

    troubleshoot: (req, res, next) => {

        var events = req.body.events;

        for (i = 0; i < events.length; i++) {

            console.log(events[i]);

        }

        res.status(200).send();

    }

}

module.exports = controller;