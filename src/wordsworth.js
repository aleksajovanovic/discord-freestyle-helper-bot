const words = require('an-array-of-english-words')
var Discord = require('discord.io')
var CircularList = require('../lib/circularlist')
var Constants = require('../auth/auth')

var cipher = new CircularList()
var cipherIndexes = []

const TIME_PER_TURN = 4000

var wordsworth = new Discord.Client({
    token: Constants.DISCORD_SECRET,
    autorun: true
});

wordsworth.on('ready', () => {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', async (user, userID, channelID, message, event) => {
    if (message.substring(0,3) == 'ww ') {
        var command = message.substring(3)

        switch (command) {
            case 'helena says hi':
                wordsworth.sendMessage({
                    to: channelID,
                    message: ";)"
                });
            break

            case 'print':
                var listAsString = ''
                var index = 0
                while (index < cipher.size) {
                    var dataUser = cipher.get(index)['user']
                    listAsString += dataUser + ', '
                    index++
                }

                wordsworth.sendMessage({
                    to: channelID,
                    message: listAsString
                });
            break

            case 'push':
                user1 = {'user': 'bob', 'userID': '1', 'index': 0}
                user2 = {'user': 'daryl', 'userID': '2', 'index': 1}
                user3 = {'user': 'craig', 'userID': '3', 'index': 2}
                user4 = {'user': 'kimberley', 'userID': '4', 'index': 3}
                user5 = {'user': 'juan', 'userID': '5', 'index': 4}

                cipher.push(user1)
                cipher.push(user2)
                cipher.push(user3)
                cipher.push(user4)
                cipher.push(user5)
            break

            case 'start': 
                updater.start(channelID)
            break

            case 'stop':
                updater.stop()
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
                cipherIndexes[userID] = cipher.size - 1
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

            case 'rot':
                cipher.rotate()
            break
            
            case 'unrot':
                cipher.unrotate()
            break
            
            case 'end': 
                cipher = new CircularList()
                
            break 
        }
    }
});

// event emitted whenever user joins
wordsworth.on('guildMemberAdd', (member) => {

});

const updater =  (() => {
    let timer = null
    var index = 0
    var currentWords = null
    var nextWords = null

    let update = (channelID) => {
        currentWords = generateFiveWords()
        nextWords = generateFiveWords()
        currentParticipant = cipher.next().user
        announcePreparation(channelID, currentParticipant, currentWords[index])

        timer = setInterval(async () => {
            if (timer !== null) {

                if (index === 0) {
                    announceParticipant(channelID, currentParticipant, currentWords[0])
                }
                else if (index === 4) {
                    announceLastWord(channelID, currentWords[index])

                    await sleep(1000)

                    currentParticipant = cipher.next().user
                    
                    announcePreparation(channelID, currentParticipant, nextWords[0])

                    currentWords = nextWords
                    nextWords = generateFiveWords()
                    index = -1
                }
                else {
                    announceWord(channelID, currentWords[index])
                }

                index++
            }
        }, TIME_PER_TURN)
    }

    let start = async (channelID) => {
        if (timer === null) {
            await countdownCipherStart(channelID)
            update(channelID)
        }
    }

    let stop = () => {
        clearInterval(timer)
        timer = null
        cipher.resetIterator()
        index = 0
    }

    return {
        start, stop
    }
})()

async function announceNext(channelID, user) {
    var cipherWords = generateFiveWords()

    wordsworth.sendMessage({
        to: channelID,
        message: user + ', you\'re up next. Get ready.\n\n Here are your words:\n\n' 
        + cipherWords[0] + '\n' + cipherWords[1] + '\n' + cipherWords[2] + '\n' 
        + cipherWords[3] + '\n' + cipherWords[4] + '\n------------------'
    });
}

async function announceParticipant(channelID, user, word) {
    wordsworth.sendMessage({
        to: channelID,
        message: user + ', your word was ' + word + '. Go!'
    });
}

async function announcePreparation(channelID, user, word) {
    wordsworth.sendMessage({
        to: channelID,
        message: user + ', your first word will be\n' + word + '\nStart rapping when I say so.' + '\n------------------'
    });
}

async function announceWord(channelID, word) {
    wordsworth.sendMessage({
        to: channelID,
        message: word
    });
}

async function announceLastWord(channelID, word) {
    wordsworth.sendMessage({
        to: channelID,
        message: word + '\n------------------'
    });
}

function generateFiveWords() {
    var fiveWords = []

    for (var i = 0; i < 5; i++) {
        var rand

        do {
            rand = Math.floor(Math.random() * (words.length))
        } 
        while (fiveWords.includes(words[rand]))

        fiveWords.push(words[rand].toUpperCase())
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
        message: "1\n------------------"
    });
    await sleep(1000)
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}