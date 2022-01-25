const { readdirSync } = require("fs")

module.exports = (client) => {
    const load = dirs => {
        const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../commands/${dirs}/${file}`);
            let commandName = file.split(".")[0];
            client.commands.set(commandName, pull);
          };
        };
    ["misc", "moderation"].forEach(x => load (x))
}