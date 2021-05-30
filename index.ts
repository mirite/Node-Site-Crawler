import Request from './requests';

let myReqs: Array<Request> = [];
let domain: string;

async function run() {
	domain = `https://jesseconner.ca`;
	const homepage = new Request(domain, domain);
	crawlPage(homepage);
}

function getCrawled():Array<string> {
	const crawled: Array<string> = [];
	for (const request of myReqs) {
		crawled.push(request.target);
	}
	return crawled;
}

async function crawlPage(current: Request) {
	console.log(`Crawling ${current.target}`);
	await current.get();

	const internalLinks = current.internalLinks();
	console.log(`Found ${internalLinks} links`);
	
	internalLinks.forEach(link => {
		if (getCrawled().includes(link)) return;
		const newReq = new Request(link, domain, current.target);
		myReqs.push(newReq);
		crawlPage(newReq);
	});
}

run();