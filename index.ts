import Request from './requests';

let myReqs: Array<Request> = [];
let pagesCrawled = 0;

async function run() {
	let domain = `jesseconner.ca`;
	const homepage = new Request(`https://${domain}`, domain);
	await crawlPage(homepage);
	console.log(`Done!`);
}

function getCrawled():Array<string> {
	const crawled: Array<string> = [];
	for (const request of myReqs) {
		crawled.push(request.target);
	}
	return crawled;
}

async function crawlPage(current: Request) {
	pagesCrawled++;
	console.log(`Crawling ${current.target} Pages crawled: ${pagesCrawled}`);
	await current.get();

	const internalLinks = current.internalLinks();
	if (!internalLinks) return;
	
	for (const link of internalLinks) {
		await processLink(link, current);
	}
}

async function processLink(link: string, current: Request) {
	if (getCrawled().includes(link)) return;
	const newReq = new Request(link, current.domain, current.target);
	myReqs.push(newReq);
	await crawlPage(newReq);
}

run();