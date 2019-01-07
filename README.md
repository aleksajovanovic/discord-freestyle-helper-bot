# WordsWorth - The Discord Freestyle Helper

WordsWorth is a discord bot to help users conduct freestyles amongst their friends. WordsWorth will keep track of the order of participants and will generate words for them to rhyme with!

## Installation
This project was made in [Node.js](https://nodejs.org/en/), so first we need to install that.

Download the windows installer from [here](https://nodejs.org/en/download/current/). Once the download completes, run it and install nodejs! To check is it was installed correctly, open your command prompt or terminal and type in the command 
```
node -v
```
This should spit out a version number. Then type
```
npm -v
```
This should also spit out a version number. If both of these commands work then you are good to go.

Next, clone the repository and copy `.sample-env` to a file called `.env`. Before we go any further, you will need to set up a developer discord account [here](https://discordapp.com/developers). Now, create an application, generate a client secret and replace `<SECRET>` in your `.env` file with your secret.

Lastly, you have to add your channel ids to the .env file. The regular channel id is for commands that shouldn't pollute the channel used for the freestyle. To obtain channel ids, go to your setting in your discord server, click appearance and then enable developer mode. Now you will be able to right click channels and copy their id. Copy the two channels of your choosing and paste them into the `.env` file respectively.

## Deployment
First off, invite the bot to your server. Do this by pasting this link https://discordapp.com/oauth2/authorize?client_id=<Bot_Client_ID>&scope=bot&permissions=0 into your browser, but make sure to replace <Bot_Client_ID> with your bot's `client_id`. This can be found under your bot's application page in your developer discord portal. Once you paste this link you will be able choose which one of your servers to add the bot to.

Open up your command prompt or terminal and navigate to inside the projects folder. Run `npm start`. Your bot should be online now.

To see a list of commands type `ww help` in the channel you specified for regular commands.


## Author
Aleksa "TuNa" Jovanovic
