import {Command} from "../interface/Command";
import {Colors, EmbedBuilder} from "discord.js";

const command: Command = {
    name: 'help',
    description: 'Lists all available public commands',
    alias: [],
    async execute(message, args) {
        const embed = new EmbedBuilder()
            .setTitle(':wrench: F1 Bot Commands')
            .setColor(Colors.DarkOrange)
            .addFields({
                    name: 'calendar [cal, cl]',
                    value: 'Displays the current seasons calendar & when they\'re starting',
                    inline: true
                },
                {
                    name: 'driver <number|lastName>',
                    value: 'Displays information on specified driver',
                    inline: true
                },
                {
                    name: 'help',
                    value: 'this',
                    inline: true
                },
                {
                    name: 'leaderboards [lb, lbs, standings, pos]',
                    value: 'Displays the current standings for the current season.',
                    inline: true
                },
                {
                    name: 'next',
                    value: 'Displays information on the next upcomming race',
                    inline: true
                }
            );
    }
}