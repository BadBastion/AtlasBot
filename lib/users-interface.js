var jsonfile = require('jsonfile');
var util = require('util');
var fs = require("fs");

var historyPath = './bin/history/';
var filePath = './bin/users.json';

var forum = require('./forum-interface.js');
var server = require("./server-interface.js");


var volitile = [];
var changed = {
    added:[],
    removed:[],
    modified:[]
};



//Every ~2 hour, this function will be called,
//Saving the current users and changed data to history
//If there are more then 84(one week) of history file
//The extras will be removed.
function saveLoop(){
    console.log("saveLoopCalled");
    //Get `Date`
    var dateUTC = new Date().toUTCString();

    //Get list of all files in history dir
    var history = fs.readdirSync(historyPath);

    //Remove all files older then 1 week in history dir
    for(var i = history.length, len = 120; i > len; i--){
        fs.unlinkSync(historyPath+history[i]);
    }

    //Get the most recent save file id and increment
    var nextId = parseInt(history[history.length-1]) || -1;
    nextId++;

    //Save current `user` and `changed` vars to history dir, and reset `changed`;
    jsonfile.writeFileSync(historyPath+'users-save-'+nextId+'.json', {date:dateUTC, users:volitile, changed:changed});
    changed = {added:[],removed:[], modified:[]};

    //recall function later
    setTimeout(saveLoop, 3600000)
}
saveLoop();





//Pulls user data from current user.json file
//Overwriting the `user` and `changed` vars,
function pull(recover){
    var file = jsonfile.readFileSync(filePath);
    volitile = file.users;
    changed = file.changed || changed;
}
pull();

//Pushs(saves) `user` and `changed` var to current user.json file
function push(){
    jsonfile.writeFileSync(filePath, {date:'now', users:volitile, changed:changed})
}


function callback(i, user) {
    return function () {
        server.addRolls(user, volitile[i].userGroups, function(){console.log("CALLBACKSET"+i);});
    }
}

function pullServerUserData(){
    var servers = server.get();
    var user;
    for(var i = 0, len = servers.length; i < len; i++){
        console.log("SERVER"+i);
        for(var i2 = 0, len2 = servers[i].members.length; i2 < len2; i2++){
            user = addUser(servers[i].members[i2].id);
            if(typeof user === 'object'){
                addUserGroup(user, ['Verified'], function(){})
            }
        }
    }
    push();
}


function syncAll(){
    var user, callbackInstance, i = 0, len = volitile.length;
    (function loop(){
        if(i < len){
            user = server.getUserById(volitile[i].id);
            callbackInstance = callback(i, user);
            server.removeRolls(user, ['Verified'], callbackInstance);
            i++;
            console.log("tick"+i);
            setTimeout(loop, 2000)
        }else{
            push();
        }
    })();
}
function syncUser(user){
    var i = user.index;
    user = server.getUserById(user.id);
    var callbackInstance = callback(i, user, server.length);
    server.removeRolls(user, ['Verified','Staff','Artillery'], callbackInstance);
    push();
}


//Returns the user object matching `id` in the volitile list,
//If no match is found, it returns false
function getUserById(id){
    for(var i = 0, len = volitile.length; i < len; i++){
        if(volitile[i].id === id){
            return volitile[i];
        }
    }
    return false;
}

//Returns the user object matching `forumUrl` in the volitile list,
//If no match is found, it returns false
function getUserByUrl(url){
    for(var i = 0, len = volitile.length; i < len; i++){
        if(volitile[i].forumUrl === url){
            return volitile[i];
        }
    }
    return false;
}





//Checks for
function checkDuplicates(user){
    //Make sure the values are strings
    user.id = String(user.id);
    user.forumUrl = String(user.forumUrl);

    var error = "ERROR ::";

    for(var i = 0, len = volitile.length; i < len; i++){
        if(user.id === volitile[i].id){
            error+=" Discord account already indexed."
        }
        if(user.forumUrl === volitile[i].forumUrl){
            error+=" Forum Url already in use."
        }
    }


    if(error = "ERROR ::"){
        return false;
    }else{
        return error;
    }
}



function addUser(id){
    var error = false;
    for(var i = 0, len = volitile.length; i < len; i++){
        if(volitile[i].id === id){
            error =  "lib-addUser ERROR :: Discord account already indexed";
            break;
        }
    }
    if(error){
        return error;
    }

    var now = Date.now();
    var userObj = {
        index:volitile.length,
        locked:false,
        created:now,
        modified:now,
        id:id,
        userGroups:[],
        forumUrl: false
    };
    changed.added[changed.added.length] = userObj;
    volitile[volitile.length] = userObj;
    return userObj;
}


function addUserGroup(user, userGroups){
    user.modified = Date.now();
    var uniqueList = [];
    for(var i = 0, len = userGroups.length; i < len; i++){
        var unique = true;
        for(var i2 = 0, len2 = user.userGroups.length; i2 < len2; i2++){
            if(user.userGroups[i2] === userGroups[i]){
                unique = false;
                break;
            }
        }
        if(unique){
            uniqueList[uniqueList.length] = userGroups[i];
            user.userGroups[user.userGroups.length] = userGroups[i];

        }
    }
    server.addRolls(server.getUserById(user.id), userGroups);
    //remove i value, and insert editted user
    volitile[user.index] = user;
}

function removeUserGroup(user,userGroups){
    user.modified = Date.now();
    var uniqueList = [];
    //If non-array is passed, wrap it in an array
    for(var i = 0, len = userGroups.length; i < len; i++){
        for(var i2 = 0, len2 = user.userGroups.length; i2 < len2; i2++){
            if(user.userGroups[i2] === userGroups[i]){
                user.userGroups.splice(i2, 1);
                uniqueList[uniqueList.length] = userGroups[i];
                break;
            }
        }
    }
    console.log(user);
    server.removeRolls(server.getUserById(user.id), uniqueList);
    //remove i value, and insert editted user
    volitile[user.index] = user;
    return user;
}

function tempLinkUser(user){
    user.modified = Date.now();
    user.forumUrl = 'TEMP';
    user.locked = false;
    volitile[user.index] = user;
    return user;
}

function linkUser(user, url, callback){
    var unique = true;
    for(var i = 0, len = volitile.length; i < len; i++){
        if(url === volitile[i].forumUrl){
            unique = false;
        }
    }
    if(user.locked){
        callback(4, 'lib-linkUser ERROR :: User Locked');
    }else if(user.forumUrl !== 'TEMP' && user.forumUrl !== 'false' && user.forumUrl !== false && user.forumUrl !== 'REMOVED'){
        callback(4, 'lib-linkUser ERROR :: User Already Linked');
    }else if(unique){
        var checkCallback =
            (function(user, volitile, url) {
                return function(error, response){
                    callback(error, response);
                    if(error == 0){
                        user.modified = Date.now();
                        user.forumUrl = url;
                        volitile[user.index] = user;
                        return user;
                    }
                }
            })(user, volitile, url);
        forum.check(url, user.id, checkCallback);
    }else{
        var returnText = 'lib-linkUser ERROR :: Forum Url already in use';
        callback(3, returnText);
    }

    return user;
}

function unlinkUser(user){
    user.modified = Date.now();
    user.forumUrl = 'REMOVED';
    user.locked = true;
    volitile[user.index] = user;
    return user;
}

function unlockUser(user){
    user.modified = Date.now();
    user.locked = false;
    volitile[user.index] = user;
    return user;
}
module.exports.push = push;

module.exports.addUser = addUser;
module.exports.addUserGroup = addUserGroup;
module.exports.removeUserGroup = removeUserGroup;
module.exports.linkUser = linkUser;
module.exports.tempLinkUser = tempLinkUser;
module.exports.unlinkUser = unlinkUser;
module.exports.unlockUser = unlockUser;
module.exports.getUserById = getUserById;
module.exports.syncAll = syncAll;
module.exports.syncUser = syncUser;
module.exports.pullServerUserData = pullServerUserData;