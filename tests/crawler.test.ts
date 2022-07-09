import { Crawler } from '../src/crawler';

test('Found all pages', async () => {
  jest.setTimeout(30000);

  const crawler = new Crawler('jesseconner.ca');
  await crawler.crawlSite();

  expect(crawler.status.pagesCrawled).toBe(11);
});
