const config = require("./config.json");

const { command_play, command_queue, command_skip } = require("./commands/player_module.js");
const { command_prefix } = require("./commands/prefix.js");
const { command_vprefix } = require("./commands/vprefix.js");
const { command_join } = require("./commands/join.js");
const { command_members } = require("./commands/members.js");
const { command_equal } = require('./commands/equal.js');

function perform_command(message, command, args)
{
    switch (command)
    {
        case "sum":
            var res = Number(args.shift()) + Number(args.shift());
            message.channel.send(res.toString());
            break;

        case "prefix":
            command_prefix(message, args);
            break;

        case "vprefix":
            command_vprefix(message, args);
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

        case "skip":
            command_skip(message);
            break;

        case "queue":
            command_queue(message);
            break;

        case "equal":
            command_equal(message, args);
            break;
    }
}

module.exports.perform_command = perform_command;