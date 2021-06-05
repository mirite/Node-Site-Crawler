import Page from './pages';
import fs from 'fs';

let myReqs: Array<Page> = [];
let pagesCrawled = 0;

async function crawlSite(domain: string): Promise<void> {

	const homepage = new Page(`https://${domain}`, domain);
	await crawlPage(homepage);
	writeResults(domain);
	myReqs.forEach(req => {
		if (req.responseCode != 200) console.log(`Code: ${req.responseCode} from ${req.target} Linked from ${req.source}`);
	})
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

function writeResults(domain: string): void {
	const path = makePathSafe(domain);
	if (!fs.existsSync('crawls')){
		fs.mkdirSync('crawls');
	}
	if (!fs.existsSync('crawls/' + path)){
		fs.mkdirSync('crawls/' + path);
	}
	fs.writeFileSync(`crawls/${path}.json`, JSON.stringify(myReqs));
	let i = 0;
	for (const req of myReqs) {
		fs.writeFileSync(`crawls/${path}/${i}.json`, JSON.stringify(req));
		i++;
	}

}

function makePathSafe(domain:string):string {
	return domain.replace(/\./g, '_');
}

function loadResults(domain: string): Array<Page> {
	
	const path = makePathSafe(domain);

	const raw = fs.readFileSync(`crawls/${path}.json`);
	const body = JSON.parse(raw.toString());
	return body;
}

export default {
	crawlSite,
	writeResults,
	loadResults,
}