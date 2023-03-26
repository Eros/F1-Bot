import {Command} from "../interface/Command";
import axios from "axios";
import {Colors, EmbedBuilder} from "discord.js";
import {getDriverData} from "../cache/driverCache";

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
        const driverFromCache = await getDriverData(searchTerm);
        if (!driverFromCache) {
            message.reply(':x: Sorry, we could not find that driver!');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🏎️ ${driverFromCache} ${driverFromCache.name}`)
            .setColor(Colors.DarkGold)
            .addFields({
                    name: 'Driver Number: ',
                    value: `${driverFromCache.permNumber}`
                });

        if (driverFromCache.nationality) {
            embed.addFields({name: 'Nationality', value: `${driverFromCache.nationality}`});
        }
        if (driverFromCache.dateOfBirth) {
            embed.addFields({name: 'D.O.B', value: `${driverFromCache.dateOfBirth}`});
        }
        if (driverFromCache.wikiLink) {
            embed.addFields({name: 'Wiki Link', value: `${driverFromCache.wikiLink}`})
        }
        if (driverFromCache.totalRaces) {
            embed.addFields({name: 'Total Races', value: `${driverFromCache.totalRaces}`});
        }
        if (driverFromCache.totalPodiums) {
            embed.addFields({name: 'Total Podiums this season', value: `${driverFromCache.totalPodiums}`});
        }
        if (driverFromCache.totalWins) {
            embed.addFields({name: 'Total Wins this season', value: `${driverFromCache.totalWins}`});
        }

        message.channel.send({embeds: [embed]});
    }
}

export default command;