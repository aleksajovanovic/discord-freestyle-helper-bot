const words = require('an-array-of-english-words')
var Discord = require('discord.io')
var fs = require('fs')
var CircularList = require('../lib/circularlist')
var Constants = require('../auth/auth')

var cipher = new CircularList()
var cipherIndexes = []

var authorizedUsers = []

var TIME_PER_TURN = 4000
var WORDS_PER_PERSON = 5

var wordsworth = new Discord.Client({
    token: Constants.DISCORD_SECRET,
    autorun: true
});

wordsworth.on('ready', () => {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', async (user, userID, channelID, message, event) => {
    if (message.substring(0,3) === 'ww ') {
        var command = message.substring(3).split(" ")

        switch (command[0]) {
            case 'helena says hi':
                wordsworth.sendMessage({
                    to: channelID,
                    message: ">:)"
                });
            break

            case 'help':
            message = 
            'ww print                                         prints the participants in the cipher\nww start                                         starts the cipher\nww stop                                         stops the cipher\nww pause                                      pauses the cipher\nww resume                                   resumes the paused cipher with the current person with new words\nww end                                          disbands the cipher\nww join                                          join the cipher\nww leave                                       leave the cipher\nww changetime <new time>   changes the time per word to the new time'
                wordsworth.sendMessage({
                    to: channelID,
                    message: message
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
            
            case 'pause': 
                updater.pause(channelID)
            break
            
            case 'resume': 
                updater.resume(channelID)
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

            case 'changetime':
                newTime =  parseInt(command[1], 10)

                //CHECK AUTH

                if (isNaN(newTime) || newTime < 2 || newTime > 100) {
                    wordsworth.sendMessage({
                        to: channelID,
                        message: 'The new time must be between 2 and 100 seconds'
                    });

                    break
                }

                wordsworth.sendMessage({
                    to: channelID,
                    message: 'The old time was ' + TIME_PER_TURN / 1000 + ' seconds per word. The new time is ' + newTime + ' seconds per word.'
                });

                TIME_PER_TURN = newTime * 1000
            break
            
            case 'changenumwords':
                numberOfWords =  parseInt(command[1], 10)

                //CHECK AUTH

                if (isNaN(numberOfWords) || numberOfWords < 1 || numberOfWords > 20) {
                    wordsworth.sendMessage({
                        to: channelID,
                        message: 'The new number of words must be between 1 and 20 words'
                    });

                    break
                }

                numberOfWords = numberOfWords

                wordsworth.sendMessage({
                    to: channelID,
                    message: 'The old words per person was ' + WORDS_PER_PERSON + '. The new words per person is ' + numberOfWords + '.'
                });

                WORDS_PER_PERSON = numberOfWords
            break
            
            case 'rot':
                cipher.rotate()
            break
            
            case 'unrot':
                cipher.unrotate()
            break
            
            case 'end': 
                updater.stop()
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
    var paused = false

    let update = (channelID, _currentParticipant = null) => {
        currentWords = generateFiveWords()
        nextWords = generateFiveWords()
        currentParticipant = _currentParticipant === null ? cipher.next().user : _currentParticipant

        announcePreparation(channelID, currentParticipant, currentWords[index])

        timer = setInterval(async () => {
            if (timer !== null) {

                if (index === 0) {
                    announceParticipant(channelID, currentParticipant, currentWords[0])
                }
                else if (index === (WORDS_PER_PERSON -1)) {
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
        if (timer === null && !paused) {
            await countdownCipher(channelID, 'Starting the cipher')
            update(channelID)
        }
    }
    
    let pause = async (channelID) => {
        if (paused === false) {
            paused = true
            announcePause(channelID)
            clearInterval(timer)
            timer = null
            index = 0
        }
    }
    
    let resume = async (channelID) => {
        if (paused === true) {
            paused = false
            await countdownCipher(channelID, 'Continuing the cipher')
            update(channelID, currentParticipant)
        }
    }

    let stop = () => {
        clearInterval(timer)
        timer = null
        cipher.resetIterator()
        index = 0
    }

    return {
        start, pause, resume, stop
    }
})()

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

async function announcePause(channelID) {
    wordsworth.sendMessage({
        to: channelID,
        message: 'The cipher has been paused...'
    });
}

function generateFiveWords() {
    var fiveWords = []

    for (var i = 0; i < WORDS_PER_PERSON; i++) {
        var rand

        do {
            rand = Math.floor(Math.random() * (words.length))
        } 
        while (fiveWords.includes(words[rand]))

        fiveWords.push(words[rand].toUpperCase())
    }

    return fiveWords
}

async function countdownCipher(channelID, msg) {
    wordsworth.sendMessage({
        to: channelID,
        message: msg
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