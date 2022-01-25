const Discord = require('discord.js');
const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember } = require("../../helpers/functions")

exports.run = (client, message, args) => {
    if (message.member.permissions.has('MANAGE_ROLES')) {
        const prefix = client.config.prefix

        if (!member) {
            const opt = {
                title: `**✂ Command: ${prefix}removerole**`,
                fieldValue: 'Removes a role from a member',
                field: `**🛠 Usage:** ${prefix}removerole _[username/user-id]_
                        \n**🔐 Required permissions:** ***MANAGE ROLES***
                        \n**📝 Examples: \n${prefix}removerole ${message.member} **Role** \n${prefix}removerole \`${message.member.id}\`
                        `,
                color: 'random'
            }
            const headerEmbed = messageEmbed(opt, true)
            message.channel.send({ embeds: [headerEmbed] })
        } else {
            const member = getMember(client, message, args)

            const role = message.guild.roles.cache.find(role => role.name == args.slice(1).join(' '))

            if (!args.slice(1).join(' ')) {
                const opt = {
                    description: `❌ No role was provided.`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(opt)
                return message.channel.send({ embeds: [errorEmbed] })
            }

            if (!role) {
                const opt = {
                    description: `❌ The \`${args.slice(1).join(' ')}\` role was not found.`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(opt)
                message.channel.send({ embeds: [errorEmbed] })
            } else {
                member.roles.remove(role.id).then(() => {
                    const opt = {
                        description: `✅ The \`${role.name}\` role was removed from ${member}`,
                        color: 'red'
                    }
                    const msgEmbed = messageEmbed(opt)
                    message.channel.send({ embeds: [msgEmbed] })
                }).catch(error => {
                    console.log(error)
                    const opt = {
                        description: `❌ Unable to remove the \`${role.name}\` role from ${member}.`,
                        color: 'red'
                    }
                    const errorEmbed = messageEmbed(opt)
                    message.channel.send({ embeds: [errorEmbed] })

                })
            }
        }

    } else {
        const warningEmbed = new Discord.MessageEmbed()
            .setDescription('🔒 Sorry, you do not have sufficient permissions to do this.')
            .setColor('YELLOW');
        message.channel.send({ embeds: [warningEmbed] });
    }
}
exports.conf = {
    aliases: ['rr'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};