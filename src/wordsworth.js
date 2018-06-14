const words = require('an-array-of-english-words');
var Discord = require('discord.io');

var cipher  

var wordsworth = new Discord.Client({
    token: "",
    autorun: true
});

wordsworth.on('ready', function() {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', function(user, userID, channelID, message, event) {
    if (message === "ping") {
        wordsworth.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
    if(message.substring(0,1) == '!') {
        var args = message.substring(1).split(' ');

        while(args.length > 0) {
            var command = args.shift();

            switch(command) {
              
            }
        }
    }
});
// event emitted whenever user joins
wordsworth.on('guildMemberAdd', function(member) {

});