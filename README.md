# Node-Site-Crawler
 A simple node module to crawl a domain and generate a page list.

## Usage example:
 ```
import Crawler from 'simple-node-site-crawler';

async function run() {

	await Crawler.crawlSite(`jesseconner.ca`);
	Crawler.writeResults(`jesseconner.ca`);
	const site = Crawler.loadResults(`jesseconner.ca`);
 
 // Find any pages not linked from homepage.
	const results = site.filter(page => page.source != `https://jesseconner.ca/`);
	results.map(page => console.log(page.source));
	
	console.log(`Done!`);
}

run();
```
