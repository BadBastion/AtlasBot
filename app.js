var Discord = require("discord.js");


var WelcomeFunc = require("./welcome-functions.js");
var StaffFunc = require("./staff-functions.js");
var PmFunc = require("./pm-functions.js");


var Users = require("./lib/users-interface.js");
var Server = require("./lib/server-interface.js");
var Log = require("./lib/log-interface.js");



var Atlasbot = new Discord.Client();

var serverHooks = [];



//Setup Hooks
Atlasbot.on('ready', function(){
    Log.init(Atlasbot);
    WelcomeFunc.init(Atlasbot);
    StaffFunc.init(Atlasbot);
    PmFunc.init(Atlasbot);
    Server.init(Atlasbot);
    serverHooks = Server.hooks;
  });





//main Message handler
Atlasbot.on('message', function(message){
    var content = message.content;
    if ( message.content.charAt( 0 ) === '!' ) {
        //get functions end point
        var funcEnd = content.indexOf(' ')-1;
        if(funcEnd < 0) funcEnd = content.length-1;
        //make function into sub string
        var funcName = content.substr(1, funcEnd);
        //call function
        var perms = content.substr(funcEnd+2);
        var type;
        var log;
        for(var i = 0, len = serverHooks.length; i < len; i++){
            if(serverHooks[i].welcome.id === message.channel.id){
                type = "welcome";
                log = serverHooks[i].log;
                break;
            }else if(serverHooks[i].staff.id === message.channel.id){
                type = "staff";
                log = serverHooks[i].log;
                break;
            }
        }
        if(type === "welcome"){
            if(typeof WelcomeFunc[funcName] === 'undefined'){
                WelcomeFunc['not-found']( message, funcName, log)
            }else{
                WelcomeFunc[funcName]( message.author, message.channel, log, perms)
            }
        }else if(type === "staff"){
            if(typeof StaffFunc[funcName] === 'undefined'){
                StaffFunc['not-found']( message, funcName, log)
            }else{
                StaffFunc[funcName]( message.author, message.channel, log, perms)
            }
        }else if(message.channel.isPrivate){
            if(typeof PmFunc[funcName] === 'undefined'){
                PmFunc['not-found'](message, funcName)
            }else{
                PmFunc[funcName](message.author, message.channel, perms)
            }
        }

    }
});




Atlasbot.on("serverNewMember", function(server, user){
    var target, log;
    for(var i = 0, len = serverHooks.length; i < len; i++ ) {
        if(serverHooks[i].server === server){
            target = serverHooks[i].welcome;
            log = serverHooks[i].log;

        }
    }
    StaffFunc.syncUser(user,target,log, user.id);
    PmFunc.setup(user,user,log);
    WelcomeFunc.help(user,target,log);
});

Atlasbot.login("dmaydrum@gmail.com", "AlderSeedbotGroveTenderBramblethornGoliath", function(error, token){
    if(error !== null){
        console.log("ERROR login :: " + error )
    }else{
        console.log("ATLAS BOT LOGIN")
    }
});
