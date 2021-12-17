const Discord = require('discord.js');
const { messageEmbed } = require('../helpers/messageEmbeds');
const db = require('quick.db')
// const { getData, deleteData } = require('../include/dbutils');

exports.run = async(client, message, args) => {

    if( message.member.permissions.has('MANAGE_ROLES')) {
        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        
        let reason = args.slice(1).join(" ");

        const prefix = client.config.prefix
        const roleMuted = client.config.muteRole

        if( !args[0] ) {
            const opt = {
                title: `**🔊 Command: ${prefix}unmute`,
                fieldValue: 'Allows a memeber to send messages',
                field: `**🛠 Usdage:** ${prefix}unmute _[username/user-id]_ 
                        \n**🔐 Required permissions:** ***MANAGE ROLES***
                        \n**📝 Examples:** \n${prefix}mute ${message.member}\n${prefix}mute \`${message.member.id}\`
                        `,
                color: 'random'
            }
            const unmuteEmbed = messageEmbed( opt, true )
            return message.channel.send({ embeds: [unmuteEmbed] })
        }
            
        let muteRole = message.guild.roles.cache.find( role => role.name.includes( roleMuted) )

        let role
        let dbmute = await db.fetch(`muterole_${message.guild.id}`);

        if (!message.guild.roles.cache.has(dbmute)) {
            role = muteRole
        } else {
            role = message.guild.roles.cache.get(dbmute)
        }

        let roleFetch = db.fetch(`muteeid_${message.guild.id}_${member.id}`)

        if (!roleFetch) return;

        if (!role) return message.channel.send("**There Is No Mute Role To Remove!**")

        if( !member.roles.cache.has(role.id) ) {

            const options = {
                title: `❌ ${member} is alredy unmuted`,
                color: 'red'
            }
            const errorEmbed = messageEmbed(options)
            return message.channel.send({ embeds: [errorEmbed] })

        }

        try {
            console.log('Before remove role')
            console.log(member.roles)
            await member.roles.remove([role.id]).then((id) => {

                const opt = {
                description: `✅ ${member} has been unmuted!
                                \n**Previous Reason:** ${reason || "No Reason"}
                                \n${id}`,
                    color: 'green'
                }
                const msgEmbed = messageEmbed( opt )
                message.channel.send({ embeds: [msgEmbed] })

                let roleAdd = roleFetch
                if( !roleAdd ) return;
                member.roles.add(roleAdd)

            }).catch( (error) => {
                console.log(error)
                const options = {
                    description: `❌ Sorry, I'm unable to unmute ${member}`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(options)
                message.channel.send({ embeds: [errorEmbed] })  
            })
            
        } catch {
            let roleAddSecond = roleFetch
            if( !roleAddSecond ) return
            member.roles.add(roleAddSecond)
        }

        let channel = db.fetch(`modlog_${message.guild.id}`)
        if (!channel) return;

        let embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
            .addField("**Moderation**", "unmute")
            .addField("**Unmuted**", member.user.username)
            .addField("**Moderator**", message.author.username)
            .addField("**Reason**", `${reason || "**No Reason**"}`)
            .addField("**Date**", message.createdAt.toLocaleString())
            .setFooter(message.member.displayName, message.author.displayAvatarURL())
            .setTimestamp();

        var sChannel = message.guild.channels.cache.get(channel)
        if (!sChannel) return;
        sChannel.send({ embeds: [embed] })

        
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
    aliases: ['um'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}