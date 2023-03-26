import {Command} from "../interface/Command";
import {EmbedBuilder} from "discord.js";
import {Race} from "../interface/Race";
import axios from "axios";
import {Format, MessageTimestamp} from "../classes/MessageTimestamp";
import {getCurrentSeason} from "../cache/seasonCache";

const command: Command = {
    name: 'calendar',
    description: 'Lists all the upcoming races for the current season',
    alias: ['cal', 'cl'],
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(5793266)
            .setTitle('Current Race Data');

        const races = await getCurrentSeason();

        if (!races) {
            message.reply(':x: Sorry, we could not find the current calendar!');
            return;
        }
        
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

export default command;