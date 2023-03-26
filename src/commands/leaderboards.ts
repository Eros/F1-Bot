import {Command} from "../interface/Command";
import axios from "axios/index";
import {EmbedBuilder} from "discord.js";
import {Standings} from "../interface/Standings";
import {getLeaderboard} from "../cache/leaderboardCache";

const command: Command = {
    name: 'leaderboard',
    description: 'Show the current leaderboard of points',
    alias: ['lb', 'lbs', 'standings', 'pos'],
    async execute(message, args) {

        const standings = await getLeaderboard();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏆 Formula 1 Leaderboard 🏆');

        for (let standing of standings) {
            embed.addFields({
                name: `#${standing.position}`,
                value: `${standing.name} 📊 Points: ${standing.points}`
            });
        }

        message.channel.send({ embeds: [embed] });
    }
}

export default command;