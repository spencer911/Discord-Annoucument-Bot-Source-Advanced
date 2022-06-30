import {Client, Intents, MessageFlags} from "discord.js"
import {
    getAgents,
    getCompSeasons,
    getCurrentMatchId, getLatestCompResult,
    getLatestCompTiers, getMatch, getMMRs, getPlayers,
    getSkin,
    refreshSkinList
} from "../Valorant/skins.js"
import {
    addAlert,
    alertExists,
    checkAlerts,
    loadAlerts,
    removeAlert,
    removeAlertsInChannel,
    setClient
} from "./alerts.js"
import {
    basicReply, compTier,
    externalEmojisAllowed,
    MAINTENANCE,
    removeAlertActionRow,
    skinChosenEmbed,
    skinNameAndEmoji, VAL_BLUE_TEAM_COLOR, VAL_RED_TEAM_COLOR
} from "./util.js"
import {login, loginWithCookies, removeUser, twoFactorAuth} from "./userService.js"
import {creatShopAlert, getUserShopAlerts, getValorantBalance, getValorantShop} from "./shopService.js"
import cron from "node-cron"
import {cleanupAccounts, getUser, loadUserData} from "./services/riotAuthService.js"
import {loadConfig} from "./config.js"
import {basicEmbed} from "./util.js"
import {compTierEmoji} from "./emoji.js";

const DEPLOY_GLOBAL = "!deploy global"
const DEPLOY_GUILD = "!deploy guild"
const UNDEPLOY = "!undeploy"

const SHOP_CMD = "shop"
const SHOP_SHARE_CMD = "shop-share"
const BALANCE_CMD = "balance"
const ALERT_CMD = "alert"
const ALERTS_CMD = "alerts"
const LOGIN_CMD = "login"
const TWOFA_CMD = "2fa"
const COOKIES_CMD = "cookies"
const FORGET_CMD = "forget"
const MATCH_CMD = "match"
const MATCH_SHARE_CMD = "match-share"

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
loadUserData()
loadAlerts()
const config = loadConfig()
if (config) {
    client.login(config.token)
    console.log("Logging in...")
}

client.on("messageCreate", async (message) => {
    if (message.content === DEPLOY_GUILD) {
        console.log("deploying commands...")

        const guild = client.guilds.cache.get(message.guild.id)
        await guild.commands.set(commands).then(() => console.log(`Commands deployed in guild ${message.guild.name}!`))

        await message.reply("Deployed in guild!")
    } else if (message.content === DEPLOY_GLOBAL) {
        console.log("deploying commands...")

        await client.application.commands.set(commands).then(() => console.log("Commands deployed globally!"))

        await message.reply("Deployed globally!")
    } else if (message.content === UNDEPLOY) {
        console.log("Un-deploying commands...")

        await client.application.commands.set([]).then(() => console.log("Commands un-deployed globally!"))

        const guild = client.guilds.cache.get(message.guild.id)
        await guild.commands.set([]).then(() => console.log(`Commands un-deployed in guild ${message.guild.name}!`))

        await message.reply("Un-deployed in guild and globally!")
    }
})

client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`)

    console.log("Loading skins...");
    refreshSkinList().then(() => console.log("Skins loaded!"))

    setClient(client)

    // check alerts every day at 00:00:10 GMT
    cron.schedule(config.refreshSkins, checkAlerts, {timezone: "GMT"})

    // check for new valorant version every 15mins
    cron.schedule(config.checkGameVersion, () => refreshSkinList(true))

    // cleanup accounts every hour
    cron.schedule(config.checkGameVersion, cleanupAccounts)
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        console.log(`${interaction.user.tag} used /${interaction.commandName}`)

        switch (interaction.commandName) {
            //USER commands
            case LOGIN_CMD:
                login(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.options.get("username").value,
                    interaction.options.get("password").value
                ).then(replyMsg => basicReply(interaction, replyMsg))
                break
            case TWOFA_CMD:
                twoFactorAuth(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.options.get("code").value
                ).then(replyMsg => basicReply(interaction, replyMsg))
                break
            case COOKIES_CMD:
                loginWithCookies(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.options.get("cookies").value
                ).then(replyMsg => basicReply(interaction, replyMsg))
                break
            case FORGET_CMD:
                basicReply(interaction, removeUser(interaction.user.id, interaction.user.tag))
                break

            //SHOP commands
            case SHOP_SHARE_CMD:
            case SHOP_CMD: {
                getValorantShop(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.channel,
                    interaction.guild
                ).then(embeds => interaction.reply({embeds, ephemeral: interaction.commandName !== "shop-share"}))
                break
            }
            case BALANCE_CMD: {
                getValorantBalance(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.channel,
                    interaction.guild
                ).then(embeds => interaction.reply({embeds, ephemeral: true}))
                break
            }
            case ALERT_CMD: {
                creatShopAlert(
                    interaction.user.id,
                    interaction.user.tag,
                    interaction.channel,
                    interaction.options.get("skin").value,
                    client
                ).then(reply => interaction.reply({...reply, ephemeral: true}))
                break
            }
            case ALERTS_CMD:
                getUserShopAlerts(
                    interaction.user.id,
                    interaction.channel,
                    interaction.guild,
                    client
                ).then(reply => interaction.reply({...reply, ephemeral: true}))
                break

            //MATCH commands
            case MATCH_CMD:
            case MATCH_SHARE_CMD: {
                const valorantUser = getUser(interaction.user.id);
                //const valorantUser = {puuid: "233", tag: "tester"}
                if(!valorantUser) return await interaction.reply({
                    embeds: [basicEmbed("**You're not registered with the bot!** Try `/login` or `/cookies`.")],
                    ephemeral: true
                });

                //todo what is this and why is it needed if we just await everything anyways
                await interaction.deferReply({ephemeral: interaction.commandName !== "match-share"});

                const compSeasons = await getCompSeasons()
                const compTiers = await getLatestCompTiers()
                const agents = await getAgents()
                for await (const tier of compTiers) {
                    await compTierEmoji(interaction.channel.guild, tier.tierName, tier.smallIcon, externalEmojisAllowed(interaction.channel))
                }

                const currMatchId = await getCurrentMatchId(interaction.user.id);

                if(!currMatchId) return await interaction.followUp({
                    embeds: [basicEmbed("Could not fetch your current match, you are either not logged in or not in a match. Try again.")],
                    ephemeral: true
                });
                if(currMatchId === MAINTENANCE) return await interaction.followUp({
                    embeds: [basicEmbed("**Valorant servers are currently down for maintenance!** Try again later.")],
                    ephemeral: true
                });


                const matchPlayers = (await getMatch(interaction.user.id, currMatchId)).map(player => {
                    return {
                        Subject: player.Subject.toLowerCase(),
                        Team: player.TeamID,
                        Agent: agents.find(agent => agent.uuid.toLowerCase() === player.CharacterID.toLowerCase()).displayName,
                        AccountLevel: player.PlayerIdentity.AccountLevel
                    }
                });

                const allPlayerDetails = await getPlayers(interaction.user.id, matchPlayers.map(player => player.Subject));
                const players = matchPlayers.map(matchPlayer => {
                    const playerDetails = allPlayerDetails.find(playerDetail => playerDetail.Subject === matchPlayer.Subject)
                    return {
                        ...matchPlayer,
                        GameName: playerDetails.GameName,
                        TagLine: playerDetails.TagLine
                    }
                })

                // const players = [
                //     {
                //         Subject: "a9ef18ac-ef6c-5d49-a333-e5109d0411b3",
                //         Team: "Blue",
                //         Agent: "Jett",
                //         AccountLevel: 123,
                //         GameName: "Dark",
                //         TagLine: ""
                //     },
                //     {
                //         Subject: "f73a754c-e8cd-5a9d-92a7-f9f5f8e5dbbf",
                //         Team: "Red",
                //         Agent: "Brim",
                //         AccountLevel: 35,
                //         GameName: "Light",
                //         TagLine: ""
                //     },
                //     {
                //         Subject: "12445",
                //         Team: "Blue",
                //         Agent: "Omen",
                //         AccountLevel: 33,
                //         GameName: "Light",
                //         TagLine: ""
                //     },
                //     {
                //         Subject: "12445",
                //         Team: "Red",
                //         Agent: "Neon",
                //         AccountLevel: 7,
                //         GameName: "Light",
                //         TagLine: ""
                //     }
                // ]

                for await (const player of players.slice(0, 10)) {
                    const latestCompResult = (await getLatestCompResult(interaction.user.id, player.Subject));
                    let playerLatestTier = 0
                    let lastSeasonTier = 0
                    if (latestCompResult) {
                        playerLatestTier = latestCompResult.TierAfterUpdate;
                        const currentSeasonIdx = compSeasons.findIndex(data => data.seasonUuid === latestCompResult.SeasonID)
                        const lastSeasonId = compSeasons[currentSeasonIdx - 1].seasonUuid
                        const playerMMRsBySeason = (await getMMRs(interaction.user.id, player.Subject))

                        if(playerMMRsBySeason) {
                            lastSeasonTier = playerMMRsBySeason[lastSeasonId] ? playerMMRsBySeason[lastSeasonId].CompetitiveTier : 0
                        }

                    }

                    player.LatestTier = await compTier(compTiers.find(tier => tier.tier === playerLatestTier), interaction.channel)
                    player.LastSeasonTier = await compTier(compTiers.find(tier => tier.tier === lastSeasonTier), interaction.channel)
                }
                const interactionPlayer = players.find(player => player.Subject === valorantUser.puuid) || {Team: "Blue"}

                const blueTeam = players.filter(player => player.Team === "Blue")
                const redTeam = players.filter(player => player.Team === "Red")

                const blueTeamEmbed = {
                    color: VAL_BLUE_TEAM_COLOR,
                    title: interactionPlayer.Team === "Blue" ? "Your Team": "Enemy Team",
                    fields: blueTeam.map(player => {
                        return {
                            name: `${player.LatestTier}\t${player.Agent}\t${player.GameName}`,
                            value: `Level: ${player.AccountLevel} Last: ${player.LastSeasonTier}`
                        }
                    })
                }

                const redTeamEmbed = {
                    color: VAL_RED_TEAM_COLOR,
                    title: interactionPlayer.Team === "Red" ? "Your Team": "Enemy Team",
                    fields: redTeam.map(player => {
                        return {
                            name: `${player.LatestTier}\t${player.Agent}\t${player.GameName}`,
                            value: `Level: ${player.AccountLevel} Last: ${player.LastSeasonTier}`
                        }
                    })
                }

                await interaction.followUp({embeds: interactionPlayer.Team === "Blue" ? [blueTeamEmbed, redTeamEmbed] : [redTeamEmbed, blueTeamEmbed]});
                console.log(`Sent ${interaction.user.tag}'s current match!`);

                break;
            }

            default: {
                basicReply(interaction, "Yer a wizard Harry!")
                break
            }

        }
    } else if (interaction.isSelectMenu()) {
        //TODO refactor
        console.log(`${interaction.user.tag} selected an option a the dropdown`);
        switch (interaction.customId) {
            case "skin-select": {
                if(interaction.message.interaction.user.id !== interaction.user.id) {
                    return await interaction.reply({embeds: [basicEmbed("**That's not your message!** Use `/alert` to set your own alert.")], ephemeral: true});
                }

                const chosenSkin = interaction.values[0].substr(5);
                const skin = await getSkin(chosenSkin);

                const otherAlert = alertExists(interaction.user.id, chosenSkin);
                if(otherAlert) return await interaction.reply({
                    embeds: [basicEmbed(`You already have an alert for the **${skin.name}** in <#${otherAlert.channel_id}>!`)],
                    ephemeral: true
                });

                addAlert({
                    id: interaction.user.id,
                    uuid: chosenSkin,
                    channel_id: interaction.channel.id
                });

                await interaction.update({embeds: [await skinChosenEmbed(skin, interaction.channel)], components: [removeAlertActionRow(interaction.user.id, chosenSkin)], ephemeral: true});
            }
        }
    } else if (interaction.isButton()) {
        //TODO refactor
        console.log(`${interaction.user.tag} clicked ${interaction.component.label}`);
        if(interaction.customId.startsWith("removealert/")) {
            const [, uuid, id] = interaction.customId.split('/');

            if(id !== interaction.user.id) return await interaction.reply({embeds: [basicEmbed("**That's not your alert!** Use `/alerts` to manage your alerts.")], ephemeral: true});

            const success = removeAlert(id, uuid);
            if(success) {
                const skin = await getSkin(uuid);

                await interaction.reply({embeds: [basicEmbed(`Removed the alert for the **${await skinNameAndEmoji(skin, interaction.channel)}**!`)], ephemeral: true});

                if(interaction.message.flags.has(MessageFlags.FLAGS.EPHEMERAL)) return; // message is ephemeral

                if(interaction.message.interaction) { // if the message is an interaction, aka is the response to /alert
                    await interaction.message.delete().catch(() => {});
                } else { // the message is an automatic alert
                    const actionRow = removeAlertActionRow(interaction.user.id, uuid);
                    actionRow.components[0].setDisabled(true).setLabel("Removed");

                    await interaction.message.edit({components: [actionRow]}).catch(() => {});
                }
            } else {
                await interaction.reply({embeds: [basicEmbed("That alert doesn't exist anymore!")], ephemeral: true});
            }
        }
    }
})

client.on("channelDelete", channel => {
    removeAlertsInChannel(channel.id)
})

const commands = [
    {
        name: SHOP_CMD,
        description: "Show your current daily shop to yourself"
    },
    {
        name: SHOP_SHARE_CMD,
        description: "Show your current daily shop to the channel"
    },
    {
        name: BALANCE_CMD,
        description: "Show how many Valorant points you have in your account"
    },
    {
        name: ALERT_CMD,
        description: "Set an alert for when a particular skin is in your shop",
        options: [{
            type: "STRING",
            name: "skin",
            description: "The name of the skin you want to set an alert for",
            required: true
        }]
    },
    {
        name: ALERTS_CMD,
        description: "Show all your active alerts"
    },
    {
        name: LOGIN_CMD,
        description: "Log in with your Riot username/password. Preferred way is to use /cookies instead",
        options: [
            {
                type: "STRING",
                name: "username",
                description: "Your Riot username",
                required: true
            },
            {
                type: "STRING",
                name: "password",
                description: "Your Riot password",
                required: true
            },
        ]
    },
    {
        name: TWOFA_CMD,
        description: "Enter your 2FA code if needed",
        options: [{
            type: "INTEGER",
            name: "code",
            description: "The 2FA Code",
            required: true,
            minValue: 0,
            maxValue: 999999
        }]
    },
    {
        name: COOKIES_CMD,
        description: "Log in with your cookies. Useful if you have 2FA or if you use Google/Facebook to log in.",
        options: [{
            type: "STRING",
            name: "cookies",
            description: "Your auth.riotgames.com cookie header",
            required: true
        }]
    },
    {
        name: FORGET_CMD,
        description: "Forget and permanently delete your account from the bot"
    },
    {
        name: MATCH_CMD,
        description: "Fetch your current match information and make it visible only to you"
    },
    {
        name: MATCH_SHARE_CMD,
        description: "Fetch your current match information and share it with the channel"
    }
]