const botsetting = require("./botsetting.json");
const tokenfile = require("./tokenfile.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true})
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

	if(err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0) {
		console.log("Komutları Bulamıyorum.");
		return;
	}

	jsfile.forEach((f, i) =>{
		let props = require(`./commands/${f}`);
        console.log(`${f} yüklendi!`);
        bot.commands.set(props.help.name, props);
	});

});

bot.on("ready", async () => {
	console.log(`${bot.user.username} Aktif`);

	bot.user.setActivity(`Yeni Özellik: Seviye Sistemi | ${botsetting.prefix}y | so!davet | ${bot.guilds.size} Sunucuyu`, {type: "WATCHING"});

	//bot.user.setActivity(`${botsetting.prefix}y | ${bot.guilds.size} Sunucu | ${bot.guilds.reduce((a, b) => a + b.memberCount, 0)} Kullanıcı | ${bot.channels.size} Kanalı`, {type: "WATCHING"});

	//bot.user.setGame(`${botsetting.prefix}yardım | ${bot.guilds.size} Sunucu | ${bot.users.size} Kullanıcı | ${bot.channels.size} Kanala Hizmet Veriyor!`);
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	//let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

	//if(!prefixes[message.guild.id]){
	//	prefixes[message.guild.id] = {
	//		prefixes: botconfig.prefix
	//	};
	//}

	//let prefix = prefixes[message.guild.id].prefixes;
	let prefix = botsetting.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot, message, args);

});

bot.login(tokenfile.token);
