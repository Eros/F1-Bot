import {DevCommand} from "./impl/DevCommand";
import {Command} from "../commands/impl/Command";

const command: Command = {
    name: 'ping',
    description: 'pong',
    async execute(message, arts) {
        await message.reply('pong');
    },
};

export default command;