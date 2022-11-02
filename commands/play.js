const config = require("../config.json");
const ytdl = require("ytdl-core");
const searchYoutube = require('youtube-api-v3-search');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

async function command_play(message, args)
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
    message.channel.send("По запросу \'" + query + "\' найдено: " + url);

    if (ytdl.validateURL(url))
    {
        var options;
        if (res.items[0].snippet.liveBroadcastContent != 'live')
        {
            options = 
            {
                filter: 'audioonly', 
                quality: 'highestaudio',
                highWaterMark: 1 << 25 
            };
        }
        else
        {
            options = 
            {
                liveBuffer: 4900,
                quality: 'lowestaudio',
                highWaterMark: 1 << 100,
            };
        }    
    }
    var stream = ytdl(url, options);
    var player = createAudioPlayer(
    {
        behaviors: 
        {
            noSubscriber: NoSubscriberBehavior.Pause,
        }
    });
    var connection = joinVoiceChannel(
    {
        channelId: message.member.voice.channelId,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });
    connection.subscribe(player);
    var resource = createAudioResource(stream, 
    {
        metadata: 
        {
            title: "play",
        }
    });
    player.play(resource);
    player.on('error', error => 
    {
        message.channel.send("Плеер упал, а я нет!");
        console.log(error);
    });
}

module.exports.command_play = command_play;