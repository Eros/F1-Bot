import {Client, IntentsBitField, Message} from "discord.js";
import * as fs from "fs";
import {Command} from "./commands/impl/Command";
import {DevCommand} from "./devcommands/impl/DevCommand";
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions]})

const TOKEN = process.env.DISCORD_BOT_TOKEN as string;
// Each of these prefixes supports the different
// divisions of the formula series.
const DEV_PREFIX = 'f1dev';
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
        publicCommands.set(command.name, command);
    }
}

/**
 * Searches the dev commands directory for all commands
 * that are implementing the dev command interface.
 */
async function loadDevCommands() {
    for (const file of fs.readdirSync('./src/devcommands').filter((file) => file.endsWith('.ts'))) {
        const devCommand = (await import(`./devcommands/${file}`)).default as DevCommand;
        devCommands.set(devCommand.name, devCommand);
    }
}

/**
 * Handles all the commands based of the users
 * messages being sent.
 */
client.on('messageCreate', (message) => {
    let usedPrefix = getPrefixFromMessageContent(message);
    if (usedPrefix == null) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = publicCommands?.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Sorry, there was an error with this command!');
    }
});

/**
 * Handles all the dev commands based of
 * the users messages being sent. Checks the
 * users identifier to see if they're allowed to
 * run the command.
 */
client.on('messageCreate', (message) => {
    let usedPrefix = getPrefixFromMessageContent(message);
    if (usedPrefix != DEV_PREFIX) return;

    if (!DEVELOPERS.includes(message.author.id)) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = devCommands?.get(commandName);
    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Something went wrong with this command, check the error logs!');
    }
});

client.login(TOKEN).then(() => {
    if (client.user == null) {
        throw new Error('client#user is null');
    }
    console.log(`Logged in as ${client.user.tag}`);
    loadPublicCommands().then(() => loadDevCommands());
});

/**
 * Checks the messages inputted to see if there was
 * a prefix used within the message.
 * @param message that the user sent.
 * @return the prefix found or null if one was not found.
 */
function getPrefixFromMessageContent(message: Message): string | null {
    if (message == null) return null;
    let subString = message.content.substring(0, 1);

    if (subString === DEV_PREFIX) {
        return DEV_PREFIX;
    }

    for (let i = ALLOWED_PREFIXES.length - 1; i >= 0; i--) {
        if (ALLOWED_PREFIXES[i].includes(subString)) {
            return ALLOWED_PREFIXES[i];
        }
    }

    return null;
}
