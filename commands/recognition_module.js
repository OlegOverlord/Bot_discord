const vosk = require("vosk");
const model = new vosk.Model("./resources/model_debug/");

const { OpusEncoder } = require('@discordjs/opus');
const { getVoiceConnection } = require('@discordjs/voice');
const encoder = new OpusEncoder(48000, 1);

const config = require("../config.json");
const { same_voice } = require('./members.js');
const { perform_command } = require("../analyzer.js");

var listen = new Map();

function clear_recognize(audio, rec, connection, message, onData, onEnd, onVoiceStateUpdate)
{
    rec.free();
    audio.off("data", onData);
    audio.destroy();
    connection.receiver.speaking.off("end", onEnd);
    message.client.off("voiceStateUpdate", onVoiceStateUpdate);
    listen.delete(message.member.id);
}

async function command_recognize(message)
{
    if (listen.has(message.member.id))
    {
        var elem = listen.get(message.member.id)
        clear_recognize(elem[0], elem[1], elem[2], elem[3], elem[4], elem[5], elem[6]);
        message.channel.send("Прекратил слушать" + message.member.toString());
        return;
    }
    
    const rec = new vosk.Recognizer({model: model, sampleRate: 48000});
    var connection = getVoiceConnection(message.guild.id);

    async function onData(chunk)
    {
        var data = encoder.decode(chunk);
        rec.acceptWaveform(data);
    }

    function onEnd(id)
    {
        if (id != message.author.id)
            return;
        var speech = rec.partialResult().partial;
        if (speech == '' || !speech)
            return;
        var args = speech.split(' ');
        console.log(message.member.nickname + ": " + args);
        while (args.length > 0)
        {
            if (args.shift() === config.vprefix)
                break;
        }
        if (args.length != 0)
        {
            var command = args.shift();
            for (var key in config.recognition)
            {
                if (config.recognition[key] == command)
                {
                    command = key;
                    break;
                }
            }
            perform_command(message, command, args);
        }
        rec.reset();
    }

    function onVoiceStateUpdate()
    {
        if (same_voice(message))
            return;
        clear_recognize(audio, rec, connection, message, onData, onEnd, onVoiceStateUpdate);
        message.channel.send("Прекратил слушать" + message.member.toString());
    }

    var audio = connection.receiver.subscribe(message.member.id);
    connection.receiver.speaking.on("end", onEnd);
    audio.on("data", onData);
    message.client.on("voiceStateUpdate", onVoiceStateUpdate);
    listen.set(message.member.id, [audio, rec, connection, message, onData, onEnd, onVoiceStateUpdate]);
    message.channel.send("Слушаю " + message.member.toString());
}

module.exports.command_recognize = command_recognize;