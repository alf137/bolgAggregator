import { readConfig } from "src/config";
import { getUsers } from "src/lib/db/queries/users";

export async function handlerUsers(cmdName:string): Promise<void>{
    const userNames = await getUsers();
    const currentUser = readConfig().currentUserName
    for (let user of userNames){
        if (currentUser === user.names){
            console.log(`* ${user.names} (current)`)
        } else {
            console.log(`* ${user.names}`)
        }
    }
}