# Node-Site-Crawler
 A simple node module to crawl a domain and generate a page list.

## Page Anatomy

```javascript
{
	target: string;
	domain: string;
	source?: string;
	responseCode?: number;
	body?: string;
	links():Array<string>,
	internalLinks():Array<string>,
	externalLinks():Array<string>,
}
```
## Usage example:
 ```javascript
import Crawler from 'simple-node-site-crawler';

async function run() {

	await Crawler.crawlSite(`jesseconner.ca`);
	const site = Crawler.loadResults(`jesseconner.ca`);
 
 	// Find any pages not linked from homepage.
	const burriedPages = site.filter(page => page.source != `https://jesseconner.ca/`);
	burriedPages.map(page => console.log(page.source));
	
	// Find any pages that are bad links.
	const missingPages = site.filter(page => page.responseCode > 399);
	missingPages.map(page => console.log(page.source));
}

run();
```
