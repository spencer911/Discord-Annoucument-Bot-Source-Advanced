import {getUser, redeemUsernamePassword} from "./services/riotAuthService.js"
import {escapeMarkdown} from "./util.js"
import {deleteUser, redeem2FACode, redeemCookies} from "./services/riotAuthService.js"
import {removeAlertsFromUser} from "./alerts.js"

export const login = (discordId, discordTag, riotUsername, riotPassword) => {
    return redeemUsernamePassword(discordId, riotUsername, riotPassword)
        .then(login => {
            const user = getUser(discordId)
            let replyMsg = ''

            if (login && user) {
                if (login.success) {
                    console.log(`${discordTag} logged in as ${user.username}`)
                    replyMsg = `Successfully logged in as **${user.username}**!`
                } else if (login.mfa) {
                    console.log(`${discordTag} needs 2FA code`)
                    replyMsg = login.method === "email" ? `**Riot sent a code to ${escapeMarkdown(login.email)}!** Use \`/2fa\` to complete your login.` : '**You have 2FA enabled!** use `/2fa` to enter your code.'
                }
            } else {
                console.log(`${discordTag} login failed`)
                replyMsg = "Invalid username or password!"
            }
            return replyMsg
        })
}

export const twoFactorAuth = (discordId, discordTag, twoFactorCode) => {
    let user = getUser(discordId)

    if (!user) {
        return "**You're not registered with the bot!** Try `/login`."
    } else if (!user.waiting2FA) {
        return "**Not expecting a 2FA code!** Try `/login` if you're not logged in."
    } else {
        const code = twoFactorCode.toString().padStart(6, '0')
        return redeem2FACode(discordId, code)
            .then(success => {
                user = getUser(discordId)
                if (success && user) {
                    console.log(`${discordTag} logged in as ${user.username} with 2FA code`)
                    return `Successfully logged in as **${user.username}**!`
                } else {
                    console.log(`${discordTag} 2FA code failed`)
                    return "Invalid 2FA code!"
                }
            })
            .catch(() => {
                console.log(`${discordTag} 2FA code failed`)
                return "Invalid 2FA code!"
            })
    }
}

export const loginWithCookies = (discordId, discordTag, cookieString) => {
    return redeemCookies(discordId, cookieString)
        .then(success => {
            const user = getUser(discordId)
            if (success && user) {
                console.log(`${discordTag} logged in as ${user.username} using cookies`)
                return `Successfully logged in as **${user.username}**!`
            } else {
                console.log(`${discordTag} cookies login failed`);
                return "Whoops, that didn't work! Are your cookies formatted correctly?"
            }
        })
        .catch(() => {
            console.log(`${discordTag} cookies login failed`);
            return "Whoops, that didn't work! Are your cookies formatted correctly?"
        })
}

export const removeUser = (discordId, discordTag) => {
    if (getUser(discordId)) {
        deleteUser(discordId)
        removeAlertsFromUser(discordId)
        console.log(`${discordTag} deleted their account`)
        return "Your account has been deleted from the ValorantBot database!"
    } else {
        return "I can't forget you if you're not registered!"
    }
}