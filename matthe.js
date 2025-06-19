const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const TOKEN = "";
const USER_ROLE_ID = "1333759916401365062"; // Buraya user rolünün ID'sini ekleyin
const UNREGISTERED_ROLE_ID = "1333884344414109707"; // Buraya kayıtsız

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);


    client.user.setPresence({
        activities: [
            {
                name: "matthe <3",
                type: "PLAYING", // Oyun durumu olarak ayarlıyoruz.
            }
        ],
        status: "online", // Botun çevrimiçi durumu
    });
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const args = message.mentions.members.first();
    const role = message.mentions.roles.first();
    
    if (message.content.startsWith(".referans")) {
        if (!args || !role) return message.reply("Lütfen bir üye ve bir rol etiketleyin!");
        
        const userRole = message.guild.roles.cache.get(USER_ROLE_ID);
        const unregisterRole = message.guild.roles.cache.get(UNREGISTERED_ROLE_ID);

        if (!userRole) return message.reply("User rolü bulunamadı! Lütfen doğru rol ID'sini girin.");
        if (!unregisterRole) return message.reply("Kayıtsız rolü bulunamadı! Lütfen doğru rol ID'sini girin.");

        try {
            // Kayıtsız rolünü üyeden al
            await args.roles.remove(unregisterRole);
            // User rolünü ve belirtilen rolü ekle
            await args.roles.add([role, userRole]);

            message.reply(`${args} kullanıcısının referansı başarıyla tamamlandı!`);
        } catch (error) {
            console.error(error);
            message.reply("Bir hata oluştu. Botun yetkilerini kontrol edin!");
        }
    }

    if (message.content.startsWith(".ban")) {
        if (!args) return message.reply("Lütfen bir üye etiketleyin!");
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply("Bu komutu kullanmak için yetkiniz yok!");
        try {
            await args.ban();
            message.reply(`${args.user.tag} kullanıcısı banlandı!`);
        } catch (error) {
            console.error(error);
            message.reply("Bir hata oluştu. Botun yetkilerini kontrol edin!");
        }
    }

    if (message.content.startsWith(".kick")) {
        if (!args) return message.reply("Lütfen bir üye etiketleyin!");
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("Bu komutu kullanmak için yetkiniz yok!");
        try {
            await args.kick();
            message.reply(`${args.user.tag} kullanıcısı atıldı!`);
        } catch (error) {
            console.error(error);
            message.reply("Bir hata oluştu. Botun yetkilerini kontrol edin!");
        }
    }
});

client.login(TOKEN);
