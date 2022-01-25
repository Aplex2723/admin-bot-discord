const DB = require('../../helpers/db-functions')

const { messageEmbed } = require('../../helpers/messageEmbeds')
const { getMember } = require("../../helpers/functions")

const moment = require('moment')

exports.run = async (client, message, args) => {

    if (message.member.permissions.has('MANAGE_MESSAGES')) {
        const prefix = client.config.prefix

        if (!args[0]) {

            let opt = {
                title: `⚠ **Command: ${prefix}warn**`,
                fieldValue: 'Make a warning for a user',
                field: `**🛠 Usage: **${prefix}warn _[username/user-id]_ _[reason]_
                \n**🔐 Required permissions:** ***MANAGE MESSAGES***
                \n**📝 Examples:** \n${prefix}warn ${message.member} _Example reason_\n${prefix}warn \`${message.member.id}\` _Example reason_
                `,
                color: 'random'
            }
            const warnEmbed = messageEmbed(opt, true)
            return message.channel.send({ embeds: [warnEmbed] })
        } 
        
        const db = new DB()
        const member = getMember(client, message, args)

        let reason = args.slice(1).join(" ")
        if(!reason) reason = "No reason"

        console.log(member.user.username)
        const config = {
            server_id: message.guild.id,
            user_id: member.id,
            user_name: member.user.username,
            made_by: message.author.username,
            reason: reason,
            command: "warn",
            date: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        await db.SaveLogData( config )

        await message.channel.bulkDelete(1)

        let opt = {
            title: `⚠ Warning`,
            description: `**You have been warned in \`${message.guild.name}\` for the following reason:** __${reason}__`,
            color: 'yellow'
        }
        const userEmbed = messageEmbed( opt )
        member.send({ embeds: [userEmbed] })
            .catch(error => message.channel.send(`Sorry <${message.author}> couldn't be warn because of: ${error}`))

        opt = {
            title: `***⚠ WARN REPORT ⚠***`,
            description: `*<@${member.user.id}> has been warned*`,
            fieldValue: '\u200b',
            field: `**⁉ Reason:** \`${reason}\`
                    \n**Action:** \`Warn\``,
            color: 'yellow'
        }
        const warnEmbed = messageEmbed(opt, true).setFooter(`Given by ${message.author.username}`, client.user.displayAvatarURL())
        message.channel.send({ embeds: [warnEmbed] })


    } else {

        const options = {
            description: '🔒 Sorry, you do not have sufficient permissions to do this.',
            color: 'yellow'
        }
        const warningEmbed = messageEmbed(options)
        message.channel.send({ embeds: [warningEmbed] })
    }
}

exports.conf = {
    aliases: ['w'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}