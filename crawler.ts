import Page from './pages'
import fs from 'fs'
import { Interface } from 'readline';
import { SIGTERM } from 'constants';
const EventEmitter = require('events');
const events = new EventEmitter();

const myReqs: Array<Page> = []

type Status = {
	pagesCrawled: number,
	currentPage: string,
	isDone: boolean,	
}
const status: Status = {
	pagesCrawled: 0,
	currentPage: '',
	isDone: false,
};

function updateStatus():void {
	events.emit('update', status)
}

async function crawlSite (domain: string): Promise<void> {
  	const homepage = new Page(`https://${domain}`, domain)
	await crawlPage(homepage)
	status.isDone = true;
	updateStatus();
 	writeResults(domain)
}

function getCrawled ():Array<string> {
  const crawled: Array<string> = []
  for (const request of myReqs) {
    crawled.push(request.target)
  }
  return crawled
}

async function crawlPage (current: Page) {
	status.pagesCrawled++
	status.currentPage = current.target
	updateStatus()
  	await current.get()

  const internalLinks = current.internalLinks()
  if (!internalLinks) return

  for (const link of internalLinks) {
    await processLink(link, current)
  }
}

async function processLink (link: string, current: Page) {
  if (getCrawled().includes(link)) return
  const newReq = new Page(link, current.domain, current.target)
  myReqs.push(newReq)
  await crawlPage(newReq)
}

function writeResults (domain: string): void {
  const path = makePathSafe(domain)
  if (!fs.existsSync('crawls')) {
    fs.mkdirSync('crawls')
  }
  if (!fs.existsSync('crawls/' + path)) {
    fs.mkdirSync('crawls/' + path)
  }
  fs.writeFileSync(`crawls/${path}.json`, JSON.stringify(myReqs))
  let i = 0
  for (const req of myReqs) {
    fs.writeFileSync(`crawls/${path}/${i}.json`, JSON.stringify(req))
    i++
  }
}

function makePathSafe (domain:string):string {
  return domain.replace(/\./g, '_')
}

function loadResults (domain: string): Array<Page> {
  const path = makePathSafe(domain)

  const raw = fs.readFileSync(`crawls/${path}.json`)
  const body = JSON.parse(raw.toString())
  return body
}

export default {
  crawlSite,
  loadResults,
	Page,
	status: events,
}
