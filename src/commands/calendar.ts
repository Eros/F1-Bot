import {Command} from "../interface/Command";
import {EmbedBuilder} from "discord.js";
import {Race} from "../interface/Race";
import axios from "axios";
import {Format, MessageTimestamp} from "../classes/MessageTimestamp";

const command: Command = {
    name: 'calendar',
    description: 'Lists all the upcoming races for the current season',
    alias: ['cal', 'cl'],
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(5793266)
            .setTitle('Current Race Data');

        const races = await getUpcomingRaces();

        for (let race of races) {
            embed.addFields(
                {
                    name: `🏎️ ${race.raceName}`,
                    value: `📅 ${new MessageTimestamp(new Date(race.date)).toString(Format.SHORT_FULL)}\n📍 ${race.location}`,
                    inline: true
                },
            )
        }

        message.channel.send({embeds: [embed]});
    }
}

async function getUpcomingRaces(): Promise<Race[]> {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`https://ergast.com/api/f1/${currentYear}.json`);
    const racesData = response.data.MRData.RaceTable.Races;

    return racesData.map((racesData: any) => ({
        raceName: racesData.raceName,
        date: racesData.date,
        circuit: racesData.circuitId,
        location: `${racesData.Circuit.Location.locality}, ${racesData.Circuit.Location.country}`
    }));
}

export default command;