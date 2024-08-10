# Node-Site-Crawler

A simple node module to crawl a domain and generate a page list. This is very much an experimental work in progress.

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

## Usage examples:

### Crawling sites:

```javascript
import { Crawler } from "simple-node-site-crawler";

async function run() {
	const crawler = new Crawler(`jesseconner.ca`);

	await crawler.crawlSite();
}

run();
```

### Checking Status:

```javascript
crawler.events.on("update", (status) => {
	if (status.isDone) {
		console.log("Done!");
		return;
	}
	console.log(
		`Crawling ${status.currentPage} (Pages crawled: ${status.pagesCrawled})`,
	);
});
```

### Working with results:

```javascript
import { Crawler } from "simple-node-site-crawler";
const crawler = new Crawler(`jesseconner.ca`);
const site = crawler.loadResults();

// Find any pages not linked from homepage.
const burriedPages = site.filter(
	(page) => page.source != `https://jesseconner.ca/`,
);
burriedPages.map((page) => console.log(page.source));

// Find any pages that are bad links.
const missingPages = site.filter((page) => page.responseCode > 399);
missingPages.map((page) => console.log(page.source));
```
