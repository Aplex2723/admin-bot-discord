const Discord = require('discord.js');

const messageEmbed = ( options, addFields = false) => {
    const message = new Discord.MessageEmbed()

    let values = {
        title: options.title,
        description: options.description,
        color: options.color,
        fieldValue: options.fieldValue,
        field: options.field,
        url: options.url,
        author: options.author,
        thumbnail: options.thumbnail,
        image: options.image,
        footer: options.footer
    }

    for( let key in values ){
        if( !values[key] ){
            values[key] = ''
        }
    }

    if( addFields ) {
        message.addField(values.fieldValue, values.field, true)
    } 

    message
        .setTitle(values.title)
        .setDescription(values.description)
        .setColor(values.color.toUpperCase())
        .setURL(values.url)
        .setAuthor(values.author)
        .setThumbnail(values.thumbnail)
        .setImage(values.image)
        .setFooter(values.footer)
        .setTimestamp();

    return message

    }


module.exports = {
    messageEmbed
}