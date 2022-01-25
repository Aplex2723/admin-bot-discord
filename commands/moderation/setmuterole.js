const DB = require('../../helpers/db-functions')

const { getMember } = require("../../helpers/functions")

exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has("ADMINISTRATOR"))
    return message.channel.send(
      "**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**"
    );

    const db = new DB()
    
    if (!args[0]) {
      const querry = { server_id: message.guild.id }
      const muteRole = await db.GetRoleMute(querry, 'role_id')
      
      let roleName = message.guild.roles.cache.get(muteRole);
      
      if (message.guild.roles.cache.has(muteRole)) {
        return message.channel.send(
        `**Muterole Set In This Server Is \`${roleName.name}\`!**`
        );
      } else
      return message.channel.send(
        "**Please Enter A Role Name or ID To Set!**"
        );
      }
      
    let role =
    message.mentions.roles.first() ||
    bot.guilds.cache.get(message.guild.id).roles.cache.get(args[0]) ||
    message.guild.roles.cache.find(
      c => c.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
      );
        
  if (!role)
    return message.channel.send("**Please Enter A Valid Role Name or ID!**");

  try {
    const querry = { channelId: message.guild.id }
    const roleFound = await db.GetRoleMute(querry, 'role_id')

    if (role.id === roleFound) {
      return message.channel.send(
        "**This Role is Already Set As Muterole!**"
      );
    } else {

      db.SetNewMuteRole({ server_id: message.guild.id, role_id: role.id })

      message.channel.send(
        `**\`${role.name}\` Has Been Set Successfully As Muterole!**`
      );

    }
  } catch (e) {
    return message.channel.send(
      "**Error - `Missing Permissions or Role Doesn't Exist!`**",
      `\n${e.message}`
    );
  }
}

exports.conf = {
  aliases: ['setmute'],
  permissions: ['SEND_MESSAGES', 'EMBED_LINKS']
}