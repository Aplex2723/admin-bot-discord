const Discord = require('discord.js');
const { messageEmbed } = require('../helpers/messageEmbeds');

exports.run = async(client, message, args) => {

    if( message.member.permissions.has('MANAGE_ROLES')){
        console.log(args)
        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
    
        console.log(member)
        if( !member ){
            const options = {
                title: `**✏ Command: ${client.config.prefix}addrole**`,
                fieldValue: `Adds the specified role to a member`,
                field :`**🛠 Usage: **${client.config.prefix}addrole _[username/user-id]_ \`<role-name>\`
                        \n**🔐 Required permissions:** ***MANAGE ROLE***
                        \n**📝 Examples: **\n${client.config.prefix}addrole ${message.member} Mod\n${client.config.prefix}addrole \`${message.member.id}\` Some Role`,
                color: 'RANDOM'
            }
            const addroleEmbed = messageEmbed( options, true )
            message.channel.send( {embeds: [addroleEmbed]} )
        }else {
            const role = message.guild.roles.cache.find(role => role.name == args.slice(1).join(' ') )
            if( !args.slice(1).join(' ') ){
                const options = {
                    description: '❌ No role was provided.',
                    color: 'RED'
                }
                const errorEmbed = messageEmbed( options )
                return message.channel.send( {embeds: [errorEmbed]} )
            }
    
            if( !role ){
                const options = {
                    description: `❌ The \`${args.slice(1).join(' ')}\` role was not found.`,
                    color: 'RED'
                }
                const errorEmbed = messageEmbed( options )
                return message.channel.send( {embeds: [errorEmbed]} )
            }
    
            if( member.roles.cache.has(role.id)){
                const options = {
                    description: `❌ ${member} already has the \`${role.name}\` role.`,
                    color: 'RED'
                }
                const errorEmbed = messageEmbed( options )
                return message.channel.send({ embeds: [errorEmbed] });
            }
            else {
                member.roles.add(role.id).then(() => {
                    const options = {
                        description: `✅ ${member} was given the \`${role.name}\` role.`,
                        color: 'GREEN'
                    }
                    const msgEmbed = messageEmbed( options )
                    message.channel.send({ embeds: [msgEmbed] });
                }).catch( error => {
                    console.log(error)
                    const options = {
                        description: `❌ Unable to add the \`${role.name}\` role to ${member}`,
                        color: 'RED'
                    }
                    const errorEmbed = messageEmbed( options )
                    message.channel.send({ embeds: [errorEmbed] });
                } )
            }
        }
    }else {
      const warningEmbed = new Discord.MessageEmbed()
        .setDescription('🔒 Sorry, you do not have sufficient permissions to do this.')
        .setColor('YELLOW');
      message.channel.send({ embeds: [warningEmbed] });
    }
}

exports.conf = {
    aliases: ['ar'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES']
};