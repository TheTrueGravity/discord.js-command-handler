import { Collection } from 'discord.js';
import { Command, Category, Commands } from './interfaces';

export class commandTable {
    private commands: Collection<string, Command>
    private commandsIndex: Collection<number, string>
    
    private count: number

    constructor() {
        this.commands = new Collection()
        this.commandsIndex = new Collection()
        this.count = 0
    }

    get(index: string): Promise<Command>
    get(index: number): Promise<Command>
    
    async get(index: string | number): Promise<Command> {
        if (typeof index === 'string') {
            return this.commands.get(index)
        } else {
            return this.commands.get(this.commandsIndex.get(index))
        }
    }

    public async set(name: string, command: Command): Promise<void> {
        this.commands.set(name, command)
        this.commandsIndex.set(this.count, name)
        this.count++
    }
}

const table = new commandTable()

table.get(0)