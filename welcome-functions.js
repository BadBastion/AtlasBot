var Discord = require("discord.js");
var Message = require("./messages.js");
var Log = require("./lib/log-interface.js");
var server = require("./lib/server-interface.js");

var atlasbot;
module.exports.init = function(bot){
    atlasbot = bot;
};

module.exports['help'] = function(user, target, log){
    atlasbot.sendMessage(target, Message.welcome.help(user));
    atlasbot.sendMessage(user, Message.pm.welcome(user));
    Log.server('!help was requested in '+target.name, user, log);
};
module.exports['support'] = function(user, target, log, perms){
    var targetServer = server.getServerHooks(target.server);
    if(targetServer){
        atlasbot.sendMessage(targetServer.staff, user.mention() + " requested support with the message \"" + perms + "\"");
        Log.server('!support was requested in '+target.name, user, log);
    }
};

module.exports['not-found'] = function(message, funcName, log){
    atlasbot.reply(message, 'the function !'+funcName+' was not found. Try using !help for a list of valid functions')
    Log.server('unknown function !' + funcName + ' was requested in '+message.channel.name, message.author, log);
};
