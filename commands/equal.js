const config = require("../config.json");

function command_equal(message, args)
{
    switch (args.shift())
    {
        case "list":
            var msg = "Список голосовых эквивалентов:";
            var i = 1;
            for (var key in config.recognition)
            {
                msg += "\n" + i + ". " + key + " = " + config.recognition[key];
                i++;
            }
            message.channel.send(msg);
            break;
        case "set":
            var orig = args.shift();
            var equal = args.shift();
            if (!orig || !equal)
            {
                message.channel.send("Где продолжение? Для совсем идиотов пример: \'>equal set play сыграй\'");
                break;
            }
            config.recognition[orig] = equal;
            message.channel.send("Установлено: " + orig + " = \'" + config.recognition[orig] + "\'");
            break;
        default:
            console.log(config.vprefix);
            message.channel.send("Ахуеть, какой же ты тупой. Используй эту комманду с аргументами set... или list");
            break;
    }
}

module.exports.command_equal = command_equal;