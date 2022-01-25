const DB = require("../../helpers/db-functions")
const GphApiClient = require('giphy-js-sdk-core');
const giphkey = require('../../config.json');

const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember } = require("../../helpers/functions")

const giphy = GphApiClient(giphkey.giphy);

exports.run = async (client, message, args) => {
    if (message.member.permissions.has('KICK_MEMBERS')) {
        const prefix = client.config.prefix

        if (!args[0]) {
            const options = {
                title: `**🚪 Command: ${prefix}kick**`,
                fieldValue: `Kicking a member off the server`,
                field: `**Usage:** ${prefix}kick _[username_/user_id]_
                        \n**🔐 Required permissions:** ***KICK MEMBERS***
                        \n**📝 Examples: **\n${prefix}kick ${message.member}\n${prefix}kick \`${message.member.id}\`
                        `,
                color: 'random'
            }
            const kickEmbed = messageEmbed(options, true)
            message.channel.send({ embeds: [kickEmbed] })
        } else {
            const db = new DB()
            let reason = args.slice(1).join(" ")
            if(!reason) reason = "No reason"

            const member = getMember(client, message, args)   
            const config = {
                server_id: message.guild.id,
                user_id: member.id,
                mode_by: message.author.username,
                user_name: member.user.username,
                reason: reason,
                sanction: "kick",
                date: moment().format('MMMM Do YYYY, h:mm:ss a')
            }
            await db.SaveLogData( config )

            member.kick().then(() => {

                giphy.search('gifs', { q: 'kick' }).then(res => {
                    const totalResponses = res.data.length
                    const responseIndex = Math.floor(Math.random() * 10 + 1) % totalResponses
                    const responseFinal = res.data[responseIndex]

                    const options = {
                        description: `✅ ${member} was kicked. \n**📝 Reason:** __${reason}__`,
                        color: 'green'
                    }
                    const msgEmbed = messageEmbed(options)
                    message.channel.send({ embeds: [msgEmbed] })
                    message.channel.send({
                        files: [responseFinal.images.fixed_height.url],
                    })
                })
            }).catch((error) => {
                console.log(error)
                const options = {
                    description: `❌ Unable to kick ${member}`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(options)
                message.channel.send({ embeds: [errorEmbed] })
            })
        }
    } else {
        const options = {
            description: `🔒 Sorry, you do not have sufficient permissions to do this.`,
            color: 'yellow'
        }
        const warningEmbed = messageEmbed(options)
        message.channel.send({ embeds: [warningEmbed] })
    }
}

exports.conf = {
    aliases: ['k'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};