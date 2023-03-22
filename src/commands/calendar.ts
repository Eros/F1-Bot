import {Command} from "./impl/Command";
import axios from "axios";

const command: Command = {
    name: 'calendar',
    'description': 'Lists all the upcoming races for the current season',
    async execute(message, args) {
        try {
            const response = await axios.get('https://ergast.com/api/f1/current.json');
            const races = response.data.MRData.RaceTable.Races;

            const currentDate = new Date();
            const upcomingRaces = races.filter((race: any) => new Date(race.date) > currentDate);

            if (upcomingRaces.length === 0) {
                await message.reply('There are no upcoming races this season');
            } else {
                const raceList = upcomingRaces.map((race: any, index: number) => {
                    return `${index + 1}. ${race.raceName} - ${race.date}`;
                });

                await message.reply(`Here are the upcoming races for the current F1 season:\n${raceList.join('\n')}`);
            }
        } catch (error) {
            console.error(error);
            await message.reply('There was an error fetching the calendar.');
        }
    }
}

export default command;