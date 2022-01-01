
const { messageEmbed } = require('../helpers/messageEmbeds')

exports.run = async(client, message, args) => {

    if( message.member.permissions.has('BAN_MEMBERS')){
        
        if ( !args[0] ) {
            
            const options = {
                
                title: `**💣 Command: ${client.config.prefix}unban**`,
                fieldValue: 'Unbans a member from the current server.',
                field: `**🛠 Usage: **${client.config.prefix}unban _[username/user_id]_
                \n**🧾 Aliases: **${client.config.prefix}ub
                \n**🔐 Required permissions: **BAN_MEMBERS
                \n**📝 Examples: **\n ${client.config.prefix}unban ${message.member}\n${client.config.prefix}ub \`${message.member.id}\``,
                color: 'random'
                
            }
            const banEmbed = messageEmbed(options, true)
            return message.channel.send({ embeds: [banEmbed]});
        } else {
            let bannedMemberAll = await message.guild.bans.fetch()
    
            let bannedMember = ( bannedMemberAll ).map( member => member.user.id )
            
            if( !bannedMember.includes(args[0]) ) {
                const opt = {
                    description: `**❌ Unvalid User or ID or the User is not Banned **`,
                    color: 'red'
                }
                const errEmbed = messageEmbed( opt )
                return message.channel.send({ embeds: [errEmbed] })
            }
    
            let reason = args.slice(1).join(' ')
    
            try {
                
                await message.guild.members.unban(args[0], {reason: reason})
        
                const options = {
                    description: `✅ ${args[0]} has been unbanned
                                \n**📝 Reason:** ${reason || "No reason"} `,
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
            description: '🔒 Sorry, you do not have sufficient permissions to do this.',
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