import { XMLParser } from "fast-xml-parser";


export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const res = await fetch(feedURL, {
        headers: {
        "User-Agent": "gator",
        accept: "application/rss+xml",
        },
    });
    const required: string[] = [`title`, `link`, `description`]

    console.log("fetched!")
    const rssTxt = await res.text()
    const parser = new XMLParser()
    const parserObj = parser.parse(rssTxt)
    
    const channel = parserObj?.rss?.channel

    if (!channel){
        throw Error("channel propeerty of Object does not exist")
    }

    const missing = required.filter(k => channel[k] == null)
    if (missing.length) {
        throw Error(`Missing channel fields: ${missing.join(', ')}`)
    }

    let {title, link, description} = channel;

    if (!channel.item || !Array.isArray(channel.item)) {
        channel.item = new Array()
    }

    const items: RSSItem[] = channel.item.map((itm:RSSItem) => {
        const { title, link, description, pubDate } = itm ?? {};

        if (!title || !link || !description || !pubDate) return null;

        return { title, link, description, pubDate };
    }).filter(Boolean);

    const channelOut = {
        channel: {
            title: title,
            link: link,
            description: description,
            item: items
        }
    }
    
    return channelOut
} 