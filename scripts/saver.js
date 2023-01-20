const config = require("../config.json");
const playlists = require("../playlists.json");

var fs = require("fs");

function start_saver()
{
    setInterval(() =>
    {
        var json_config = JSON.stringify(config);
        fs.writeFileSync("config.json", json_config);
        var json_playlists = JSON.stringify(playlists);
        fs.writeFileSync("playlists.json", json_playlists );
    }, 600000);
}

module.exports.start_saver = start_saver;