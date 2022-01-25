const Discord = require('discord.js');
const GphApiClient = require('giphy-js-sdk-core');
const giphkey = require('../../config.json');
const DB = require('../../helpers/db-functions')

const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember } = require("../../helpers/functions")
const moment = require('moment');

const giphy = GphApiClient(giphkey.giphy);

exports.run = async (client, message, args) => {
    if (message.member.permissions.has('BAN_MEMBERS')) {

        if (!args[0]) {

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
            return message.channel.send({ embeds: [banEmbed] });
        }


        else {
            const member = getMember(client, message, args)   

            let reason = args.slice(1).join(' ')
            const db = new DB()
            member.ban().then(async () => {

                await message.channel.bulkDelete(1)

                if (!reason) reason = "No reason"
                const config = {
                    server_id: message.guild.id,
                    user_id: member.id,
                    reason: reason,
                    command: "ban",
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                }
                await db.SaveDataSactions(config)

                config.made_by = message.author.username
                config.user_name = member.user.username
                await db.SaveLogData(config)

                giphy.search('gifs', { q: 'ban' }).then((response) => {
                    const totalResponses = response.data.length;
                    const responseIndex =
                        Math.floor(Math.random() * 10 + 1) % totalResponses;
                    const responseFinal = response.data[responseIndex];

                    const options = {
                        description: `✅ ${member} was banned.
                                    \n**📝Reason:** _${reason}_`,
                        color: 'green'
                    }
                    const msgEmbed = messageEmbed(options)

                    message.channel.send({ embeds: [msgEmbed] });
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
                message.channel.send({ embeds: [errorEmbed] });
            });

        }
    }
    else {
        const warningEmbed = new Discord.MessageEmbed()
            .setDescription('🔒 Sorry, you do not have sufficient permissions to do this.')
            .setColor('YELLOW');
        message.channel.send({ embeds: [warningEmbed] });
    }
}
exports.conf = {
    aliases: ['b'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};