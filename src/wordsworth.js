const words = require('an-array-of-english-words')
var Discord = require('discord.io')
var CircularList = require('../lib/circularlist')
var Constants = require('../auth/auth')

var cipher = new CircularList()
var cipherIndexes = []
console.log(Constants.DISCORD_SECRET)

var wordsworth = new Discord.Client({
    token: Constants.DISCORD_SECRET,
    autorun: true
});

wordsworth.on('ready', function() {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', async function(user, userID, channelID, message, event) {
    if (message.substring(0,3) == 'ww ') {
        var command = message.substring(3)

        switch (command) {
            case 'helena says hi':
                wordsworth.sendMessage({
                    to: channelID,
                    message: ";)"
                });
            break

            case 'hello':
                wordsworth.sendMessage({
                    to: channelID,
                    message: words.length
                });
            break

            case 'start': 
                await countdownCipherStart(channelID)
                startCipher(channelID)
            break

            case 'join':

                var user = {'user': user, 'userID': userID, 'index': cipher.size}
                userId = user['userID']

                if (cipher.exists(user)) {
                    wordsworth.sendMessage({
                        to: channelID,
                        message: user.user + ', you are already in the cipher'
                    });
                    break
                }

                cipher.push(user)
                cipherIndexes[userID] = cipher.size
                wordsworth.sendMessage({
                    to: channelID,
                    message: user.user + ', your position in the cipher is ' + cipher.size
                });
            break

            case 'leave':
                var user = {'user': user, 'userID': userID, 'index': cipher.size}
                var reachedUserToRemove = false

                for (var key in cipherIndexes) {
                    if(reachedUserToRemove) {
                        --cipherIndexes[key]
                    }

                    if(key === userID) {
                        reachedUserToRemove = true
                    }
                }

                var index = cipherIndexes[userID]
                cipher.remove(index)
            break

            case 'end': 
                cipher = new CircularList()
                
            break 
        }
    }
});

// event emitted whenever user joins
wordsworth.on('guildMemberAdd', function(member) {

});

async function startCipher(channelID) {
    announceNext(channelID, cipher.get(0).user)
}

async function announceNext(channelID, user) {
    var cipherWords = generateFiveWords(channelID)

    wordsworth.sendMessage({
        to: channelID,
        message: user + ', you\'re up next. Get ready.\n\n Here are your words:\n\n' 
        + cipherWords[0] + ', ' + cipherWords[1] + ',\n' + cipherWords[2] + ', ' 
        + cipherWords[3] + ',\n' + cipherWords[4]
    });
}

function generateFiveWords(channelID) {
    var fiveWords = []
    var wordsUsed = []

    for (var i = 0; i < 5; i++) {  
        var rand
        do {
            rand = Math.floor(Math.random() * (words.length))
        } 
        while (wordsUsed.includes(rand))

        wordsUsed.push(rand)
        fiveWords.push(words[rand])
    }

    return fiveWords
}

async function countdownCipherStart(channelID) {
    wordsworth.sendMessage({
        to: channelID,
        message: "starting the cipher"
    });
    await sleep(1000)
    wordsworth.sendMessage({
        to: channelID,
        message: "3"
    });
    await sleep(1000)
    wordsworth.sendMessage({
        to: channelID,
        message: "2"
    });
    await sleep(1000)
    wordsworth.sendMessage({
        to: channelID,
        message: "1\n"
    });
    await sleep(1000)
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}