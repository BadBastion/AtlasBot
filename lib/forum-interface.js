var request = require('request');
var log = require("./log-interface.js");
var server = require("./server-interface.js");
var discord = require("discord.js");



var cookie = {
    'main': ' Vanilla=298-1461204006%7Ca5f281ef4cfc6b872c60fc2fe735f22e%7C1458612006%7C298%7C1461204006;',
    'vv' : ''
};

module.exports['check'] = function CheckAccount(url, id, callback){
    var options = {
        url: url,
        method: 'GET',
        headers: {
            'DNT': '1',
            'Pragma' :          'no-cache',
            'Accept-Language': 'en-US,en;q=0.8',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded',
            'Cookie': cookie.main
        }
    };

    //Look up user object by ID.
    var user = server.getUserById(id);
    //If returned an error, log the error and send error to callback
    if(url.indexOf('https://forums.artillery.com/profile') < 0){
        callback(1, 'lib-check ERROR :: url not a valid artillery profile (It should look like https://forums.artillery.com/profile/101/myname)');
    }else if(typeof user === 'String'){
        callback(2, user);
    }else{


        var requestCallback = (function(id,callback){

            return function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    if (body.indexOf("<p>It looks like you're new here. If you want to get involved, click one of these buttons!</p>") > -1) {
                        callback(1, 'ERROR :: bad cookie (Please let the staff know you got this error)');
                        log.global('lib-check ERROR :: bad cookie', user);
                    } else if (body.indexOf('Discord User ID :: ' + id) > -1) {
                        callback(0, '!link `[SUCCESS :: user linked]`');
                        log.global('lib-check SUCCESS :: user linked', user);
                    } else if (body.indexOf(id) > -1) {
                        callback(1,'ERROR :: Sanity check failed (Make sure you have Discord User ID :: in front of your ID)');
                        log.global('lib-check ERROR :: Sanity check failed', user);
                    } else {
                        callback(1,'ERROR :: Id not found');
                        log.global("lib-check ERROR :: Id not found ", user);
                    }
                }else{
                    callback(1, 'ERROR :: bad request (Please let the staff know you got this error)');
                    log.global('lib-check ERROR :: bad request', user);
                }
            }

        })(id, callback);

        request(options, requestCallback);

    }

};
