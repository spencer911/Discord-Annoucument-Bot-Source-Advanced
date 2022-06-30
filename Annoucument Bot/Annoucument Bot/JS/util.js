import https from "https";
import fs from "fs";

const tlsCiphers = [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
    "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
    "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
    "TLS_RSA_WITH_AES_128_GCM_SHA256",
    "TLS_RSA_WITH_AES_256_GCM_SHA384",
    "TLS_RSA_WITH_AES_128_CBC_SHA",
    "TLS_RSA_WITH_AES_256_CBC_SHA"
]

// all my homies hate node-fetch
export const fetch = (url, options={}) => {
    return new Promise((resolve) => {
        const req = https.request(url, {
            method: options.method || "GET",
            headers: options.headers || {},
            ciphers: tlsCiphers.join(':')
        }, resp => {
            const res = {
                statusCode: resp.statusCode,
                headers: resp.headers
            };
            let chunks = [];
            resp.on('data', (chunk) => chunks.push(chunk));
            resp.on('end', () => {
                res.body = Buffer.concat(chunks).toString(options.encoding || "utf8");
                resolve(res);
            });
        });
        req.write(options.body || "");
        req.end();
    });
}

// file utils

export const asyncReadFile = (path) => {
    return new Promise(((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) reject(err);
            else resolve(data);
        })
    }));
}

export const asyncReadJSONFile = async (path) => {
    return JSON.parse((await asyncReadFile(path)).toString());
}

// riot utils

export const parseSetCookie = (setCookie) => {
    const cookies = {};
    for(const cookie of setCookie) {
        const sep = cookie.indexOf("=");
        cookies[cookie.slice(0, sep)] = cookie.slice(sep + 1, cookie.indexOf(';'));
    }
    return cookies;
}

export const stringifyCookies = (cookies) => {
    const cookieList = [];
    for (let [key, value] of Object.entries(cookies)) {
        cookieList.push(key + "=" + value);
    }
    return cookieList.join("; ");
}

export const extractTokensFromUri = (uri) => {
    // thx hamper for regex
    const [, accessToken, idToken] = uri.match(/access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/);
    return [accessToken, idToken]
}

const decodeToken = (token) => {
    const encodedPayload = token.split('.')[1];
    return JSON.parse(atob(encodedPayload));
}

export const tokenExpiry = (token) => {
    return decodeToken(token).exp * 1000;
}

export const MAINTENANCE = "MAINTENANCE";

export const isMaintenance = (json) => {
    return json.httpStatus === 403 && json.errorCode === "SCHEDULED_DOWNTIME";
}

// discord utils

import {compTierEmoji, rarityEmoji} from "./emoji.js";
import {MessageActionRow, MessageButton, Permissions, Util} from "discord.js";

export const VAL_COLOR_1 = 0xFD4553;
export const VAL_COLOR_2 = 0x0F1923;

export const VAL_BLUE_TEAM_COLOR = 0x58ddc4;
export const VAL_RED_TEAM_COLOR = 0xf46c7c;

export const escapeMarkdown = Util.escapeMarkdown;

export const basicEmbed = (content) => {
    return {
        description: content,
        color: VAL_COLOR_1
    }
}

export const basicReply = (interaction, msg, ephemeral = true) => {
    return interaction.reply({
        embeds: [basicEmbed(msg)],
        ephemeral: ephemeral
    })
}

export const secondaryEmbed = (content) => {
    return {
        description: content,
        color: VAL_COLOR_2
    }
}

export const skinChosenEmbed = async (skin, channel) => {
    let  description = `Successfully set an alert for the **${await skinNameAndEmoji(skin, channel)}**!`;
    if(!skin.rarity) description += "\n***Note:** This is a battle pass skin!*";
    return {
        description: description,
        color: VAL_COLOR_1,
        thumbnail: {
            url: skin.icon
        }
    }
}

export const skinNameAndEmoji = async (skin, channel) => {
    if(!skin.rarity) return skin.name;
    const rarityIcon = await rarityEmoji(channel.guild, skin.rarity.name, skin.rarity.icon, externalEmojisAllowed(channel));
    return rarityIcon ? `${rarityIcon} ${skin.name}` : skin.name;
}

export const compTier = async (tier, channel) => {
    const tierIcon = await compTierEmoji(channel.guild, tier.tierName, tier.smallIcon, externalEmojisAllowed(channel));
    return tierIcon ? `${tierIcon}` : tier.tierName;
}

export const removeAlertButton = (id, uuid) => new MessageButton().setCustomId(`removealert/${uuid}/${id}/${Math.round(Math.random() * 10000)}`).setStyle("DANGER").setLabel("Remove Alert").setEmoji("✖");
export const removeAlertActionRow = (id, uuid) => new MessageActionRow().addComponents(removeAlertButton(id, uuid));

// apparently the external emojis in an embed only work if @everyone can use external emojis... probably a bug
export const externalEmojisAllowed = (channel) => channel.permissionsFor(channel.guild.roles.everyone).has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS);
export const emojiToString = (emoji) => `<:${emoji.name}:${emoji.id}>`;
