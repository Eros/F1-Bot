import {Client, IntentsBitField, Message, User} from "discord.js";
import * as fs from "fs";
import {Command} from "./interface/Command";
import {DevCommand} from "./devcommands/impl/DevCommand";
import dotenv from 'dotenv';
import {BotListener} from "./listeners/BotListener";

dotenv.config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent
    ]
});

const TOKEN = process.env.DISCORD_BOT_TOKEN as string;
// Each of these prefixes supports the different
// divisions of the formula series.
const DEV_PREFIX = 'dv';
const ALLOWED_PREFIXES = ['f1', 'f2', 'f3'];
const DEVELOPERS = ['226423378817449985' /*Rapid*/];

const publicCommands = new Map<String, Command>();
const devCommands = new Map<String, DevCommand>();

/**
 * Searches the commands directory for all commands
 * that are implementing the command interface.
 */
async function loadPublicCommands() {
    for (const file of fs.readdirSync(('./src/commands')).filter((file) => file.endsWith('.ts'))) {
        const command = (await import(`./commands/${file}`)).default as Command;
        log(`Found public command with name ${command.name}`);
        publicCommands.set(command.name, command);

        if (command.alias.length !== 0) {
            for (let alias of command.alias) {
                publicCommands.set(alias, command);
            }
        }
    }
}

/**
 * Searches the dev commands directory for all commands
 * that are implementing the dev command interface.
 */
async function loadDevCommands() {
    for (const file of fs.readdirSync('./src/devcommands').filter((file) => file.endsWith('.ts'))) {
        const devCommand = (await import(`./devcommands/${file}`)).default as DevCommand;
        log(`Found dev command with name ${devCommand.name}`);

        devCommands.set(devCommand.name, devCommand);
    }
}

client.login(TOKEN).then(() => {
    if (client.user == null) {
        throw new Error('client#user is null');
    }
    console.log(`Logged in as ${client.user.tag}`);
    loadPublicCommands()
        .then(() => loadDevCommands())
        .then(() => new BotListener(client));
});


/**
 * Checks the messages inputted to see if there was
 * a prefix used within the message.
 * @param message that the user sent.
 * @return the prefix found or null if one was not found.
 */
export function getPrefixFromMessageContent(message: Message): string | undefined {
    if (message == null || !message.content.trim()) {
        return undefined;
    }

    if (message.content.startsWith(DEV_PREFIX)) {
        return DEV_PREFIX;
    }
    return ALLOWED_PREFIXES.find((prefix) => message.content.startsWith(prefix));
}

export function log(message: String) {
    console.log(`[F1-Bot] ${message}`);
}

export function getPublicCommands(): Map<String, Command> {
    return publicCommands;
}

export function getDevCommands(): Map<String, DevCommand> {
    return devCommands;
}

export function isDeveloper(user: User): boolean {
    return DEVELOPERS.includes(user.id);
}

export function isDeveloperPrefix(message: Message): boolean {
    return message.content.startsWith(DEV_PREFIX);
}
