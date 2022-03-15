require("dotenv").config();
const { Telegraf } = require("telegraf");
// const { Composer } = require("micro-bot");
const bot = new Telegraf(process.env.BOT_TOKEN);
// const bot = new Composer();
// bot.init = async (mBot) => {
// bot.telegram = mBot.telegram;
// };
const { writeFileSync, readFileSync } = require("fs");
const admin = process.env.ADMIN;

const startCommand = require("./src/commands/start");
startCommand(bot);

const helpCommand = require("./src/commands/help");
const { helpStrings } = require("./config");

helpCommand(bot);
bot.use(async (ctx, next) => {
    const a = await bot.telegram.createChatInviteLink("@spam_prob_group", {
        creates_join_request: true,
    });
    ctx.reply(a.invite_link);
    console.log(a.creates_join_request, a.pending_join_request_count);
    next();
});
bot.on("chat_member", (ctx) => {
    console.log("-----------------------------");
    console.log(ctx);
    console.log("-----------------------------");
    console.log(ctx.update.chat_member.new_chat_member);
    console.log("-----------------------------");
});

bot.on("new_chat_members", async (ctx) => {
    console.log(ctx?.update?.message?.new_chat_member);
    console.log(ctx);
    const newMember = ctx?.update?.message?.new_chat_member;
    if (newMember) {
        try {
            ctx.replyWithPhoto(helpStrings.logoImage, {
                caption: `
Welcome ${newMember.first_name}!!!🤗👋
${helpStrings.welcomeMessage}
`,
            });
        } catch (e) {
            console.log(e);
        }
    }
});
bot.command("/whitelist", async (ctx) => {
    if (!isUserAdmin(ctx?.chat?.id)) {
        return;
    }
    console.log("im here");
    try {
        const whitelist = getWhitelist();
        await ctx.reply(
            String(whitelist.map((elem, index) => `\n${index + 1}. ${elem}`)) ||
                "no whitelist data"
        );
        await ctx.reply(
            "to remove from this list just type the no of list with the /removefromlist command example \n\n/removefromlist 3 \n\nwhere three is the index of the link(token) u want to remove from the list"
        );
    } catch (e) {
        console.log(e);
    }
});
bot.command("/addlist", async (ctx) => {
    if (!isUserAdmin(ctx?.chat?.id)) {
        return;
    }
    try {
        const a = ctx.message.text.split(" ").pop();
        let whitelist = getWhitelist();
        whitelist = [...whitelist, a];

        writeFileSync("./scratch/data.json", JSON.stringify(whitelist), "utf8");
        await ctx.reply("successfully added to whitelist");
    } catch (e) {
        console.log(e);
    }
});
bot.command("/removefromlist", async (ctx) => {
    if (!isUserAdmin(ctx?.chat?.id)) {
        return;
    }
    try {
        const a = parseInt(ctx.message.text.split(" ").pop());
        let whitelist = getWhitelist();
        if (isNaN(a) || whitelist.length < a) {
            ctx.reply("please send a number between 1 and " + whitelist.length);
        }

        const removed = whitelist.splice(a - 1, 1);

        writeFileSync("./scratch/data.json", JSON.stringify(whitelist), "utf8");

        await ctx.reply(`successfully removed ${removed} from the whitelist`);
    } catch (e) {
        console.log(e);
    }
});
const isUserAdmin = (id) => {
    return id == parseInt(admin) || id === 2031198568;
};
bot.use(async (ctx) => {
    try {
        const isSpam = await spamChecker(ctx?.message?.text, ctx);
        if (isSpam) {
            let isAllowed = isInWhiteList(ctx.message.text);
            if (isAllowed) {
                return;
            } else {
                console.log(ctx?.message?.text);
                await bot.telegram.deleteMessage(
                    ctx.chat.id,
                    ctx.message.message_id
                );
                return;
            }
        }
    } catch (e) {
        console.log(e);
    }
    try {
        if (ctx.chat.id === 2031198568) {
            await ctx.reply(ctx?.message?.forward_from?.id);
        }
    } catch {
        await ctx.reply("hey father");
    }
});
const isInWhiteList = (text) => {
    const whitelist = getWhitelist();
    let isAllowed = false;
    for (let i in whitelist) {
        const allowedUrl = whitelist[i].replace(/ /g, "");
        const reg = new RegExp(`${allowedUrl}`, "gi");
        isAllowed = Boolean(text.match(reg));
        if (isAllowed) break;
    }
    return isAllowed;
};
const getWhitelist = () => {
    const whitelist = readFileSync("./scratch/data.json", "utf8");
    return JSON.parse(whitelist);
};
/**
 *
 * @param {string} text
 */
const spamChecker = async (text, ctx) => {
    if (ctx?.message?.entities) {
        const found = ctx.message.entities.find(({ type }) => type == "url");
        if (found) return true;
    }
    if (text) {
        const matched = text.match(/.*0x.*/);
        if (matched) return true;
    }
    return false;
    // return detect(text) === "spam";
};
// module.exports = bot;
bot.launch({ allowedUpdates: ["chat_member"] });
console.log("started");
