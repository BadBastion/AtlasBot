var Discord = require("discord.js");
var Message = require("./messages.js");
var Log = require("./lib/log-interface.js");
var Forum = require("./lib/forum-interface.js");
var Users = require("./lib/users-interface.js");
var Server = require("./lib/server-interface.js");


var atlasbot;
module.exports.init = function(bot){
    atlasbot = bot;
    module.exports.init = undefined;
};

//function callit(){
//
//    options.headers.Cookie = cookie.Cookie + cookie.vv;
//
//    request(options, function (error, response, body) {
//        if (!error && response.statusCode == 200) {
//            // Print out the response body
//            var body = response.body;
//            //cookie.vv = returnCookie.substr(0, returnCookie.indexOf(';')-1);
//            console.log(body);
//            setTimeout(callit, 1000*5)
//        }
//    });
//
//}
//callit();

module.exports['me'] = function(user, target, perms){
    atlasbot.sendMessage(target,  Message.pm.me(user));
    Log.global('!me was requested by PM', user);
};

module.exports['setup'] = function(user, target, perms){
    atlasbot.sendMessage(target, Message.pm.welcome(user));
    Log.global('!help was requested by PM', user);
};

module.exports['add'] = function(user, target, perms){
    var response = Users.addUser(user.id);
    Users.push();
    Log.global('!add was called by user', user);
    if(typeof response === "String"){
        Log.global(response, user);
    }
};

module.exports['link'] = function(user, target, perms){
    var userData = Users.getUserById(user.id);
    if(userData){
        Users.linkUser(userData, perms, function(error, response){
            if(error > 0) {
                response = ' !link failed due to `[' + response + ']`';
            }
            atlasbot.sendMessage(user, response);
            if(error === 0){
                Users.addUserGroup(userData, ['Verified']);
            }
            Users.push();
        })
    }else{
        var response = ' !link failed due to `[ERROR :: user not found]`';
        atlasbot.sendMessage(user, response+' try using !add first');
        Log.global(response, user);
    }
};

module.exports['unlink'] = function(user, target, perms){
    var userData = Users.getUserById(user.id);
    var response;
    if(userData !== false){
        Users.unlinkUser(userData);
        Users.removeUserGroup(userData, ['Verified']);
        Users.push();
        response = ' !unlink `[SUCCESS :: user unlinked]`';
        atlasbot.sendMessage(user, response);
        Log.global(response, user);
    }else{
        response = ' !unlink failed due to `[ERROR :: user not found]`';
        atlasbot.sendMessage(user, response+' try using !add first');
        Log.global(response, user);
    }
};


module.exports['not-found'] = function(message, funcName, logs){
    atlasbot.reply(message, 'The function !'+funcName+' was not found. Try using !help for a list of valid functions');
    Log.global('unknown function' + funcName + 'was requested by PM', message.author, logs);
};