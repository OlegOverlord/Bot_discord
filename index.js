const { Client, GatewayIntentBits } = require('discord.js');

const express = require('express');

const config = require("./config.json");

const { command_play, player_init, command_queue } = require("./commands/player_module.js");
const { command_prefix } = require("./commands/prefix.js");
const { command_join } = require("./commands/join.js");
const { command_members } = require("./commands/members.js");

const client = new Client(
{
    intents: 
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, 
    ]
});

player_init();

client.on("messageCreate", function(message) 
{
    if (!message.content.startsWith(config.prefix)) return;

    var commandBody = message.content.slice(config.prefix.length);
    var args = commandBody.split(' ');
    var command = args.shift();

    while (command.length == 0 && args.length > 0)
        command = args.shift();

    switch (command)
    {
        case "sum":
            var res = Number(args.shift()) + Number(args.shift());
            message.channel.send(res.toString());
            break;

        case "prefix":
            command_prefix(message, args);
            break;

        case "join":
            command_join(message);
            break;

        case "members":
            command_members(message);
            break;

        case "play":
            command_play(message, args);
            break;

        case "queue":
            command_queue(message);
            break;
    }
});

var app = express();

app.set('port', (process.env.PORT || 10804));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

client.login(config.token);