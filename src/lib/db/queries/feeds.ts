import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feedFollows, FeedFollow, feeds, users, User } from "../schema";
import { getUser } from "./users";
import { fetchFeed, RSSFeed } from "src/lib/rss";
import { firstOrUndefined } from "./utils";
import { createPost } from "./posts";

export async function createFeed(name:string, url:string, userId: string): Promise<Feed> {
    const result: Feed[] = await db.insert(feeds).values({
        name: name,
        url: url,
        userId: userId
    }).returning()
    return result[0]
}

export async function getFeeds(): Promise<Feed[]>{
    const feedList: Feed[]= await db.select().from(feeds)
    return feedList
}

export async function createFeedFollow(
    userId: string,
    feedId: string,
){

    const [newFeedFollow] = await db.insert(feedFollows).values({
        userId: userId,
        feedId: feedId
    }).returning();
    const out = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
    }).from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId,users.id))
    .innerJoin(feeds, eq(feedFollows.feedId,feeds.id))
    .where(eq(feedFollows.id, newFeedFollow.id));
    return out[0]
}

export async function getFeedFollowsForUser(userId: string) {
    const feedFollowsForUser = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId,userId))
    return feedFollowsForUser    
    }

export async function deleteFeedFollower(user: User, feedURL: string): Promise<void>{
    await db.delete(feedFollows)
    .where(
        and(
            eq(feedFollows.userId,user.id),
            eq(feedFollows.feedId,
                db.select({ id: feeds.id})
                .from(feeds).where(eq(feeds.url, feedURL))
            )
        )
    )
}

export async function markFeedFetched(feedId:string){
    const result = await db.update(feeds)
    .set({lastFetchAt: new Date()})
    .where(eq(feeds.id, feedId)).returning();

    return firstOrUndefined(result)
}

export async function getNextFeedToFetch() {
  const result = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchAt} desc nulls first`)
    .limit(1);

  return firstOrUndefined(result);
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log("No feeds to fetch");
    return;
  }

  await markFeedFetched(feed.id);

  const fetchedFeed = await fetchFeed(feed.url);

  for (const item of fetchedFeed.channel.item) {
    await createPost({
        title: item.title,
        url: item.link,
        description: item.description,
        publishedAt: parsePublished(item.pubDate),
        feedId: feed.id,
    })
  }
}

function parsePublished(dateString: string): Date{
    return new Date(dateString)
}

