import { scrapeFeeds } from "src/lib/db/queries/feeds";
import { fetchFeed } from "src/lib/rss";

export async function handlerAgg(cmdName: string, time_between_reps: string, ...args:string[]): Promise<void>{
    const timeBetweenRequests = parseDuration(time_between_reps);
    console.log(`Collecting feeds every ${time_between_reps}`);
    
    const handleError = (err: unknown) => {
        console.error("Error scraping feeds:", err);
    };
    scrapeFeeds().catch(handleError)
        const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
        console.log("Shutting down feed aggregator...");
        clearInterval(interval);
        resolve();
        });
    });
}

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(`Invalid duration: ${durationStr}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  let ms: number = 0;
  switch (unit) {
    case "ms":
      ms = amount;
      break;
    case "s":
      ms = amount * 1000;
      break;
    case "m":
      ms = amount * 60 * 1000;
      break;
    case "h":
      ms = amount * 60 * 60 * 1000;
      break;
  }

  console.log(`Collecting feeds every ${durationStr}`);
  return ms;
}