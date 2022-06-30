import {authUser, getUser} from "./services/riotAuthService.js";
import {
    basicEmbed,
    emojiToString,
    externalEmojisAllowed,
    MAINTENANCE, removeAlertActionRow, removeAlertButton, secondaryEmbed, skinChosenEmbed,
    skinNameAndEmoji,
    VAL_COLOR_1,
    VAL_COLOR_2
} from "./util.js";
import {RadEmoji, VPEmoji} from "./emoji.js";
import {getBalance, getShop, getSkin, searchSkin} from "../Valorant/skins.js";
import {addAlert, alertExists, alertsForUser, removeAlertsInChannel} from "./alerts.js";
import {MessageActionRow, MessageSelectMenu} from "discord.js";

export const getValorantShop = (discordId, discordTag, discordChannel, discordGuild) => {
    const user = getUser(discordId)

    if (!user) return Promise.resolve([basicEmbed("**You're not registered with the bot!** Try `/login`.")])

    return getShop(discordId)
        .then(async shop => {
            const emojiPromise = VPEmoji(discordGuild, externalEmojisAllowed(discordChannel))
            if (!shop) return [basicEmbed("Could not fetch your shop, most likely you got logged out. Try logging in again.")]
            if (shop === MAINTENANCE) return [basicEmbed("**Valorant servers are currently down for maintenance!** Try again later.")]

            let embeds = [{
                description: `Daily shop for **${user.username}** (new shop <t:${Math.floor(Date.now() / 1000) + shop.expires}:R>)`,
                color: VAL_COLOR_1
            }]

            const emojiString = emojiToString(await emojiPromise) || "Price:"

            for (const uuid of shop.offers) {
                const skin = await getSkin(uuid, discordId)
                const embed = {
                    title: await skinNameAndEmoji(skin, discordChannel),
                    color: VAL_COLOR_2,
                    thumbnail: {
                        url: skin.icon
                    }
                }
                if (skin.price) embed.description = `${emojiString} ${skin.price}`
                embeds.push(embed)
            }

            console.log(`Sent ${discordTag}'s shop!`)
            return embeds
        })
        .catch(() => [basicEmbed("Could not fetch your shop, most likely you got logged out. Try logging in again.")])
}

export const getValorantBalance = (discordId, discordTag, discordChannel, discordGuild) => {
    const user = getUser(discordId)

    if (!user) return Promise.resolve([basicEmbed("**You're not registered with the bot!** Try `/login`.")])

    return getBalance(discordId)
        .then(async balance => {
            const vPEmojiPromise = VPEmoji(discordGuild, externalEmojisAllowed(discordChannel))
            const radEmojiPromise = RadEmoji(discordGuild, externalEmojisAllowed(discordChannel))
            if (balance === MAINTENANCE) return [basicEmbed("**Riot servers are down for maintenance!** Try again later.")]

            if (balance) {
                const VPEmoji = emojiToString(await vPEmojiPromise) || "Valorant Points:"
                const RadEmoji = emojiToString(await radEmojiPromise) || "Radianite:"
                console.log(`Sent ${discordTag}'s balance!`)
                return [{
                    title: `**${user.username}**'s wallet:`,
                    color: VAL_COLOR_1,
                    fields: [
                        {name: "Valorant Points", value: `${VPEmoji} ${balance.vp}`, inline: true},
                        {name: "Radianite", value: `${RadEmoji} ${balance.rad}`, inline: true}
                    ]
                }]
            } else {
                return [basicEmbed("**Could not fetch your balance**, most likely you got logged out. Try logging in again.")]
            }
        })
}

export const creatShopAlert = async (discordId, discordTag, discordChannel, skinValue, client) => {
    const user = getUser(discordId)

    if (!user) return {embeds: [basicEmbed("**You're not registered with the bot!** Try `/login`.")]}

    const searchResults = await searchSkin(skinValue)

    // filter out results for which the user already has an alert set up
    const filteredResults = []
    for (const result of searchResults) {
        const otherAlert = alertExists(discordId, result.uuid)
        if (otherAlert) {
            // user already has an alert for this skin maybe it's in a now deleted channel?
            const otherChannel = await client.channels.fetch(otherAlert.channel_id).catch(() => {
            })

            if (!otherChannel) {
                removeAlertsInChannel(otherAlert.channel_id)
                filteredResults.push(result)
            }
        } else filteredResults.push(result)
    }

    if (filteredResults.length === 0) {
        if (searchResults.length === 0) return {embeds: [basicEmbed("**Couldn't find a skin with that name!** Check the spelling and try again.")]}

        const skin = searchResults[0]
        const otherAlert = alertExists(discordId, skin.uuid)
        return {embeds: [basicEmbed(`You already have an alert for the **${skin.name}** in <#${otherAlert.channel_id}>!`)]}
    } else if (filteredResults.length === 1 || filteredResults[0].name.toLowerCase() === skinValue.toLowerCase()) {
        const skin = filteredResults[0]

        addAlert({
            id: discordId,
            uuid: skin.uuid,
            channel_id: discordChannel.id
        });

        return {
            embeds: [await skinChosenEmbed(skin, discordChannel)],
            components: [removeAlertActionRow(discordId, skin.uuid)]
        }
    } else {
        const row = new MessageActionRow()
        const options = filteredResults.splice(0, 25).map(result => {
            return {
                label: result.name,
                value: `skin-${result.uuid}`
            }
        })
        row.addComponents(new MessageSelectMenu().setCustomId("skin-select").setPlaceholder("Select skin:").addOptions(options))

        return {
            embeds: [secondaryEmbed("Which skin would you like to set a reminder for?")],
            components: [row]
        }
    }
}

export const getUserShopAlerts = async (discordId, discordChannel, discordGuild, client) => {
    const user = getUser(discordId)
    if (!user) return {embeds: [basicEmbed("**You're not registered with the bot!** Try `/login`.")]}

    let alerts = alertsForUser(discordId)
    alerts.splice(0, 25) // todo create a page system when there are >25 alerts

    // filter out alerts for deleted channels
    const removedChannels = []
    for (const alert of alerts) {
        if (removedChannels.includes(alert.channel_id)) continue

        const channel = await client.channels.fetch(alert.channel_id).catch(() => {
        })
        if (!channel) {
            removeAlertsInChannel(alert.channel_id);
            removedChannels.push(alert.channel_id);
        }
    }
    if (removedChannels) alerts = alertsForUser(discordId);

    if (alerts.length === 0) {
        return {embeds: [basicEmbed("**You don't have any alerts set up!** Use `/alert` to get started.")]}
    }

    if (!(await authUser(discordId))) return {embeds: [basicEmbed("**Your alerts won't work because you got logged out!** Please `/login` again.")],}

    const emojiString = emojiToString(await VPEmoji(discordGuild, externalEmojisAllowed(discordChannel)) || "Price: ")

    const alertFieldDescription = (channel_id, price) => {
        return channel_id !== discordChannel.id ? `in <#${channel_id}>` :
            price ? `${emojiString} ${price}` : "Not for sale"
    }

    if (alerts.length === 1) {
        const alert = alerts[0]
        const skin = await getSkin(alert.uuid, discordId)

        return {
            embeds: [{
                title: "You have one alert set up:",
                color: VAL_COLOR_1,
                description: `**${await skinNameAndEmoji(skin, discordChannel)}**\n${alertFieldDescription(alert.channel_id, skin.price)}`,
                thumbnail: {
                    url: skin.icon
                }
            }],
            components: [removeAlertActionRow(discordId, alert.uuid)],
        }
    }

    // bring the alerts in this channel to the top
    const alertPriority = (alert) => {
        if (alert.channel_id === discordChannel.id) return 2
        if (client.channels.cache.get(alert.channel_id).guild.id === discordGuild.id) return 1
        return 0
    }
    alerts.sort((alert1, alert2) => alertPriority(alert2) - alertPriority(alert1))

    const embed = { // todo switch this to a "one embed per alert" message, kinda like /shop
        title: "The alerts you currently have set up:",
        color: VAL_COLOR_1,
        footer: {
            text: "Click on a button to remove the alert"
        },
        fields: []
    }
    const buttons = [];

    let n = 1;
    for (const alert of alerts) {
        const skin = await getSkin(alert.uuid, discordId)
        embed.fields.push({
            name: `**${n}.** ${await skinNameAndEmoji(skin, discordChannel)}`,
            value: alertFieldDescription(alert.channel_id, skin.price),
            inline: false
        })
        buttons.push(removeAlertButton(discordId, alert.uuid).setLabel(`${n}.`).setEmoji(""))
        n++
    }

    const actionRows = []
    for (let i = 0; i < alerts.length; i += 5) {
        const actionRow = new MessageActionRow()
        for (let j = i; j < i + 5 && j < alerts.length; j++) {
            actionRow.addComponents(buttons[j])
        }
        actionRows.push(actionRow)
    }

    return {
        embeds: [embed],
        components: actionRows
    }
}