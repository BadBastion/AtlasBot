/**
 * Created by Daniel on 3/17/16.
 */

var pm = {};


pm.help = function(user){
    return "__**PM CHANNEL FUNCTIONS**__" +
           "• `!welcome` returns instructions on account setup \n" +
            "• `!add` adds you do the list of server users. This _should_ happen when you join the server automatically\n" +
            "• `!me` returns your discord profile information \n" +
           "• `!link {url}` links your discord account to your forum account (type !welcome for more info)\n" +
           "• `!support` <disabled at the moment> Alerts the mods that you need help with something\n" +
           "PLEASE NOTE :: Other functions will be avalable " +
           "__**WELCOME CHANNEL FUNCTIONS**__" +
           "• `!help` returns the welcome message (new to the server) \n" +
           "• `!support` <disabled at the moment> Alerts the mods that you need help with something\n"
};



pm.welcome = function(user){
    return"Welcome to the Atlas Discord Server. You must link your Discord account with your Atlas forum account before you can join the other channels on the server.\n\n"+
        "To link your Atlas account, please post (exactly) the following message on your Atlas forum profile: \n\n"+
        "``` Discord User ID :: "+ user.id +" ``` \n" +
        "(On the Atlas forums, click on your username in the top right and then post in the 'Activity' section.)\n\n\n" +
        "Once you have done this, you will need to tell me where to look for it by using the *private message function* `!link` to link me to your forum profile. Type !link and Copy and Paste your forum URL like so\n\n"+
        "```!link https://forums.artillery.com/profile/404/YOU``` \n" +
        "Note that I am just a bot, so if you need help please post in the #welcome channel or pm one of the Staff. If you would like to see this message again, send me a private message with the text: !welcome. For a full list of functions, try `!help`"
};

pm.me = function(user){
  return "Username :: "+user.name+"\n" +
    "Discriminator :: "+user.discriminator+"\n" +
    "ID :: "+user.id+"\n"
};


var welcome = {};
welcome.help = function(user) {
    return 'Welcome '+ user.mention() +' to the Atlas Discord Server. I have sent you a private message with instructions on how to verify your account. If you need help please use this channel or ask one of our mods.'
};




module.exports.pm = pm;
module.exports.welcome = welcome;
