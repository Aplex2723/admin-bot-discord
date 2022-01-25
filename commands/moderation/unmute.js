const DB = require('../../helpers/db-functions')

const { messageEmbed } = require('../../helpers/messageEmbeds');
const { getMember } = require("../../helpers/functions")

const moment = require('moment')

exports.run = async (client, message, args) => {

    if (message.member.permissions.has('MANAGE_ROLES')) {
        const prefix = client.config.prefix
        
        if (!args[0]) {
            const opt = {
                title: `**🔊 Command: ${prefix}unmute`,
                fieldValue: 'Allows a memeber to send messages',
                field: `**🛠 Usdage:** ${prefix}unmute _[username/user-id]_ 
                \n**🔐 Required permissions:** ***MANAGE ROLES***
                \n**📝 Examples:** \n${prefix}mute ${message.member}\n${prefix}mute \`${message.member.id}\`
                `,
                color: 'random'
            }
            const unmuteEmbed = messageEmbed(opt, true)
            return message.channel.send({ embeds: [unmuteEmbed] })
        }
        
        const member = getMember(client, message, args)
        await message.channel.bulkDelete(1)
   
        const db = new DB()
        let querry = { server_id: message.guild.id }
        let roleMuted = await db.GetRoleMute(querry, 'role_id');
        if(!roleMuted){
            let opt = {
                title: `🟡 Your server has no Mute Role`,
                description: `Add a new Mute Role or Autocreate one using ${prefix}setmuterole or ${prefix}mute`,
                color: 'yellow'
            }
            const warningEmbed = messageEmbed( opt )
            message.channel.send({ embeds: [warningEmbed] })
        }

        let muteRole = message.guild.roles.cache.find(role => role.id === roleMuted)

        let role
        if (!message.guild.roles.cache.has(muteRole)) {
            role = muteRole
        } else {
            role = message.guild.roles.cache.get(muteRole)
        }

        // let roleFetch = db.fetch(`muteeid_${message.guild.id}_${member.id}`)
        querry = { server_id: message.guild.id, user_id: member.id }
        let roleFetch = await db.GetMembersDataSanctions(querry, 'roles')

        if (!roleFetch) return;

        if (!role) return message.channel.send("**There Is No Mute Role To Remove!**")

        if (!member.roles.cache.has(role.id)) {

            const options = {
                title: `❌ ${member} is alredy unmuted`,
                color: 'red'
            }
            const errorEmbed = messageEmbed(options)
            return message.channel.send({ embeds: [errorEmbed] })

        }

        try {
            querry.command = "mute"
            let reason = await db.GetMembersDataSanctions(querry, 'reason')

            const config = {
                    server_id: message.guild.id,
                    user_id: member.id,
                    user_name: member.user.username,
                    reason: reason,
                    made_by: message.author.username,
                    command: "unmute",
                    date: moment().format('MMMM Do YYYY, h:mm:ss a')
                }
            await db.SaveDataSactions(config)
            await db.SaveLogData(config)

            await member.roles.remove([role.id]).then(async () => {

                await message.channel.bulkDelete(1)
                const opt = {
                    description: `✅ ${member} has been unmuted!
                                \n**📝 Previous Reason:** ${reason}`,
                    color: 'green'
                }
                const msgEmbed = messageEmbed(opt).setFooter(message.author.username, client.user.displayAvatarURL())
                message.channel.send({ embeds: [msgEmbed] })

                let roleAdd = roleFetch
                if (!roleAdd) return;
                member.roles.add(roleAdd)

            }).catch((error) => {
                console.log(error)
                const options = {
                    description: `❌ Sorry, I'm unable to unmute ${member}`,
                    color: 'red'
                }
                const errorEmbed = messageEmbed(options)
                message.channel.send({ embeds: [errorEmbed] })
            })

        } catch(error) {
            console.log(error)
            let roleAddSecond = roleFetch
            if (!roleAddSecond) return
            member.roles.add(roleAddSecond)
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
    aliases: ['um'],
    permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}