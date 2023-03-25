export interface Command {
    name: string,
    description: string,
    alias: string[],
    execute: (message: import('discord.js').Message, args: string[]) => void | Promise<void>
}