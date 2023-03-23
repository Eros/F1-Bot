import {Command} from "./impl/Command";
import {EmbedBuilder} from "discord.js";
import {Race} from "./impl/Race";
import axios from "axios";

const command: Command = {
    name: 'calendar',
    'description': 'Lists all the upcoming races for the current season',
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(5793266)
            .setTitle('Current Race Data');

        const races = await getUpcomingRaces();

        for (let race of races) {
            const hammerTime = getHammertimeUrl(race.date);

            embed.addFields(
                {
                    name: '🏎️',
                    value: `📅 ${race.date} (${hammerTime})\n📍 ${race.circuit}, ${race.location}`
                },
            )
        }

        message.channel.send({embeds: [embed]});
    }
}

async function getHammertimeUrl(date: string): Promise<string> {
    const hammertimeBaseUrl = 'https://hammertime.cyou/api/v1/links';
    const hammertimeUrl = new URL(hammertimeBaseUrl);
    hammertimeUrl.searchParams.set('lang', 'en-GB');
    hammertimeUrl.searchParams.set('datetime', date);

    const response = await axios.get(hammertimeUrl.toString());
    const data = response.data;

    return data.link;
}

async function getUpcomingRaces(): Promise<Race[]> {
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`https://ergast.com/api/f1/${currentYear}.json`);
    const racesData = response.data.MRData.RaceTable.Races;

    return racesData.map((racesData: any) => ({
        raceName: racesData.raceName,
        date: racesData.date,
        circuit: racesData.circuit,
        location: `${racesData.Circuit.Location.locality}, ${racesData.Circuit.Location.country}`
    }));
}

export default command;