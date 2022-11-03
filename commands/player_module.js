const config = require("../config.json");
const ytdl = require("ytdl-core");
const searchYoutube = require('youtube-api-v3-search');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
const { alone_in_voice, same_voice } = require('./members.js');
const { DiscordAPIError, Attachment } = require("discord.js");

var songsQueue = [];
var player, connection;

async function prepare_args(args)
{
    var query = "";
    while (args.length > 0)
        query += " " + args.shift();
    if (query.length > 0)
        query = query.slice(1);
    var res = await searchYoutube(config.api_key, 
    {   
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 1 
    });
    var url = "https://www.youtube.com/watch?v=" + res.items[0].id.videoId;
    var is_live = res.items[0].snippet.liveBroadcastContent == 'live';
    return [ query, url, is_live ];
}

async function queue_shift()
{
    if (songsQueue.length == 0)
        return;
    var q = songsQueue[0];
    var query = q[0];
    var url = q[1];
    var is_live = q[2];

    if (!ytdl.validateURL(url))
    {
        songsQueue.shift();
        queue_shift();
        return;
    }

    var options = 
    {
        filter: 'audioonly', 
        quality: 'highestaudio',
        highWaterMark: 1 << 25 
    };
    if (is_live)
    {
        options = 
        {
            liveBuffer: 4900,
            quality: 'lowestaudio',
            highWaterMark: 1 << 30,
        };
    }    

    console.log(options);
    var stream = ytdl(url, options);
    var resource = createAudioResource(stream, 
    {
        metadata: 
        {
            title: query,
        }
    });
    player.play(resource);
}

function player_init()
{
    player = createAudioPlayer(
    {
        behaviors: 
        {
            noSubscriber: NoSubscriberBehavior.Pause,
        }
    });
    player.addListener("stateChange", (oldOne, newOne) => 
    {
        if (newOne.status == "idle")
        {
            songsQueue.shift();
            queue_shift();
        }
    });
    player.on('error', error => 
    {
        console.log(error);
        songsQueue.shift();
        queue_shift();
    });
}

async function command_play(message, args)
{
    if (alone_in_voice(message) || (songsQueue.length == 0))
    {
        connection = joinVoiceChannel(
        {
            channelId: message.member.voice.channelId,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        songsQueue = [];
        var query = await prepare_args(args);
        songsQueue.push(query);
        message.channel.send(query[0] +  " => " + query[1]);
        connection.subscribe(player);
        queue_shift();
        return;
    }
    if (same_voice(message))
    {
        var query = await prepare_args(args);
        songsQueue.push(query);
        message.channel.send(query[0] +  " => " + query[1]);
    }
}

async function command_queue(message)
{
    var msg = "Список запросов:";
    for (var i = 0; i < songsQueue.length; i++)
        msg += "\n" + (i + 1) + ". " + songsQueue[i][0] +  " => <" + songsQueue[i][1] + ">";
    message.channel.send(msg);
}

module.exports.command_queue = command_queue;
module.exports.command_play = command_play;
module.exports.player_init = player_init;