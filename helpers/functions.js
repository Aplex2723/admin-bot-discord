const { messageEmbed } = require('../helpers/messageEmbeds');

const functions = {

    getMember: (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!member) {
            if (!member) {
                const opt = {
                    description: `**❌ Unvalid User or ID or the User is not in the server **`,
                    color: 'red'
                }
                const errEmbed = messageEmbed(opt)
                errEmbed.setFooter(message.author.username, client.user.displayAvatarURL())
                return message.channel.send({ embeds: [errEmbed] })
            }
        }
        
        return member

    },

    Pages: (arr, len) => {
        let chunks = [];
        let i = 0;
        let n = arr.length;

        while (i < n) {
        chunks.push(arr.slice(i, (i += len)));
        }

        return chunks;
    },

    paginationEmbed: async (msg, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
        if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
        if (!pages) throw new Error('Pages are not given.');
        if (emojiList.length !== 2) throw new Error('Need two emojis.');
        let page = 0;
        const curPage = await msg.channel.send({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)]});
        for (const emoji of emojiList) await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector(
            (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot,
            { time: timeout },
        );
        reactionCollector.on('collect', reaction => {
            reaction.users.remove(msg.author);
            switch (reaction.emoji.name) {
                case emojiList[0]:
                    page = page > 0 ? --page : pages.length - 1;
                    break;
                case emojiList[1]:
                    page = page + 1 < pages.length ? ++page : 0;
                    break;
                default:
                    break;
            }
            curPage.edit({ embeds: [pages[page].setFooter(`Page ${page + 1} / ${pages.length}`)]})
        });
        reactionCollector.on('end', () => {
            if (!curPage.deleted) {
                curPage.reactions.removeAll()
            }
        });
        return curPage;
    }
}

module.exports = functions