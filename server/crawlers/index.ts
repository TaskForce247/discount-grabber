import { Crawler } from "./crawler";
import { LidlCrawler } from "./lidl";

const crawlerList = [new LidlCrawler()];

export const crawlers: Record<string, Crawler> = {};
crawlerList.forEach((crawler) => (crawlers[crawler.store.id] = crawler));
