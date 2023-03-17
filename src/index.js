const {
  createAudioResource,
  StreamType,
  createAudioPlayer,
  joinVoiceChannel,
} = require("@discordjs/voice");
const { join } = require("path");

const {Client} = require("discord.js");
require("dotenv").config();
const txtomp3 = require("text-to-mp3");
const fs = require("fs");

function genMp3File(text, fileName) {
  txtomp3.getMp3(text).then(function (binaryStream) {
      let file = fs.createWriteStream(`\message.mp3`);
      file.write(binaryStream);
      file.end();

  }).catch(function(err){

      console.log("Error", err);
  });
}


function joinVC(message, prefix) {
  if (message.author.bot) {
    return;
  }
  const audioFile = "message.mp3"
  const resource = createAudioResource(join("./", audioFile), {
    inlineVolume: true,
  });

  
    const channel = message.member.voice.channel;
    
    if (!channel) {
      //return message.channel.send("You need to be in a Voice-Chat ;)");
    }

    try {
      const player = createAudioPlayer();
      const Connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
      Connection.subscribe(player);
      player.play(resource);
      player.on("idle", () => {
        Connection.disconnect();
      });
      player.on("error", (error) => {
        console.error(error);
      });
    } catch (error) {
      console.log(error);
    }
}

const token = process.env.TOKEN;
const id = "1086350201310163155";
const prefix = "!"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildVoiceStates"],
  partials: ["CHANNEL"],
});

function writeMsgToChannel(message, id) {
  const channel = client.channels.cache.get(id);
  if (message.author.bot) {
    return;
  }
  if(message.channelId == "1086350201310163155") {
    channel.send(message);
    const timestamp = new Date().toISOString();
    const content = `${timestamp} - ${message.author.username}: ${message.content}\n`;
    let skase = message.content;
    skase = skase.substring(1);
    genMp3File(skase, content);
  }
}

client.on("ready", async () => {
  console.log("Online.");
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.on("messageCreate", async (message) => {
  writeMsgToChannel(message, id);
  await sleep(150); 
  /*if(message.content == `${prefix}join`) {
    
  } */
  if(message.content[0] == "$") {
    joinVC(message, prefix);
  }

});

client.login(token);