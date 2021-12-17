const Discord = require('discord.js');
const GphApiClient = require('giphy-js-sdk-core');
const giphkey = require('../config.json');
const { messageEmbed } = require('../helpers/messageEmbeds');
const giphy = GphApiClient(giphkey.giphy);


exports.run = async(client, message, args) => {
if (message.member.permissions.has('BAN_MEMBERS')) {
    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])

    const reason = args.slice(1).join(' ')

    if ( !args[0] ) {
    
        const options = {

            title: `**💣 Command: ${client.config.prefix}ban**`,
            fieldValue: 'Bans a member from the current server.',
            field: `**🛠 Usage: **${client.config.prefix}ban _[username/user_id]_ _[reason]_
            \n**🧾 Aliases: **${client.config.prefix}banish
            \n**🔐 Required permissions: **BAN_MEMBERS
            \n**📝 Examples: **\n ${client.config.prefix}ban ${message.member}\n${client.config.prefix}banish \`${message.member.id}\``,
            color: 'random'

        }
        const banEmbed = messageEmbed(options, true)
        return message.channel.send({ embeds: [banEmbed]});
    }
    else {
    member.ban().then(() => {
        giphy.search('gifs', { q: 'ban' }).then((response) => {
        const totalResponses = response.data.length;
        const responseIndex =
                Math.floor(Math.random() * 10 + 1) % totalResponses;
        const responseFinal = response.data[responseIndex];

        const options = {
            description: `✅ ${member} was banned.
                        \n**📝Reason:** _${reason}`,
            color: 'green'
        }
        const msgEmbed = messageEmbed(options)

        message.channel.send({ embeds: [msgEmbed]});
        message.channel.send({
            files: [responseFinal.images.fixed_height.url],
        });
        });
    }).catch((error) => {
        console.log(error);

        const options = {
            description: `❌ Unable to ban ${member}`,
            color: 'red'
        }
        const errorEmbed = messageEmbed(options)
        message.channel.send({ embeds: [errorEmbed]});
    });
    }
}
else {
    const warningEmbed = new Discord.MessageEmbed()
        .setDescription('🔒 Sorry, you do not have sufficient permissions to do this.')
        .setColor('YELLOW');
    message.channel.send({ embeds: [warningEmbed]});
}
}
exports.conf = {
    aliases: ['b'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};