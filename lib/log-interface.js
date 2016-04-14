var Discord = require("discord.js");



var atlasbot;
var servers;

module.exports.init = function(bot){
    servers = bot.servers;
    atlasbot = bot;
};


var log = function(message, user, target){
    atlasbot.sendMessage(target,
        '``` \n' + message + '\n``` User Name :: ' + user.mention() + ' User ID :: ' + user.id + '\n --- ')
};

module.exports.server = log;
module.exports.global = function(message, user){
    for(var i = 0, len = servers.length; i < len; i++){
        var target = servers[i].channels.get('name', 'log');
        if(target){
            log(message, user, target)
        }
    }
};

