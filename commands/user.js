const moment = require('moment')
const { messageEmbed } = require('../helpers/messageEmbeds')

exports.run = async (client, message, args) => {

    const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
    
    if ( !args[0] ) {
        
        const options = {
            
            title: `**🔍 Command: ${client.config.prefix}user**`,
            fieldValue: 'Display some information from a user.',
            field: `**🛠 Usage: **${client.config.prefix}user _[username/user_id]_
            \n**🧾 Aliases: **${client.config.prefix}search
            \n**📝 Examples: **\n ${client.config.prefix}user ${message.member}\n${client.config.prefix}search \`${message.member.id}\``,
            color: 'random'
            
        }
        const userEmbed = messageEmbed(options, true)
        return message.channel.send({ embeds: [userEmbed]});
        
    } else {

        let permissions = []
        let havePerms
        let acknowledgements
    
        if(member.permissions.has("KICK_MEMBERS")){
            permissions.push("\`Kick Members\`");
        }
        
        if(member.permissions.has("BAN_MEMBERS")){
            permissions.push("\`Ban Members\`");
        }
        
        if(member.permissions.has("ADMINISTRATOR")){
            permissions.push("\`Administrator\`");
        }
    
        if(member.permissions.has("MANAGE_MESSAGES")){
            permissions.push("\`Manage Messages\`");
        }
        
        if(member.permissions.has("MANAGE_CHANNELS")){
            permissions.push("\`Manage Channels\`");
        }
        
        if(member.permissions.has("MENTION_EVERYONE")){
            permissions.push("\`Mention Everyone\`");
        }
    
        if(member.permissions.has("MANAGE_NICKNAMES")){
            permissions.push("\`Manage Nicknames\`");
        }
    
        if(member.permissions.has("MANAGE_ROLES")){
            permissions.push("\`Manage Roles\`");
        }
    
        if(member.permissions.has("MANAGE_WEBHOOKS")){
            permissions.push("\`Manage Webhooks\`");
        }
    
        if(member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")){
            permissions.push("\`Manage Emojis\`");
        }
    
        if(!permissions.length == 0){
            havePerms = `\n**🔓 Permissions:** \n${permissions.join(' ')}`
        }

        const owner = await message.guild.fetchOwner()
        if(member.user.id == owner.id || member.permissions.has("ADMINISTRATOR") || member.permissions.has("MANAGE_MESSAGES") ){
            if( member.permissions.has("ADMINISTRATOR") ){
                acknowledgements = 'Admin'
            }
            if( member.permissions.has("MANAGE_MESSAGES") && !acknowledgements ){
                acknowledgements = 'Mod'
            } 
            if(member.user.id == owner.id) {
                acknowledgements = 'Owner'
            }
        }

        let isAdmin
        const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).slice(0, -1);
        if( acknowledgements ){

            if( acknowledgements === 'Admin' ){
                isAdmin = `\n**❗ Acknowledgements:** __**⚔ Server ADMINISTRATOR ⚔**__`
            } 
            if( acknowledgements === 'Mod' ){
                isAdmin = `\n**❗ Acknowledgements:** __**🛡 Server MODERATOR 🛡**__`
            }
            if( acknowledgements === 'Owner' ) {
                isAdmin = `\n**❗ Acknowledgements:** __**⭐ Server OWNER ⭐**__`
            }
        }
        
        const opt = {
            thumbnail: member.user.displayAvatarURL({ dynamic: true }),
            title: `${member.user.tag} Info:`,
            description: `<@${member.user.id}>`,
            fieldValue: `User ID: \`${member.user.id}\``,
            field: `\n**🧬 Username:** ${member.user.username}
                    **🔍 Nickname:** ${member.displayName} 
                    \n**📅 Join Date:** ${moment(member.joinedAt).format('MMMM D YYYY')}
                    **📆 Created On:** ${moment(member.user.createdTimestamp).format('MMMM D YYYY')}
                    \n**📑 Roles \`(${roles.length})\`:** \n${roles.length ? roles.join(', ') : 'No Roles'}
                    ${havePerms || ''}
                    ${isAdmin || ''}
                    `,
            color: 'random',
            footer: `Sent By: ${message.author.username}`
    
        }
        const userEmbed = messageEmbed( opt, true )
        message.channel.send({ embeds: [userEmbed] })

    }

}

exports.conf = {
    aliases: ['search'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}