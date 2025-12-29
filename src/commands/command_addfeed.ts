import { readConfig } from "src/config";
import { createFeed, createFeedFollow } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { printFeedFollow } from "./command_follow";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFeedFollow(user.name, feedFollow.feedName);

  console.log("Feed created successfully:");
  printFeed(feed, user);
}
function printFeed(feed:Feed, user: User): void{
    console.log(`* ID: ${feed.id}`);
    console.log(`* name: ${feed.name}`);
    console.log(`* URL: ${feed.url}`);
    console.log(`* User: ${user.name}`);
} 
