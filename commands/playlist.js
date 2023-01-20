const file = require("../playlists.json");
const { command_play } = require("../commands/player_module.js");

async function command_playlist(client, message, args)
{
    switch (args.shift())
    {
        case "list":
            var msg = "Список плейлистов:";
            for (var i = 0; i < file.size; i++)
            {
                var k = i + 1;
                msg += "\n" + k + ". " + file.body[i].name;
            }
            message.channel.send(msg);
            break;

        case "info":
            var msg = "";
            var n = parseInt(args.shift()) - 1;
            if (n < 0 || n >= file.size || isNaN(n))
                msg += "Какой ты, блять, номер ввёл? Сначала считать научись, а только потом обращайся, мудила";
            else
            {
                var user = await client.users.fetch(file.body[n].author);
                msg += "**Автор**: " + user.toString() + "\n";
                msg += "**Название**: " + file.body[n].name + "\n";
                msg += "**Композиции**: "
                for (var i = 0; i < file.body[n].size; i++)
                {
                    var k = i + 1;
                    msg += "\n      " + k + ". " + file.body[n].tracks[i];
                }
            }
            message.channel.send(msg);
            break;

        case "create":
            var arg_name = args.shift();
            for (var i = 0; i < args.length; i++)
                arg_name += " " + args[i];
            if (arg_name == undefined || arg_name == "")
                arg_name = "Плейлист долбаёба";
            file.body.push(
                {
                    author: message.author.id, 
                    name: arg_name,
                    size: 0,
                    tracks: []
                });
            file.size++;
            message.channel.send("Создан плейлист \'" + arg_name + "\'");
            break;

        case "delete":
            var msg = "";
            var n = parseInt(args.shift()) - 1;
            if (n < 0 || n >= file.size || isNaN(n))
                msg += "Какой ты, блять, номер ввёл? Сначала считать научись, а только потом обращайся, мудила";
            else
            {
                if (file.body[n].author != message.author.id)
                    msg += "Даже не пытайся удалить чужой плейлист, пидорас";
                else
                {
                    var del_name = file.body[n].name;
                    file.body.splice(n, 1);
                    file.size--;
                    msg += "Удалили плейлист \'" + del_name + "\'";
                }
            }
            message.channel.send(msg);
            break;
        
        case "add":
            var msg = "";
            var n = parseInt(args.shift()) - 1;
            if (n < 0 || n >= file.size || isNaN(n))
                msg += "Какой ты, блять, номер ввёл? Сначала считать научись, а только потом обращайся, мудила";
            else
            {
                if (file.body[n].author != message.author.id)
                    msg += "Не твоё - не трогать!";
                else
                {
                    var arg_name = args.shift();
                    for (var i = 0; i < args.length; i++)
                        arg_name += " " + args[i];
                    if (arg_name == undefined || arg_name == "")
                        arg_name += "Автор - придурок, не умеющий писать названия";
                    file.body[n].tracks.push(arg_name);
                    file.body[n].size++;
                    msg += "В плейлист \'" + file.body[n].name + "\' ";
                    msg += "добавлено \'" + arg_name + "\'";
                }
            }
            message.channel.send(msg);
            break;
        
        case "remove":
            var msg = "";
            var n = parseInt(args.shift()) - 1;
            if (n < 0 || n >= file.size || isNaN(n))
                msg += "Какой ты, блять, номер ввёл?";
            else
            {
                if (file.body[n].author != message.author.id)
                    msg += "Руки прочь от чужих плейлистов";
                else
                {
                    var m = parseInt(args.shift()) - 1;
                    if (m < 0 || m >= file.body[n].size || isNaN(m))
                        msg += "Мда, числа это не твоё. Ты слишком туп, не пиши сюда больше";
                    else
                    {
                        var del_name = file.body[n].tracks[m];
                        file.body[n].tracks.splice(m, 1);
                        file.body[n].size--;
                        msg += "Из плейлиста \'" + file.body[n].name + "\' ";
                        msg += "удаляем \'" + del_name + "\'";
                    }
                }
            }
            message.channel.send(msg);
            break;

        case "play":
            var n = parseInt(args.shift()) - 1;
            if (n < 0 || n >= file.size || isNaN(n))
                message.channel.send("Какой ты, блять, номер ввёл?");
            else
            {
                for (var i = 0; i < file.body[n].size; i++)
                    await command_play(message, [file.body[n].tracks[i]]);
            }
            break;

        default:
            message.channel.send("Какую-то хуйню написал, проси помощи... у Бога. Идиоту, который не может написать команду, только он и поможет");
            break;
    }
}

module.exports.command_playlist = command_playlist;