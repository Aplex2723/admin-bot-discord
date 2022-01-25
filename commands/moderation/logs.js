const DB = require('../../helpers/db-functions')
const { MessageEmbed } = require('discord.js')

const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember, Pages, paginationEmbed } = require("../../helpers/functions")

const db = new DB()

exports.run = async(client, message, args) => {
    if( message.member.permissions.has('MANAGE_ROLES')) {
        const logEmbedsWithPagination = async(data, member = null) => {

            if( data.length == 0 ){
                const opt = {
                    title: '❗ **No Logs found**',
                    description: `No server or user activity log found`,
                    color: 'red'
                }
                const embedError = messageEmbed( opt )
                return message.reply({ embeds: [embedError] })
            }

            let username;
            if( member ) username = `🗓 Last Logs of ${member.user.tag}`
            
            const MAX_FIELDS = 10
        
            const fields = data.map( (n) => {
                const { user_name, command, reason, made_by, date } = n
                
                return {
                    name: `\n📋**User:** \`${user_name}\``,
                    value: `⚠**Command:** \`${command.toUpperCase()}\` 🔹 📄**Reason:** \`${reason}\`\n⤷  **Made By:** \`${made_by}\` **Date:** \`${date}\`\n`,
                }
            })
            
            if( data.length <= MAX_FIELDS ){
                const embed = new MessageEmbed()
                .setTitle(username || `🗓 Last ${MAX_FIELDS} Logs made`)
                .setDescription(`The following list shows all the logs made on your server, if you have more than ${MAX_FIELDS} logs, buttons are displayed at the bottom`)
                .setColor("RANDOM")
                .setFooter(message.author.username, client.user.displayAvatarURL())
                .addFields(fields)

                if(member) embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                
                return message.channel.send({ embeds: [embed] })
                        
            }
                    
            const chunks = Pages(fields, MAX_FIELDS)
            const pages = []
        
            chunks.forEach((chunk) => {

                const embed = new MessageEmbed()
                    .setTitle(username || `🗓 Logs History`)
                    .setColor('RANDOM')
                    .setDescription(`The following list shows all the logs made on your server, if you have more than ${MAX_FIELDS} logs, buttons are displayed at the bottom`)
                    .setFooter(message.author.username, client.user.displayAvatarURL())
                    .addFields(chunk)
                    
                    if(member) embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                    
                pages.push(embed)
                    
                })
                
                paginationEmbed(message, pages);
                
        }
        
        if(!args[0]) {
            
            let querry = { server_id: message.guild.id }
            let data = await db.GetLogData( querry )
            
            logEmbedsWithPagination( data )
            
        } else {
            
            const member = getMember(client, message, args)

            let querry = { server_id: message.guild.id, user_id: member.id }
            let data = await db.GetLogData( querry )

            logEmbedsWithPagination(data, member)
                        
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
    aliases: ['log'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}
