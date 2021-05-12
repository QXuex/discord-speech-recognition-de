import {DiscordSR} from '../src/index';
import {BOT_TOKEN} from '../config.json';
import {Client, MessageEmbed} from 'discord.js';
import {VoiceMessage} from '../src/bot/voiceMessage';
import wav from 'wav';

const client = new Client();
const discordsr = new DiscordSR(client);

client.on('message', async (message) => {
  if (!message.member) return;

  if (message.member?.voice.channel && message.content.startsWith('!join')) {
    await message.member?.voice.channel.join();
  }
});

client.on('speech', (message: VoiceMessage) => {
  if (message.content.length > 0) {
    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(message.channel.name)
        .setThumbnail(message.author.avatarURL())
        .addField(message.author.username, message.content)
        .addField('Duration:', message.duration + 's')
        .addField('Guild:', message.guild);

    const outputFile = new wav.FileWriter('./test.wav', {
      sampleRate: 48000,
      channels: 2,
    });
    outputFile.write(message.audioBuffer);
    outputFile.end();

    message.author.send(embed);
    message.author.send({files: ['./test.wav']});
  }
});

client.login(BOT_TOKEN);