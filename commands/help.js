const { MessageEmbed } = require('discord.js');
exports.run = async (client, message, args) => {
    if (args[0] && !isNaN(args[0])) return message.channel.send("Command name cannot be a number");
    if (!args[0]) args[0] = 'none';

    switch (args[0].toLowerCase()) {
        case ('ban'):
            message.channel.send("```css\n" + client.config.prefix + "ban <Page Number>\nAlias: " + client.config.prefix + "s```");
            break;
        case ('serverinfo'):
            message.channel.send("```css\n" + client.config.prefix + "serverinfo <Serial Number from Status command>\nAlias: " + client.config.prefix + "sinfo```");
        break;
        case ('kick'):
            message.channel.send("```css\n" + client.config.prefix + "kick <Serverid | ip:port | Serial No. from Status command> <page number>\nAlias: " + client.config.prefix + "p, " + client.config.prefix + "scoreboard```");
        break;
        case ('mute'):
            message.channel.send("```css\n" + client.config.prefix + "mute <name of the player | xuid of the player>\nAlias: " + client.config.prefix + "f```");
            break;
        case ('warn'):
            message.channel.send("```css\n" + client.config.prefix + "warn <client id from " + client.config.webfronturl + ">\nAlias: none```");
            break;
        case ('logs'):
            message.channel.send("```css\n" + client.config.prefix + "logs\nMethod: Your id and password for " + client.config.webfronturl + " will be asked in DM```");
            break;
        case ('invite'):
            message.channel.send("```css\n" + client.config.prefix + "invite\nAlias: none```");
            break;
        case ('profile'):
            message.channel.send("```css\n" + client.config.prefix + "profile <Serverid | ip:port | Serial No. from Status command> <!help>\nAlias: " + client.config.prefix + "e```");
            break;
        case ('botinfo'):
            message.channel.send("```css\n" + client.config.prefix + "botinfo\nAlias: " + client.config.prefix + "binfo```");
            break;
        case ('ping'):
            message.channel.send("```css\n" + client.config.prefix + "ping\nAlias: none```");
            break;
        default:
            const emc = new MessageEmbed()
                .setTitle('Help')
                .setColor(client.color)
                .setThumbnail(client.thumbnail)
                .setDescription("🔸 `" + client.config.prefix + "ban` - Shows all iw4m admin server's status\n" + "🔹 `" + client.config.prefix + "serverinfo` - Shows info about given server number\n" + "🔸 `" + client.config.prefix + "kick` - Shows player scoreboard for the given server\n" + "🔹 `" + client.config.prefix + "mute` - Shows name, iw4m client id and xuid of found clients\n" + "🔸 `" + client.config.prefix + "warn` - Shows all stats about the player\n" + "🔹 `" + client.config.prefix + "logs` - Asks you for login info in dm\n" + "🔸 `" + client.config.prefix + "invite` - Deletes your login and logs you out\n" + "🔹 `" + client.config.prefix + "profile` - profiles the command in the given server\n" + "🔹 `" + client.config.prefix + "botinfo` - Shows bot's overall status\n" + "🔸 `" + client.config.prefix + "ping` - Shows bot's latency to discord\n" + "```Use " + client.config.prefix + "help <command name> or " + client.config.prefix + "h <command name> to get more info about the command```")
                .setFooter(client.footer);
            message.channel.send({ embeds: [emc] });
    }
};

exports.conf = {
    aliases: ['h'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};