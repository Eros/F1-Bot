import {Client, Events} from "discord.js";
import {
    generateHelpCommand,
    getDevCommands,
    getPrefixFromMessageContent,
    getPublicCommands,
    isDeveloper,
    isDeveloperPrefix,
    log
} from "../index";

export class BotListener {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.publicMessages();
        this.developerCommands();
    }

    private publicMessages() {
        this.client.on(Events.MessageCreate, message => {
            let usedPrefix = getPrefixFromMessageContent(message);

            if (usedPrefix == null) return;

            const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();

            log(`Command name = ${commandName}`)

            if (!commandName) return;

            if (commandName.toLowerCase() === 'help') {
                generateHelpCommand(message);
                return;
            }

            const command = getPublicCommands()?.get(commandName);
            if (!command) return;

            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('Sorry, there was an error with this command!');
            }
        });
    }

    private developerCommands() {
        this.client.on(Events.MessageCreate, message => {
            let usedPrefix = getPrefixFromMessageContent(message);
            if (usedPrefix === undefined) return;
            if (!isDeveloperPrefix(message)) return;

            if (!isDeveloper(message.author)) return;

            const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
            const commandName = args.shift()?.toLowerCase();

            if (!commandName) return;

            const command = getDevCommands()?.get(commandName);
            if (!command) return;

            try {
                command.execute(message, args);
            } catch (error) {
                console.error(error);
                message.reply('Something went wrong with this command, check the error logs!');
            }
        });
    }
}