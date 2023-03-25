import {Command} from "../interface/Command";
import axios from "axios";
import {Colors, EmbedBuilder} from "discord.js";

// TODO - set to use cache
export const command: Command = {
    name: 'driver',
    description: 'Provides life time information on specified driver',
    alias: [''],
    async execute(message, args) {
        if (args.length === 0) {
            message.reply(':x: Please specify the driver number or last name.');
            return;
        }

        const searchTerm = args[0].toLowerCase();
        const response = await axios.get('https://ergast.com/api/f1/current/drivers.json');
        const drivers = response.data.MRData.DriverTable.Drivers;

        const driver = drivers.find((d: any) => d.permanentNumber?.toLowerCase() === searchTerm || d.familyName.toLowerCase() === searchTerm);

        if (!driver) {
            message.reply(':x: Something went wrong with trying to find that drivers data, did you input it correctly?');
            return;
        }

        const driverStatsResponse = await axios.get(`https://ergast.com/api/f1/drivers/${driver.driverId}/results.json`);
        const driverStatsData = driverStatsResponse.data;
        const results = driverStatsData.MRData.RaceTable.Races;

        const totalRaces = results.length;
        const totalWins = getTotalWins(results);
        const totalPoles = getTotalPodiums(results);

        const embed = new EmbedBuilder()
            .setTitle(`🏎️ ${driver.givenName} ${driver.familyName}`)
            .setColor(Colors.DarkGold)
            .addFields({
                    name: 'Driver Number: ',
                    value: driver.permanentNumber
                });

        if (driver.nationality) {
            embed.addFields({name: 'Nationality', value: `${driver.nationality}`});
        }
        if (driver.dateOfBirth) {
            embed.addFields({name: 'D.O.B', value: `${driver.dateOfBirth}`});
        }
        if (driver.url) {
            embed.addFields({name: 'Wiki Link', value: `${driver.url}`})
        }
        if (totalRaces) {
            embed.addFields({name: 'Total Races', value: `${totalRaces}`});
        }
        if (totalPoles) {
            embed.addFields({name: 'Total Podiums this season', value: `${totalPoles}`});
        }
        if (totalWins) {
            embed.addFields({name: 'Total Wins this season', value: `${totalWins}`});
        }

        message.channel.send({embeds: [embed]});
    }
}

export default command;