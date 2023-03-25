import {Command} from "../interface/Command";

const command: Command = {
    name: 'ping',
    description: 'pong',
    alias: [''],
    async execute(message, args) {
        await message.reply('pong');
    },
};

export default command;