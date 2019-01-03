const words = require('an-array-of-english-words')
const replace = require('replace-in-file');
const crypto = require('crypto');
var Discord = require('discord.io')
var CircularList = require('../lib/circularlist')
require('dotenv').config();

var cipher = new CircularList()
var cipherIndexes = []

var authorizedUsers = []
var password = process.env.PASSWORD === 'null' ? null : process.env.PASSWORD

var TIME_PER_TURN = process.env.TIME_PER_TURN === 'null' ? 4000 : process.env.TIME_PER_TURN
var WORDS_PER_PERSON = process.env.WORDS_PER_PERSON === 'null' ? 5 : process.env.WORDS_PER_PERSON

const gametypes = {
    NORMAL: 'normal',
    ALLITERATION: 'alliteration'
}

var gametype = ''

switch (process.env.GAMETYPE) {
    case 'normal':
        gametype = gametypes.NORMAL
    break
    
    case 'alliteration':
        gametype = gametypes.ALLITERATION
    break

    default:
        gametype = gametypes.NORMAL
    break
}

var wordsworth = new Discord.Client({
    token: process.env.DISCORD_SECRET_KEY,
    autorun: true
});

wordsworth.on('ready', () => {
    console.log('Logged in as %s - %s\n', wordsworth.username, wordsworth.id);
});

wordsworth.on('message', async (user, userID, channelID, message, event) => {
    if (message.substring(0,3) === 'ww ') {
        var command = message.substring(3).split(" ")

        switch (command[0]) { 
            case 'helenasayshi':
                wordsworth.sendMessage({
                    to: channelID,
                    message: '>:)'
                });
            break

            case 'help':
                message = 
                ' ww print                                                                prints the participants in the cipher\n' +
                ' ww start                                                                starts the cipher\n' +
                ' ww stop                                                                stops the cipher\n' +
                ' ww pause                                                             pauses the cipher\n' +
                ' ww resume                                                          resumes the paused cipher with the current person with new words\n' +
                ' ww end                                                                 disbands the cipher\n' +
                ' ww join                                                                  join the cipher\n' +
                ' ww leave                                                               leave the cipher\n' +
                ' ww changetime <new time>                            changes the time per word to the new time\n' +
                ' ww changeword <new words per person>   change how many words each person gets\n' +
                ' ww save                                                                save your customizations\n' +
                ' ww showpresets                                                 show what your current customizations are\n'
                    
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
            
            case 'changewords':
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
            
            case 'save':
                savePresets()
            break
            
            case 'showpresets':
                sendMessage(channelID, 'TIME_PER_TURN=' + TIME_PER_TURN / 1000 + '\n' + 'WORDS_PER_PERSON=' + WORDS_PER_PERSON + '\n' + 'GAMETYPE=' + gametype + '\n')
            break
            
            case 'auth':
                auth(userID, command[1])
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

        sendMessage(channelID, currentParticipant + ', your first word will be\n' + currentWords[index] + '\nStart rapping when I say so.' + '\n------------------')

        timer = setInterval(async () => {
            if (timer !== null) {

                if (index === 0) {
                    sendMessage(channelID, currentParticipant + ', your word was ' + currentWords[0] + '. Go!')
                }
                else if (index === (WORDS_PER_PERSON -1)) {
                    sendMessage(channelID, currentWords[index] + '\n------------------')

                    await sleep(1000)

                    currentParticipant = cipher.next().user
                    
                    sendMessage(channelID, currentParticipant + ', your first word will be\n' + nextWords[0] + '\nStart rapping when I say so.' + '\n------------------')

                    currentWords = nextWords
                    nextWords = generateFiveWords()
                    index = -1
                }
                else {
                    sendMessage(channelID, currentWords[index])
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
            sendMessage(channelID, 'The cipher has been paused...')
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

async function auth(userID, _password) {
    hashedPass = crypto.createHash('sha256').update(_password, 'utf8').digest()

    if (password === null) {
        const options = {

            files: './.env',
          
            from: /PASSWORD=null/,
            to: 'PASSWORD=' + hashedPass,
          };
    
        replace(options)
            .catch(error => {
                console.error('Error occurred:', error);
            });

        authorizedUsers.push(userID)

        return
    }

    if (password === hashedPass) {
        authorizedUsers.push(userID)
    }
}

function isAuth(userID, password) {
    return authorizedUsers.includes(userID)
}

async function savePresets() {
    var timeReplace = 'TIME_PER_TURN=' + TIME_PER_TURN
    var wordReplace = 'WORDS_PER_PERSON=' + WORDS_PER_PERSON
    var gameReplace = 'GAMETYPE=' + gametype
    
    const options = {

        //Single file
        files: './.env',
      
        //Replacement to make (string or regex) 
        from: [/TIME_PER_TURN=[null|0-9]*/, /WORDS_PER_PERSON=[null|0-9]*/, /GAMETYPE=[null|a-z]*/],
        to: [timeReplace, wordReplace, gameReplace],
      };

    replace(options)
        .catch(error => {
            console.error('Error occurred:', error);
        });
}

async function showPresets(channelID) {
    wordsworth.sendMessage({
        to: channelID,
        message: 'TIME_PER_TURN=' + TIME_PER_TURN + '\n' + 'WORDS_PER_PERSON=' + WORDS_PER_PERSON + '\n' + 'GAMETYPE=' + gametype + '\n'
    });
}

async function sendMessage(channelID, msg) {
    wordsworth.sendMessage({
        to: channelID,
        message: msg
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