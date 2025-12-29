import { eq } from "drizzle-orm";
import { db } from "src/lib/db";
import { createFeedFollow } from "src/lib/db/queries/feeds";
import { Feed, feeds, User } from "src/lib/db/schema";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
  const url = args[0];
  const feeds = await getFeedByURL(url);
  const feed = feeds[0];

  if (!feed) {
    throw new Error("feed not found");
  }

  const follow = await createFeedFollow(user.id, feed.id);
  console.log(follow.userName, follow.feedName);
}

async function getFeedByURL(url:string){
    const feed: Feed[] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url))
    return feed
}


export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:          ${username}`);
  console.log(`* Feed:          ${feedname}`);
}