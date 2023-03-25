import {Command} from "./interface/Command";

const command: Command = {
    name: 'ping',
    description: 'pong',
    alias: [''],
    async execute(message, arts) {
        await message.reply('pong');
    },
};

export default command;