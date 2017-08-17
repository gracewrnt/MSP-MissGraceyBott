/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";
var i = 0;
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));
// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1cc11270-1daf-404b-837e-2a3f0a9d097e?subscription-key=22f9a87f6a5947e5ace38fba33b18edc&timezoneOffset=0&verbose=true&q=';

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
    /*
    .matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
    */

.matches('Hi', (session, args) => {
    session.send('Hi! Do you feel depressed in this 2 weeks?');
})

.matches('Rude', (session, args) => {
    session.send('Calm down babe. Everything will be fine :)');
})

.matches('Yes', (session, args) => {
    if (i == 5) {
        session.send('I\'m very glad when I know you feel better :) Talk with me again when you feel sad');
    } else {
        session.send('Oh dear, You can tell me everything. Don\'t worry, It gonna be better.');
    }
})

.matches('ImFine', (session, args) => {
    session.send('I\'m glad to hear that :) If you feel sad, you can talk to me all the time\n\n -Gracey Bott-');
    i = 5;

})

.matches('ImDepressed', (session, args) => {
    session.send('Don\'t be sad ! After a storm comes a calm, just believe me :) Everything will be fine');
})

.matches('Thank', (session, args) => {
        session.send('I\'m happy when I know you feel better :) ');
    })
    //general

.matches('NiceToMeetYou', (session, args) => {
    session.send('Nice to meet you toooooo :)');
})

.matches('YourName', (session, args) => {
        session.send('My name is Gracey Bott.');
    })
    //general

.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}