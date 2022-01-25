const DB = require('../../helpers/db-functions')

const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember } = require("../../helpers/functions")

const moment = require('moment');

exports.run = async (client, message, args) => {
    const prefix = client.config.prefix

    if (message.member.permissions.has('MANAGE_ROLES')) {

        if (!args[0]) {
            const options = {
                title: `**🔇 Command: ${prefix}mute**`,
                fieldValue: 'The user is not able to send messages or add reactions',
                field: `**🛠 Usage: **${prefix}mute _[username/user-id]_ _[reason]_
                \n**🔐 Required permissions:** ***MANAGE ROLES***
                \n**📝 Examples:** \n${prefix}mute ${message.member} _Example reason_\n${prefix}mute \`${message.member.id}\` _Example reason_
                `,
                color: 'random'
            }
            const muteEmbed = messageEmbed(options, true)
            return message.channel.send({ embeds: [muteEmbed] })
        } else {

            const member = getMember(client, message, args)

            const db = new DB()
            let reason = args.slice(1).join(" ")
            let role

            const querry = { server_id: message.guild.id }
            const roleMuted = await db.GetRoleMute(querry, 'role_id')
            if (!roleMuted) {
                const opt = {
                    title: `🟡 **Pleace SET or CREATE a Mute role first**`,
                    description: `You can automatically generate a Mute Role called Muted 🔇, if you want just type YES, if not type NO or anything else`,
                    footer: 'To set one role use !setmuterole [role]',
                    color: "yellow"
                }
                const warningEmbed = messageEmbed(opt)
                message.channel.send({ embeds: [warningEmbed] })

                const msg_filter = (m) => m.author.id === message.author.id;
                const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
                if (collected.first().content.toLowerCase() === "yes") {

                    role = message.guild.roles.create({
                        name: 'Muted 🔇',
                        color: 'DARK_GREEN',
                        permissions: ['READ_MESSAGE_HISTORY']
                    }).then(async muteRole => {
                        const options = {
                            description: `✅ Role ${muteRole.name} has been created \n\n***Try mute again with*** ${prefix}mute`,
                            color: 'green'
                        }
                        const msgEmbed = messageEmbed(options)
                        message.channel.send({ embeds: [msgEmbed] })

                        await db.SetNewMuteRole({ server_id: message.guild.id, role_id: muteRole.id })

                        const config = {
                            server_id: message.guild.id,
                            user_id: member.id,
                            made_by: message.author.username,
                            reason: "Auto Mute Role creation",
                            command: "muterole",
                            date: moment().format('MMMM Do YYYY, h:mm:ss a')
                        }
                        await db.SaveLogData(config)

                    }).catch(error => {
                        console.log(error)
                        const options = {
                            description: `❌ Unable to mute ${member}.`,
                            color: 'red'
                        }
                        const errorEmbed = messageEmbed(options)
                        message.channel.send({ embeds: [errorEmbed] })
                    })
                } else {
                    return message.reply('Operation canceled. To set a Mute Role use the command !setmuterole');
                }

            } else {

                let muteRole = message.guild.roles.cache.find(role => role.id === roleMuted)

                if (message.author.bot) return message.channel.send("**🦾 Cannot Mute Bots!**");

                const userRoles = member.roles.cache
                    .filter(r => r.id !== message.guild.id)
                    .map(r => r.id)

                if (!message.guild.roles.cache.has(muteRole)) {
                    role = muteRole
                } else {
                    role = message.guild.roles.cache.get(muteRole)
                }


                if (member.roles.cache.has(role.id)) {
                    const options = {
                        title: `❌ ${member} is alredy muted`,
                        color: 'red'
                    }
                    const errorEmbed = messageEmbed(options)
                    return message.channel.send({ embeds: [errorEmbed] })
                }

                if (member.permissions.has('ADMINISTRATOR')) {
                    const options = {
                        title: `❌ Unable to do that because ${member} is an **Admin**`,
                        color: 'red'
                    }
                    const errorEmbed = messageEmbed(options)
                    return message.channel.send({ embeds: [errorEmbed] })
                }

                if (!role) {

                    console.log(error)

                } else {

                    // db.set(`muteeid_${message.guild.id}_${member.id}`, userRoles)
                    if (!reason) reason = "No reason"
                    const config = {
                        server_id: message.guild.id,
                        user_id: member.id,
                        user_name: member.user.username,
                        roles: userRoles,
                        reason: reason,
                        command: "mute",
                        date: moment().format('MMMM Do YYYY, h:mm:ss a')
                    }
                    await db.SaveDataSactions(config)

                    config.made_by = message.author.username
                    delete config.roles
                    await db.SaveLogData(config)

                    try {
                        await member.roles.set([role.id]).then(async () => {
                            await message.channel.bulkDelete(1)
                            member.send(`🔇 **You have been muted in \`${message.guild.name}\` for the following reason:** __${reason || "(No reason provided)"}__`)
                            const options = {
                                description: `✅ ${member} has been muted.
                                            \n**📝 Reason:** ${reason}`,
                                color: 'green'
                            }
                            const msgEmbed = messageEmbed(options).setFooter(message.author.username, client.user.displayAvatarURL())
                            message.channel.send({ embeds: [msgEmbed] })

                        }).catch(error => {
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

                }

                message.channel.permissionOverwrites.edit(muteRole.id, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                })
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
    aliases: ['m'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}