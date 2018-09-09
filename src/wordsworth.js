const words = require('an-array-of-english-words')
var Discord = require('discord.io')
var CircularList = require('../lib/circularlist')

var cipher = new CircularList()
var participants = []

var wordsworth = new Discord.Client({
    token: "NDU1MDA5NDQ1MzgzMjQxNzI4.DgwXeg.GKrKt3IQaiwUuqUF0B-jtvXAny8",
    autorun: true
});

wordsworth.on('ready', function() {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', function(user, userID, channelID, message, event) {
    if(message.substring(0,3) == 'ww ') {
        var command = message.substring(3)

        switch (command) {
            case 'hello':
            break

            case 'start': 
                wordsworth.sendMessage({
                    to: channelID,
                    message: "starting the cipher"
                });
            break

            case 'join':
                var user = {'user': user, 'userID': userID, 'index': cipher.size()}
                participants[userID] = cipher.size()
                cipher.push(user)
            break

            case 'leave':
                var user = {'user': user, 'userID': userID, 'index': cipher.size()}
                var reachedUserToRemove = false

                for(var key in participants) {
                    if(reachedUserToRemove) {
                        --participants[key]
                    }
                    if(key === userID) {
                        reachedUserToRemove = true
                    }
                }

                var index = participants[userID]
                cipher.remove(index)
            case 'end':
                
            break 

            break

        }
    }
});

// event emitted whenever user joins
wordsworth.on('guildMemberAdd', function(member) {

});

function startCipher() {

}