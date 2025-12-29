import { setUser } from "src/config"
import {createUser, getUser} from "src/lib/db/queries/users.js"

export async function handlerRegister(cmdName:string , ...args: string[]): Promise<void> {
    if (args.length != 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    } 

    const userInput: string = args[0]
 
    if (await getUser(userInput) !== undefined) {
        throw Error("user already exists") 
    }

    const user = await createUser(userInput);
    if (!user) {
        throw new Error(`User ${user} not found`);
    }

    setUser(user.name)
    console.log(`${user.name} was created`)
    console.log(user)
}
