const { getVoiceConnection } = require('@discordjs/voice');

function command_members(message)
{
    var bot = message.guild.members.me;
    if (bot.voice.channel === null)
    {
        message.channel.send("Я не в голосовом канале!");
        return
    }
    var members = bot.voice.channel.members;
    var msg = "Со мной в голосовом канале:";
    var i = 1;
    members.forEach((member) =>
    {
        msg += "\n" + i + ". " + member.toString();
        i++;
    });
    message.channel.send(msg);
}

function alone_in_voice(message)
{
    var connection = getVoiceConnection(message.guild.id);
    var bot = message.guild.members.me;
    if (bot.voice.channel === null || !connection)
        return true;
    return !(bot.voice.channel.members.size > 1);
}

function same_voice(message)
{
    var connection = getVoiceConnection(message.guild.id);
    if (!connection)
        return false;
    var bot = message.guild.members.me;
    var user = message.member;
    return (bot.voice.channelId == user.voice.channelId);
}

module.exports.command_members = command_members;
module.exports.alone_in_voice = alone_in_voice;
module.exports.same_voice = same_voice;