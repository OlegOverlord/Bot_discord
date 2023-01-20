const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const config = require("../config.json");

const { player_init } = require("../commands/player_module.js");
const { command_recognize } = require("../commands/recognition_module.js");
const { perform_command } = require("./analyzer.js");
const { start_saver } = require("./saver.js");

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
start_saver();

client.on("messageCreate", (message) =>
{
    if (!message.content.startsWith(config.prefix)) return;

    var commandBody = message.content.slice(config.prefix.length);
    var args = commandBody.split(' ');
    var command = args.shift();

    while (command.length == 0 && args.length > 0)
        command = args.shift();

    perform_command(client, message, command, args);
    if (command == "recognize")
        command_recognize(client, message);
});

var app = express();

app.set('port', (process.env.PORT || 10804));

app.get('/', (request, response) => 
{
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), () => 
{
    console.log('App is running, server is listening on port ', app.get('port'));
});

client.login(config.token);