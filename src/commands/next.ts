import {Command} from "../interface/Command";
import {EmbedBuilder} from "discord.js";
import {getCurrentSeason} from "../cache/seasonCache";
import {Race} from "../interface/Race";
import {Format, MessageTimestamp} from "../classes/MessageTimestamp";

const command: Command = {
    name: 'next',
    description: 'Displays the data of the next upcoming race.',
    alias: [''],
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setColor(5793266)
            .setTitle('Next race is');

        const races = await getCurrentSeason();

        if (!races) {
            message.reply(':x: Sorry, we could not obtain the current calendar!');
            return;
        }

        let next = null;

        const now = new Date();
        for (let race of races) {
            if (new Date(race.date) > now) {
                next = race;
                break;
            }
        }

        if (!next) {
            message.reply(':x: Sorry, there was an issue with getting the next race!');
            return;
        }

        embed.addFields({
            name: `🏎️ ${next.raceName}`,
            value: `📅 ${new MessageTimestamp(new Date(next.date)).toString(Format.SHORT_FULL)} ${new MessageTimestamp(new Date(next.date)).toString(Format.RELATIVE)}\n📍 ${next.location}`
        });

        message.channel.send({embeds: [embed]});
    }
}

export default command;