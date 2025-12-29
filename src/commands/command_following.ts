import { getFeedFollowsForUser } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]):Promise<void> {
    const follows = await getFeedFollowsForUser(user.id)
    for (const follow of follows){
        console.log(`${follow.feedName}`)
    }
} 