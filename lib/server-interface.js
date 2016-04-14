var Discord = require("discord.js");
var Log = require("./log-interface.js");

var AtlasBot;
var servers = [];
var hooks = [];
module.exports.hooks = hooks;
module.exports.get = function(){
    return servers;
};
function addHook(server){
    var newHook = {name: server.name, server: server};
    for(var i = 0, len = server.channels.length; i < len;i++){
        if(server.channels[i].name === 'verification-requests' && server.channels[i].type === 'text') {
            newHook.welcome = server.channels[i];
        }else if(server.channels[i].name === 'welcome' && server.channels[i].type === 'text'){
            newHook.welcome = server.channels[i];
        }else if(server.channels[i].name === 'staff' && server.channels[i].type === 'text'){
            newHook.staff = server.channels[i];
        }else if(server.channels[i].name === 'mods' && server.channels[i].type === 'text'){
            newHook.staff = server.channels[i];
        }else if(server.channels[i].name === 'log' && server.channels[i].type === 'text'){
            newHook.log = server.channels[i];
        }
    }
    hooks[hooks.length] = newHook;
}


module.exports.init = function(bot){
    AtlasBot = bot;
    servers = bot.servers;
    module.exports.length = servers.length;

    for(var i = 0, len = servers.length; i < len; i++){
        addHook(servers[i]);
    }
};




module.exports.addRolls = function(user, rollnames, callback){
    var callbackWrapper = (function(Log, user, callback){
        return function(error){
            if(error){
                Log.global('lib-addRoll ERROR [' + error.response.res.text + ']', user);
            }
            callback()
        }
    })(Log, user, callback);
    for(var i = 0, len = servers.length; i < len; i++) {
        if(servers[i].members.indexOf(user) > -1){
            AtlasBot.addMemberToRole(user, getRoles(servers[i], rollnames), callbackWrapper)
        }
    }
};
module.exports.removeRolls = function(user, rollnames, callback){
    var callbackWrapper = (function(Log, user, callback){
        return function(error){
            if(error){
                Log.global('lib-removeRoll ERROR [' + error.response.res.text + ']', user);
            }
            callback()
        }
    })(Log, user, callback);
    for(var i = 0, len = servers.length; i < len; i++) {
        if(servers[i].members.indexOf(user) > -1) {
            AtlasBot.removeMemberFromRole(user, getRoles(servers[i], rollnames), callbackWrapper)
        }
    }
};



function getRoles(server, rollnames){
    var roles = [];
    if(typeof rollnames === 'String'){
        rollnames = [rollnames]
    }
    for(var i = 0, len = rollnames.length; i < len; i++){
        roles[i] = server.roles.get('name', rollnames[i])
    }
    return roles;
}

module.exports.getUserById = function(id){
    var match = false;
    for(var i = 0, len = servers.length; i < len; i++){
        var members = servers[i].members;
        for(var i2 = 0, len2 = members.length; i2 < len2; i2++){
            if(members[i2].id === id){
                match = members[i2];
                break;
            }
        }
        if(match) break;
    }

    return match || 'lib-getUserById ERROR :: User not found on any AtlasBot servers'
};

module.exports.getUserServerCount = function(user){
    var count = 0;
    for(var i = 0, len = servers.length; i < len; i++){
        if(servers[i].members.indexOf(user) > -1){
            count++;
        }
    }

    return count;
};