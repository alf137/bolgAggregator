import { eq } from "drizzle-orm";
import { db } from "src/lib/db";
import { getFeeds } from "src/lib/db/queries/feeds";
import { Feed, User, users } from "src/lib/db/schema";


export async function handlerFeeds():Promise<void>{
    const feeds: Feed[] = await getFeeds()
    for (const feed of feeds){
        let user: User|undefined = await getUserByID(feed.userId)
        if (!user){
            throw Error( "user not defined")
        }
        console.log(`Name of feed: ${feed.name}`)
        console.log(`URL: ${feed.url}`)
        console.log(`Feed creator: ${user.name}`)
    }
}


export async function getUserByID(userID: string): Promise<User | undefined>{
    const user: User[] = await db.select().from(users).where(eq(users.id,userID))
    return user[0]
}

