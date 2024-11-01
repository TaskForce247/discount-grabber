import { Crawler } from "./crawler";
import { LidlCrawler } from "./lidl";
import { Rema1000Crawler } from "./rema1000";

const crawlerList = [new LidlCrawler(), new Rema1000Crawler()];

export const crawlers: Record<string, Crawler> = {};
crawlerList.forEach((crawler) => (crawlers[crawler.store.id] = crawler));
