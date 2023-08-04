/*

   Copyright 2023 Pratelli Mattia

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

const Discord = require('discord.js');
const YAML = require('yaml');
const fs = require('fs');

let config = {};
try {
  config = YAML.parse(fs.readFileSync("./config.yml", "utf-8"), { prettyErrors: true })
} catch (err) {
  console.error(err);
}

client = new Discord.Client({
  intents: Object.keys(Discord.Intents.FLAGS).map(x => Discord.Intents.FLAGS[x])
});

client.on('ready', () => {
  console.log(`Bot connected as ${client.user.tag}!`);
  updateMemberCount();
  setInterval(updateMemberCount, 5 * 60 * 1000);
});

async function updateMemberCount() {
  const guild = client.guilds.cache.get(config.Server_ID);
  if (!guild) {
    console.warn(`The server with ID "${config.Server_ID}" was not found. Make sure the ID is correct.`);
    return;
  }
  const memberCount = guild.memberCount;
  const botCount = guild.members.cache.filter(member => member.user.bot).size;
  const userCount = memberCount - botCount;
  if (config.Status.Member.Enabled) {
    const member_channel = guild.channels.cache.get(config.Status.Member.Channel_ID);
    if (!member_channel) {
      console.warn(`The channel with ID "${config.Status.Member.Channel_ID}" was not found. Make sure the ID is correct.`);
      return;
    } else {
      const memberChannelName = `${config.Status.Member.Channel_Name}${memberCount}`;
      if (member_channel.name != memberChannelName) {
        await member_channel.setName(memberChannelName);
      }
    }
  }

  if (config.Status.Bot.Enabled) {
    const bot_channel = guild.channels.cache.get(config.Status.Bot.Channel_ID);
    if (!bot_channel) {
      console.warn(`The channel with ID "${config.Status.Bot.Channel_ID}" was not found. Make sure the ID is correct.`);
      return;
    } else {
      const botChannelName = `${config.Status.Bot.Channel_Name}${botCount}`;
      if (bot_channel.name != botChannelName) {
        await bot_channel.setName(botChannelName);
      }
    }
  }

  if (config.Status.User.Enabled) {
    const user_channel = guild.channels.cache.get(config.Status.User.Channel_ID);
    if (!user_channel) {
      console.warn(`The channel with ID "${config.Status.User.Channel_ID}" was not found. Make sure the ID is correct.`);
      return;
    } else {
      const userChannelName = `${config.Status.User.Channel_Name}${userCount}`;
      if (user_channel.name != userChannelName) {
        await user_channel.setName(userChannelName);
      }
    }
  }
}

client.login(config.Token);