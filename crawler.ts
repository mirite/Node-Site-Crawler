import Page from './pages';
import fs from 'fs';
import { stringify } from 'querystring';

let myReqs: Array<Page> = [];
let pagesCrawled = 0;

export default async function crawlSite(domain: string): Promise<void> {

	const homepage = new Page(`https://${domain}`, domain);
	await crawlPage(homepage);

	fs.writeFileSync(`crawls/${domain.replace('.','_')}.json`, JSON.stringify(myReqs));
}

function getCrawled():Array<string> {
	const crawled: Array<string> = [];
	for (const request of myReqs) {
		crawled.push(request.target);
	}
	return crawled;
}

async function crawlPage(current: Page) {
	pagesCrawled++;
	console.log(`Crawling ${current.target} Pages crawled: ${pagesCrawled}`);
	await current.get();

	const internalLinks = current.internalLinks();
	if (!internalLinks) return;
	
	for (const link of internalLinks) {
		await processLink(link, current);
	}
}

async function processLink(link: string, current: Page) {
	if (getCrawled().includes(link)) return;
	const newReq = new Page(link, current.domain, current.target);
	myReqs.push(newReq);
	await crawlPage(newReq);
}