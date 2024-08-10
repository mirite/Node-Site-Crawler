import { Crawler } from "../src";
import {test, expect} from 'vitest';

test("Found all pages", async () => {

	const crawler = new Crawler("jesseconner.ca");
	await crawler.crawlSite();

	expect(crawler.status.pagesCrawled).toBe(11);
});
