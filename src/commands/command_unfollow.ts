import { deleteFeedFollower } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";


export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void>{
    await deleteFeedFollower(user,args[0])
}