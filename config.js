const helpStrings = {
    helpMessage: `This bot removes spams and sends introduction messages when people join ${process.env.GROUP_LINK} group\nThanks`,
    startMessage: `Hello ✋\nThis bot removes spams and sends introduction messages when people join ${process.env.GROUP_LINK} group\nThanks`,
    welcomeMessage: `
🚀In prelaunch for new Token
⌛Presale is coming soon.
💰SoftCap: 1000 BNB
💰HardCap: 2000 BNB

✅Token name: BMF

✅Name : Bit Mining Farm

✅Supply: 1 Trillion

💻Hardware : 500 Billion use to purchase mining equipment to mine stable coin like ethereum, Litecoin, etc

✅Public: 500 Billion Token

🔗https://bscscan.com/address/0x8754fc9fc749e9baafa02ab11b4f4379d24c8c8a


💪Our token BMF will stand behind the stable coins.

🎯We aim to get our own warehouse and mining hardware!

🤝Come join our journey!

✍️Telegram: https://t.me/officialbitminingfarm
✍️Discord: https://discord.gg/9hMrVDSn
✍️Twitter: https://twitter.com/BitBmf
✍️Instagram: https://www.instagram.com/bitminingfarm/

🚀About our whitepaper, token's feature , presale and roadmap, visit our site.

website:
🔗https://bitminingfarm.io
`,
    logoImage:
        "AgACAgQAAxkBAAIKBWIGAt-7OLmZnz3z-ruo2LxHUCvXAAJVvTEbpKgwULXciyHzqi4JAQADAgADeAADIwQ",
};
const introduction = async (bot, id, data, includeMarkup = true) => "hello man";
module.exports = {
    introduction,
    helpStrings,
};
