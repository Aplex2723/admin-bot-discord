const Discord = require('discord.js');
const { messageEmbed } = require('../helpers/messageEmbeds');
const DB = require('../helpers/db-functions')

exports.run = async(client, message, args) => {
    const prefix = client.config.prefix
    
    if( message.member.permissions.has('MANAGE_ROLES')) {
        const db = new DB()
        
        const member = message.mentions.members.first() || await message.guild.members.fetch(args[0])

        let reason = args.slice(1).join(" ")
        
        if( !args[0] ) {
            const options = {
                title: `**🔇 Command: ${prefix}mute**`,
                fieldValue: 'The user is not able to send messages or add reactions',
                field: `**🛠 Usage: **${prefix}mute _[username/user-id]_ _[reason]_
                \n**🔐 Required permissions:** ***MANAGE ROLES***
                \n**📝 Examples:** \n${prefix}mute ${message.member} _Example reason_\n${prefix}mute \`${message.member.id}\` _Example reason_
                `,
                color: 'random'
            } 
            const muteEmbed = messageEmbed( options, true)
            return message.channel.send({ embeds: [muteEmbed] })
        } else { 

            const querry = { channelId: message.guild.id }
            const roleMuted = await db.GetRoleMute( querry, 'role_id' )
            let muteRole = message.guild.roles.cache.find( role => role.id === roleMuted )

            if (message.author.bot) return message.channel.send("**🦾 Cannot Mute Bots!**");

            const userRoles = member.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.id)

            let role
            // let dbmute = await db.fetch(`muterole_${message.guild.id}`);
            // const dbmute = await db.GetRoleMute( querry, 'role_id' )

            if (!message.guild.roles.cache.has(muteRole)) {
                role = muteRole
            } else {
                role = message.guild.roles.cache.get(muteRole)
            }
            
            if( member.roles.cache.has(role.id) ) {
                const options = {
                    title: `❌ ${member} is alredy muted`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(options)
                return message.channel.send({ embeds: [errorEmbed] })
            }
            
            if( member.permissions.has('ADMINISTRATOR') ) {
                const options = {
                    title: `❌ Unable to do that because ${member} is an **Admin**`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(options)
                return message.channel.send({ embeds: [errorEmbed] })
            }
            
            if( !role ) {

                role = message.guild.roles.create({
                    name: 'Muted 🔇',
                    color: 'DARK_GREEN',
                    permissions: ['READ_MESSAGE_HISTORY']
                }).then( muteRole => {
                    member.roles.add(muteRole)
                    const options = {
                        description: `✅ ${member} has been muted nad the role has been created \n***SET THE NEW ROLE WITH*** ${prefix}setmuterole <role_id>`,
                        color: 'green'
                    }
                    const msgEmbed = messageEmbed(options)
                    message.channel.send({ embeds: [msgEmbed] })

                    db.SetNewMuteRole( { querry, role_id: muteRole.id })
                    console.log(`Role ${muteRole.id} created in DB`)

                }).catch( error => {
                    console.log(error)
                    const options = {
                        description: `❌ Unable to mute ${member}.`,
                        color: 'red'
                    }
                    const errorEmbed = messageEmbed(options)
                    message.channel.send({ embeds: [errorEmbed] })
                })
                
            } else {

                // db.set(`muteeid_${message.guild.id}_${member.id}`, userRoles)
                const config = {
                    channelId: message.guild.id,
                    user_id: member.id,
                    roles: userRoles
                }
                await db.SaveData( config )

                try {
                    await member.roles.set( [role.id] ).then( async() => {
                        const options = {
                            description: `✅ ${member} has been muted.
                                            \n**Reason:** ${reason || "No Reason"}`,
                            color: 'green'
                        }
                        const msgEmbed = messageEmbed(options)
                        message.channel.send({ embeds: [msgEmbed] })
    
                    }).catch( error => {
                        console.log(error)
                        const options = {
                            description: `❌ Unable to mute ${member}.`,
                            color: 'red'
                        }
                        const errorEmbed = messageEmbed(options)
                        message.channel.send({ embeds: [errorEmbed] })                   
                    })
                    
                } catch {
                   member.roles.set([role.id])
                }

                // let channel = db.fetch(`modlog_${message.guild.id}`)
                // if (!channel) return;

                // let embed = new Discord.MessageEmbed()
                //     .setColor('RED')
                //     .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                //     .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                //     .addField("**Moderation**", "mute")
                //     .addField("**Member**", member.user.username)
                //     .addField("**Moderator**", message.author.username)
                //     .addField("**Reason**", `${reason || "**No Reason**"}`)
                //     .addField("**Date**", message.createdAt.toLocaleString())
                //     .setFooter(message.member.displayName, message.author.displayAvatarURL())
                //     .setTimestamp()

                // let sChannel = message.guild.channels.cache.get(channel)
                // if (!sChannel) return;
                // sChannel.send({embeds: [embed]})
            
            }

            message.channel.permissionOverwrites.edit( muteRole.id, {
                SEND_MESSAGES: false,
                ADD_REACTIONS: false,
            })

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
    aliases: ['m'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}