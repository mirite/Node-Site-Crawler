import { Crawler } from '../crawler';

test('Found all pages', async () => {
  const crawler = new Crawler('jesseconner.ca');
  await crawler.crawlSite();

  expect(crawler.status.pagesCrawled).toBe(10);
});
