const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client({partials: ["GUILD_MEMBER"], intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "DIRECT_MESSAGES", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS"], fetchAllMembers: true });
 
if (!fs.existsSync("./config.json")) {
  console.log("config.json not found");
  process.exit();
}

client.config = require("./config.json");
client.function = require("./include/core.js");

client.function.configcheck(client);

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

["commandHandler"].forEach(x => require(`./helpers/${x}`)(client));

client.categories = fs.readdirSync("./commands/");

["commandHandler"].forEach(handler => {
    require(`./helpers/${handler}`)(client);
});

client.login(client.config.token);