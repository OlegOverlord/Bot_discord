const { Client, GatewayIntentBits } = require('discord.js');

const express = require('express');

const config = require("./config.json");

const { command_play } = require("./commands/play.js");
const { command_prefix } = require("./commands/prefix.js");

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
            var connection = joinVoiceChannel(
            {
                channelId: message.member.voice.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            //console.log(connection);
            break;

        case "play":
            command_play(message, args);
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