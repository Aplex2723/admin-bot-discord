
const { messageEmbed } = require('../../helpers/messageEmbeds');

exports.run = async (client, message, args) => {

    if (message.member.permissions.has('BAN_MEMBERS')) {

        if (!args[0]) {

            const options = {

                title: `**๐ฃ Command: ${client.config.prefix}unban**`,
                fieldValue: 'Unbans a member from the current server.',
                field: `**๐  Usage: **${client.config.prefix}unban _[username/user_id]_
                \n**๐งพ Aliases: **${client.config.prefix}ub
                \n**๐ Required permissions: **BAN_MEMBERS
                \n**๐ Examples: **\n ${client.config.prefix}unban ${message.member}\n${client.config.prefix}ub \`${message.member.id}\``,
                color: 'random'

            }
            const banEmbed = messageEmbed(options, true)
            return message.channel.send({ embeds: [banEmbed] });
        } else {
            let bannedMemberAll = await message.guild.bans.fetch()

            let bannedMember = (bannedMemberAll).map(member => member.user.id)

            if (!bannedMember.includes(args[0])) {
                const opt = {
                    description: `**โ Unvalid User or ID or the User is not Banned **`,
                    color: 'red'
                }
                const errEmbed = messageEmbed(opt)
                return message.channel.send({ embeds: [errEmbed] })
            }

            try {

                await message.channel.bulkDelete(1)

                message.guild.members.unban(args[0])

                const options = {
                    description: `โ ${args[0]} has been **UNBANNED**`,
                    color: 'green'
                }
                const msgEmbed = messageEmbed(options)
                message.channel.send({ embeds: [msgEmbed] })

            } catch (error) {

                console.log(error)

            }
        }

    } else {
        const options = {
            description: '๐ Sorry, you do not have sufficient permissions to do this.',
            color: 'yellow'
        }
        const warningEmbed = messageEmbed(options)
        message.channel.send({ embeds: [warningEmbed] })
    }
}

exports.conf = {
    aliases: ['ub'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
};