import {DevCommand} from "./impl/DevCommand";
import {EmbedBuilder} from "discord.js";

const command: DevCommand = {
    name: 'sys',
    description: 'system stats',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(3447003)
            .setTitle('Bot Stats')
            .addFields(
                {
                    name: ">> Uptime",
                    value: convertTime(process.uptime()),
                    inline: true
                },
                {
                    name: ">> RAM Usage",
                    value: (((process.memoryUsage().heapUsed / 1024) / 1024).toFixed(2)),
                    inline: true
                },
                {
                    name: ">> Websocket",
                    value: process.platform + " " + process.arch,
                    inline: true
                },
                {
                    name: "Discord JS Version",
                    value: require('discord.js').version,
                    inline: true
                }
            )
        message.channel.send({embeds: [embed]});
    }
};

function convertTime(ms: number): string {
    let sec = parseInt(String(ms), 10);
    let remainder = sec % 86400;
    let days = Math.floor(sec / 86400);
    let hours = Math.floor(remainder / 3600);
    let minutes = Math.floor((remainder / 60) - (hours * 60));
    let seconds = Math.floor((remainder % 3600) - (minutes * 60));

    if (days > 0) {
        return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    } else if (hours > 0) {
        return hours + "h " + minutes + "m " + seconds + "s";
    } else if (minutes > 0) {
        return minutes + "m " + seconds + "s";
    } else {
        return seconds + "s";
    }
}

export default command;