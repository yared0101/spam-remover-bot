const { Telegraf } = require("telegraf");
const { helpStrings } = require("../../config");
/**
 *
 * @param {Telegraf} bot
 * @returns
 */
module.exports = async (bot) => {
    bot.command("start", async (ctx) => {
        try {
            await ctx.reply(helpStrings.startMessage);
        } catch {}
    });
};
