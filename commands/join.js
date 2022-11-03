const { joinVoiceChannel } = require('@discordjs/voice');
const { alone_in_voice } = require('./members.js');

function command_join(message)
{
    if (!alone_in_voice(message))
    {
        message.channel.send("Иди нахуй");
        return;
    }
    joinVoiceChannel(
    {
        channelId: message.member.voice.channelId,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    });
}

module.exports.command_join = command_join;