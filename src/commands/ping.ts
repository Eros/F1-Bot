import {Command} from "./impl/Command";

const command: Command = {
    name: 'ping',
    description: 'pong',
    async execute(message, arts) {
        await message.reply('pong');
    },
};

export default command;