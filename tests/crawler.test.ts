import { test, expect } from "vitest";

import { Crawler } from "../src";

test("Found all pages", async () => {
	const crawler = new Crawler("jesseconner.ca");
	await crawler.crawlSite();

	expect(crawler.status.pagesCrawled).toBe(11);
});
