import {DevCommand} from "./impl/DevCommand";

const command: DevCommand = {
    name: 'test',
    description: 'complete',
    async execute(message, arts) {
        await message.reply('pong');
    },
};

export default command;