import { handlerUnfollow } from "./commands/command_unfollow";
import { middlewareLoggedIn } from "./commands/middleware/middleware";
import { handlerAddFeed } from "./commands/command_addfeed";
import { handlerAgg } from "./commands/command_agg";
import { handlerFeeds } from "./commands/command_feed";
import { handlerFollow } from "./commands/command_follow";
import { handlerFollowing } from "./commands/command_following";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/command_handler"
import { handlerLogin } from "./commands/command_login";
import { handlerRegister } from "./commands/command_register";
import { handlerReset } from "./commands/command_reset";
import { handlerUsers } from "./commands/command_users";
import { handlerBrowse } from "./commands/command_browse";

async function main():Promise<void> {
    const userInp: string[] = process.argv.slice(2)
    if (userInp.length === 0){
        console.log(" no args passed")
        process.exit(1)
    }
    const cmdName: string = userInp[0]
    const cmdArgs: string[] = userInp.slice(1)
    const commandsRegistry: CommandsRegistry = {}
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset)
    registerCommand(commandsRegistry, "users", handlerUsers)
    registerCommand(commandsRegistry, "agg", handlerAgg)
    registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed))
    registerCommand(commandsRegistry, "feeds", handlerFeeds)
    registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow))
    registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing))
    registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow))
    registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse))
    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (err) {
        if (err instanceof Error) {
        console.error(`Error running command ${cmdName}: ${err.message}`);
        } else {
        console.error(`Error running command ${cmdName}: ${err}`);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();