import { User } from "src/lib/db/schema";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = {
    [cmdName: string]: CommandHandler
}

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function registerCommand(registry: CommandsRegistry, cmdName:string, handler:CommandHandler): CommandsRegistry{
    registry[cmdName] = handler
    return registry
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]): Promise<void> {
    const handler = registry[cmdName];
    if (!handler) {
        throw new Error(`Command '${cmdName}' not found.`);
    }
    await handler(cmdName, ...args);
}
