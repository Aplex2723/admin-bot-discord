const { messageEmbed } = require('../helpers/messageEmbeds')

exports.run = async ( client, message, args ) => {

    if( message.member.permissions.has('MANAGE_MESSAGES')) {

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        const prefix = client.config.prefix

        if( !args[0] ) {

            const opt = {
                title: `⚠ **Command: ${prefix}warn**`,
                fieldValue: 'Make a warning for a user',
                field: `**🛠 Usage: **${prefix}warn _[username/user-id]_ _[reason]_
                \n**🔐 Required permissions:** ***MANAGE MESSAGES***
                \n**📝 Examples:** \n${prefix}warn ${message.member} _Example reason_\n${prefix}warn \`${message.member.id}\` _Example reason_
                `,
                color: 'random'
            } 
            const warnEmbed = messageEmbed( opt, true)
            return message.channel.send({ embeds: [warnEmbed] })
        }

        if( !member ) {
            
            return message.reply("Enter a valid member of this server")

        }

        let reason = args.slice(1).join(" ")
        if( !reason ) reason = "(No reason provided)"

        await message.channel.bulkDelete(1)
        member.send(`⚠ **You have been warned by \`${message.author.username}\` for the following reason:** __${reason}__`)
        .catch( error => message.channel.send(`Sorry <${message.author}> couldn't be warn because of: ${error}`))
        
        const opt = {
            title: `***⚠ WARN REPORT ⚠***`,
            description: `*<@${member.user.id}> has been warned by <@${message.author.id}>*`,
            fieldValue: '\u200b',
            field: `**⁉ Reason:** \`${reason}\`
                    \n**Action:** \`Warn\``,
            color: 'yellow',
            footer: `Given by ${message.author.username}`
        }
        const warnEmbed = messageEmbed( opt, true)
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