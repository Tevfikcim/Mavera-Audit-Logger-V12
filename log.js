const dcxd = require("discord.js");
const { MessageEmbed } = require("discord.js")
const client = new dcxd.Client()
const client2 = new dcxd.Client()
const ayarlar = require("./settings.json")
const request = require("request")
let embed = new MessageEmbed().setFooter(ayarlar.footer).setTimestamp().setColor("PURPLE")

client.on("guildBanAdd", async function(guild, user) {
    const entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD" }).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
    const yetkili = await guild.members.cache.get(entry.executor.id);
    client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sağ Tık Yasaklandı!").setDescription(`${yetkili} yetkilisi bir kullanıcıya **sağ tık ban** attı!
\`>\` Sağ tık yasaklanan kullanıcı: ${user} (\`${user.tag} - ${user.id}\`)
\`>\` Sağ tık yasaklayan yetkili: ${yetkili} (\`${yetkili.tag} - ${yetkili.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sağ Tık Yasaklandı!").setDescription(`${yetkili} yetkilisi bir kullanıcıya **sağ tık ban** attı!
\`>\` Sağ tık yasaklanan kullanıcı: ${user} (\`${user.tag} - ${user.id}\`)
\`>\` Sağ tık yasaklayan yetkili: ${yetkili} (\`${yetkili.tag} - ${yetkili.id}\`)`))
})

client.on("guildMemberRemove", async kickhammer => {
  const guild = kickhammer.guild;
  const entry = await guild.fetchAuditLogs().then(audit => audit.entries.first());
  if (entry.action == `MEMBER_KICK`) {
let yetkili = await guild.members.cache.get(entry.executor.id);
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;

client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sağ Tık Kicklendi!").setDescription(`${yetkili} yetkilisi bir kullanıcıya **sağ tık kick** attı!
\`>\` Sağ tık kicklenen kullanıcı: ${kickhammer} (\`${kickhammer.user.tag} - ${kickhammer.id}\`)
\`>\` Sağ tık kickleyen yetkili: ${yetkili} (\`${yetkili.tag} - ${yetkili.id}\`)`)) 

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sağ Tık Yasaklandı!").setDescription(`${yetkili} yetkilisi bir kullanıcıya **sağ tık ban** attı!
\`>\` Sağ tık yasaklanan kullanıcı: ${user} (\`${user.tag} - ${user.id}\`)
\`>\` Sağ tık yasaklayan yetkili: ${yetkili} (\`${yetkili.tag} - ${yetkili.id}\`)`)) 
}});

client.on("guildMemberAdd", async member => {
const entry = await member.guild.fetchAuditLogs({ type: "BOT_ADD" }).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sunucuya Bot Ekledi!").setDescription(`${entry.executor} yetkilisi sunucuya **BOT EKLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Sunucuya Eklenen Bot: ${member} (\`${member.user.tag} - ${member.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sunucuya Bot Ekledi!").setDescription(`${entry.executor} yetkilisi sunucuya **BOT EKLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Sunucuya Eklenen Bot: ${member} (\`${member.user.tag} - ${member.id}\`)`))
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
let entry = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sunucu Ayarlarını Güncelledi!").setDescription(`${entry.executor} yetkilisi **SUNUCU AYARLARIYLA** ilgili bir güncelleme yaptı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Sunucunun Eski Adı: **${oldGuild.name}**
\`>\` Sunucunun Yeni Adı: **${newGuild.name}**
\`>\` Sunucu Kimliği: \`${oldGuild.id}\``))
client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sunucu Ayarlarını Güncelledi!").setDescription(`${entry.executor} yetkilisi **SUNUCU AYARLARIYLA** ilgili bir güncelleme yaptı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Sunucunun Eski Adı: **${oldGuild.name}**
\`>\` Sunucunun Yeni Adı: **${newGuild.name}**
\`>\` Sunucu Kimliği: \`${oldGuild.id}\``))
})

client.on("roleDelete", async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sunucu İçerisinde Rol Sildi!").setDescription(`${entry.executor} yetkilisi **ROL SİLME** işlemi uyguladı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Rol İsmi: \`${role.name}\`
\`>\` Silinen Rol ID'si: \`${role.id}\``))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sunucu İçerisinde Rol Sildi!").setDescription(`${entry.executor} yetkilisi **ROL SİLME** işlemi uyguladı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Rol İsmi: \`${role.name}\`
\`>\` Silinen Rol ID'si: \`${role.id}\``))
})

client.on("roleCreate", async role => {
let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first())
if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Sunucu İçerisinde Rol Açtı!").setDescription(`${entry.executor} yetkilisi **ROL AÇMA** işlemi uyguladı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Açılan Rol İsmi: \`${role.name}\`
\`>\` Açılan Rol ID'si: \`${role.id}\` `))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Sunucu İçerisinde Rol Açtı!").setDescription(`${entry.executor} yetkilisi **ROL AÇMA** işlemi uyguladı!

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Açılan Rol İsmi: \`${role.name}\`
\`>\` Açılan Rol ID'si: \`${role.id}\` `)) })

client.on("roleUpdate", async (oldRole, newRole) => {
  let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first())
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Rol Güncelledi!").setDescription(`${entry.executor} yetkilisi bir rolü **GÜNCELLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Güncellenen Rolün Eski İsmi: ${oldRole} (\`${oldRole.name} - ${oldRole.id}\`) 
\`>\` Güncellenen Rolün Yeni İsmi: ${newRole} (\`${newRole.name} - ${newRole.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Rol Güncelledi!").setDescription(`${entry.executor} yetkilisi bir rolü **GÜNCELLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Güncellenen Rolün Eski İsmi: ${oldRole} (\`${oldRole.name} - ${oldRole.id}\`) 
\`>\` Güncellenen Rolün Yeni İsmi: ${newRole} (\`${newRole.name} - ${newRole.id}\`)`))
})    

client.on("channelDelete", async channel => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Kanal Sildi!").setDescription(`${entry.executor} yetkilisi bir **KANAL SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Kanal: **${channel.name}** (\`${channel.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Kanal Sildi!").setDescription(`${entry.executor} yetkilisi bir **KANAL SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Kanal: **${channel.name}** (\`${channel.id}\`)`))
})

client.on("channelCreate", async (channel) => {
  let entry = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(audit => audit.entries.first())
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
  client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Kanal Oluşturuldu!").setDescription(`${entry.executor} yetkilisi bir **KANAL OLUŞTURULDU!**

  \`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
  \`>\` Oluşturulan Kanal: **${channel}** (\`${channel.name} - ${channel.id}\`)`))
  
  client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Kanal Oluşturuldu!").setDescription(`${entry.executor} yetkilisi bir **KANAL OLUŞTURULDU!**
  
  \`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
  \`>\` Oluşturulan Kanal: **${channel}** (\`${channel.name} - ${channel.id}\`)`))
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000 || !newChannel.guild.channels.cache.has(newChannel.id)) return;
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Kanal Ayarlarını Güncelledi!").setDescription(`${entry.executor} yetkilisi bir **KANAL OLUŞTURULDU!**
  
\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Güncellenen Kanalın Eski Bilgileri: **${oldChannel}** (\`${oldChannel.name} - ${oldChannel.id}\`)
\`>\` Güncellenen Kanalın Yeni Bilgileri: **${newChannel}** (\`${chanewChannelnnel.name} - ${newChannel.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Kanal Ayarlarını Güncelledi!").setDescription(`${entry.executor} yetkilisi bir **KANAL OLUŞTURULDU!**
  
\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Güncellenen Kanalın Eski Bilgileri: **${oldChannel}** (\`${oldChannel.name} - ${oldChannel.id}\`)
\`>\` Güncellenen Kanalın Yeni Bilgileri: **${newChannel}** (\`${chanewChannelnnel.name} - ${newChannel.id}\`)`))
})

client.on("webhookUpdate", async (channel) => {
  const entry = await channel.guild.fetchAuditLogs( { type: "WEBHOOK_CREATE" } ).then(audit => audit.entries.first())
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı WebHook Açtı!").setDescription(`${entry.executor} yetkilisi **WEBHOOK OLUŞTURDU!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Webhook Açtığı Kanal: ${channel} (\`${channel.name} - ${channel.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı WebHook Açtı!").setDescription(`${entry.executor} yetkilisi **WEBHOOK OLUŞTURDU!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Webhook Açtığı Kanal: ${channel} (\`${channel.name} - ${channel.id}\`)`))
})

client.on("webhookUpdate", async (channel) => {
  const entry = await channel.guild.fetchAuditLogs( { type: "WEBHOOK_DELETE" } ).then(audit => audit.entries.first())
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı WebHook Sildi!").setDescription(`${entry.executor} yetkilisi **WEBHOOK SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Webhook Sildiği Kanal: ${channel} (\`${channel.name} - ${channel.id}\`)`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı WebHook Sildi!").setDescription(`${entry.executor} yetkilisi **WEBHOOK SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Webhook Sildiği Kanal: ${channel} (\`${channel.name} - ${channel.id}\`)`))
})

client.on("emojiDelete", async (emoji, message) => {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;
client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Emoji Sildi!").setDescription(`${entry.executor} yetkilisi bir **EMOJİ SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Emoji İsmi: **${emoji.name}** (\`${emoji.id}\`)
\`>\` Emoji Linki: ${emoji.url}`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Emoji Sildi!").setDescription(`${entry.executor} yetkilisi bir **EMOJİ SİLDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Silinen Emoji İsmi: **${emoji.name}** (\`${emoji.id}\`)
\`>\` Emoji Linki: ${emoji.url}`))
})

  client.on("emojiCreate", async (emoji, message) => {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_CREATE" }).then(audit => audit.entries.first());
  if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 10000) return;

client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Bir Kullanıcı Emoji Oluşturdu!").setDescription(`${entry.executor} yetkilisi bir **EMOJİ YÜKLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Eklenen Emoji İsmi: **${emoji.name}** (\`${emoji.id}\`)
\`>\` Emoji Linki: ${emoji.url}`))

client.users.cache.get(ayarlar.owner).send(embed.setTitle("Bir Kullanıcı Emoji Oluşturdu!").setDescription(`${entry.executor} yetkilisi bir **EMOJİ YÜKLEDİ!**

\`>\` Kullanıcı Bilgileri: **${entry.executor.tag}** (\`${entry.executor.id}\`)
\`>\` Eklenen Emoji İsmi: **${emoji.name}** (\`${emoji.id}\`)
\`>\` Emoji Linki: ${emoji.url}`))
})

client.on("guildUnavailable", async function(guild) {
  client.channels.cache.find(a => a.name == "audit-log").send(embed.setTitle("Sunucu Pinge Düştü!").setDescription(`Bir kullanıcı sunucuyu düşürerek pinge soktu/sokmaya çalıştı!`))
})

client.on("ready", async () => { client.user.setPresence({ activity: { name: ayarlar.footer }, status: "online" }) });
client.on("ready", async () => { console.log(`[BOT] ${client.user.username} connected!`); });
client.login(ayarlar.token).catch(err => { console.error(`[BOT] Bot not connected!`); console.error(err.message) })