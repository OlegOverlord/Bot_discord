const help = require("../help_note.json");

function command_help(message, args)
{
    var cur_help = help;
    while (args.length != 0 && cur_help != undefined)
        cur_help = cur_help[args.shift()];
    var msg;
    if (cur_help == undefined)
        msg = undefined;
    else
        msg = cur_help.general;
    if (msg == undefined)
        msg = "Бог тебе в помощь, я ничего не нашёл в справочнике";
    message.channel.send(msg);
}

module.exports.command_help = command_help;