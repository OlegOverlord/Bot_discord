const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const ytdl = require('ytdl-core');
const searchYoutube = require('youtube-api-v3-search');

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 10804));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

const config = require("./config.json");

const client = new Client(
{
    intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates, ]
});

var prefix = ">";

client.on("messageCreate", async function(message) 
{
    if (!message.content.startsWith(prefix)) return;

    var commandBody = message.content.slice(prefix.length);
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
            prefix = args.shift();
            message.channel.send("Установлен префикс \'" + prefix + '\'');
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

        case "list":
            var n = 1;
            var list = "Доступные аргументы к команде pistoletov:\n";
            fs.readdirSync("./resources/").forEach(file => {
                var name = file.split('.');
                list += n + ". " + name[0] + "\n";
                n++;
            });
            message.channel.send(list);
            break;

        case "play":
            var query = "";
            while (args.length > 0)
                query += " " + args.shift();
            if (query.length > 0)
                query = query.slice(1);
            var result = await searchYoutube(config.api_key, 
                {   
                    q: query,
                    part: 'snippet',
                    type: 'video',
                    maxResults: 1 
                });
            var url = "https://www.youtube.com/watch?v=" + result.items[0].id.videoId;
            console.log(url);
            if (ytdl.validateURL(url))
            {
                message.channel.send("По запросу \'" + query + "\' найдено: " + url);
                url = ytdl(url, { 
                    filter: 'audioonly', 
                    quality: 'highestaudio',
                    highWaterMark: 1 << 25 });
            }
            var player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            var connection = joinVoiceChannel(
            {
                channelId: message.member.voice.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            connection.subscribe(player);
            var resource = createAudioResource(url, {
                metadata: {
                    title: "play",
                },
            });
            player.play(resource);
            player.on('error', error => {
                message.channel.send("Плеер упал, а я нет!");
                console.log(url);
            });
            break;

        case "pistoletov":
            var name = "./resources/" + args.shift() + ".mp3";
            message.channel.send(name);
            var player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Pause,
                },
            });
            var connection = joinVoiceChannel(
            {
                channelId: message.member.voice.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            connection.subscribe(player);
            var resource = createAudioResource(name, {
                metadata: {
                    title: "Pistoletov",
                },
            });
            player.play(resource);
            break;
    }
});

client.login(config.token);