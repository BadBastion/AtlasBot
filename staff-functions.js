var Discord = require("discord.js");
var Messages = require("./messages.js");
var Log = require("./lib/log-interface.js");
var Forum = require("./lib/forum-interface.js");
var Users = require("./lib/users-interface.js");

var Atlasbot;
module.exports.init = function(bot){
    Atlasbot = bot;
    module.exports.init = undefined;
};
module.exports['pullServerUserData'] = function(){
  Users.pullServerUserData();
};
module.exports['syncAll'] = function(user, target, log, perms){
    Users.syncAll();
};
module.exports['syncUser'] = function(user, target, log, perms){
    Users.syncUser(Users.getUserById(perms));
};

module.exports['templink'] = function(user, target, log, perms){
    var userData = Users.getUserById(perms);
    var response;
    if(userData){
        Users.tempLinkUser(userData);
        Users.addUserGroup(userData, ['Verified']);
        Users.push();
        response = '!templink `[SUCCESS :: user linked]`';
        Atlasbot.sendMessage(target, user.mention() + ' => ' + response+' try using !add first');
        //Atlasbot.sendMessage(user, Messages.templink(user));
    }else{
        response = '!templink failed due to `[ERROR :: user not found]`';
        Atlasbot.sendMessage(target, user.mention() + ' => ' + response + ' try using !add first');
    }
};
module.exports['shutdown'] = function(){
    process.exit()
};
module.exports['not-found'] = function(message,funcName){
    Atlasbot.reply(message, 'the function !'+funcName+' was not found. Try using !help for a list of valid functions')
};