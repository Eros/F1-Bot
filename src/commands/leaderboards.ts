import {Command} from "./interface/Command";
import axios from "axios/index";
import {EmbedBuilder} from "discord.js";
import {Standings} from "./interface/Standings";

const command: Command = {
    name: 'leaderboard',
    description: 'Show the current leaderboard of points',
    alias: ['lb', 'lbs', 'standings', 'pos'],
    async execute(message, args) {
        const response = await axios.get('https://ergast.com/api/f1/current/driverStandings.json');
        const standingsData = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const standings: Standings[] = standingsData.map((standing: any, index: number) => {
            const driver = standing.Driver;
            const name = `${driver.givenName} ${driver.familyName}`;
            const points = standing.points;
            const position = index + 1;

            return { name, points, position };
        });

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🏆 Formula 1 Leaderboard 🏆');

        standings.forEach((standing: Standings) => {
            embed.addFields({
                name: `#${standing.position}`,
                value: `${standing.name} 📊 Points: ${standing.points}`
            });
        });

        message.channel.send({ embeds: [embed] });
    }
}

export default command;