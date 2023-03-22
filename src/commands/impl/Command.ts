export interface Command {
    name: string;
    description: string;
    execute: (message: import('discord.js').Message, args: string[]) => void | Promise<void>;
}