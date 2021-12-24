const Discord = require('discord.js');
const { messageEmbed } = require('../helpers/messageEmbeds');
const DB = require('../helpers/db-functions')

exports.run = async(client, message, args) => {

    if( message.member.permissions.has('MANAGE_ROLES')) {
        const db = new DB()

        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])
        
        let reason = args.slice(1).join(" ");

        const prefix = client.config.prefix

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
        let querry = { channelId: message.guild.id }
        let roleMuted = await db.GetRoleMute( querry, 'role_id' );
            
        let muteRole = message.guild.roles.cache.find( role => role.id === roleMuted )

        let role
        if (!message.guild.roles.cache.has(muteRole)) {
            role = muteRole
        } else {
            role = message.guild.roles.cache.get(muteRole)
        }

        // let roleFetch = db.fetch(`muteeid_${message.guild.id}_${member.id}`)
        querry = { channelId: message.guild.id, user_id: member.id }
        let roleFetch = await db.GetMembersData( querry, 'roles' )

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
            console.log(role)
            await member.roles.remove([role.id]).then((id) => {

                const opt = {
                description: `✅ ${member} has been unmuted!
                                \n**Previous Reason:** ${reason || "No Reason"}`,
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

        // let channel = db.fetch(`modlog_${message.guild.id}`)
        // if (!channel) return;

        // let embed = new Discord.MessageEmbed()
        //     .setColor("RED")
        //     .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        //     .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
        //     .addField("**Moderation**", "unmute")
        //     .addField("**Unmuted**", member.user.username)
        //     .addField("**Moderator**", message.author.username)
        //     .addField("**Reason**", `${reason || "**No Reason**"}`)
        //     .addField("**Date**", message.createdAt.toLocaleString())
        //     .setFooter(message.member.displayName, message.author.displayAvatarURL())
        //     .setTimestamp();

        // var sChannel = message.guild.channels.cache.get(channel)
        // if (!sChannel) return;
        // sChannel.send({ embeds: [embed] })

        
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