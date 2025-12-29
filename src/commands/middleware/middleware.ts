import { CommandHandler, UserCommandHandler } from "src/commands/command_handler";
import { readConfig } from "src/config";
import { getUser } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

type middleware = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler{
    const fun: CommandHandler = async function wrapper(cmdName: string, ...args:string[]){
        const userName: string = readConfig().currentUserName; 
        const user: User | undefined = await getUser(userName);
        if (!user) {
            throw new Error(`User ${userName} not found`);        }
        await handler(cmdName, user, ...args)
        return
    }
    return fun
}