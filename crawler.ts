import Page from './pages'
import fs from 'fs'
const EventEmitter = require('events');

type Status = {
	pagesCrawled: number,
	currentPage: string,
	isDone: boolean,	
}

export default class Crawler {
	events = new EventEmitter()

	myReqs: Array<Page> = []
	
	status: Status = {
		pagesCrawled: 0,
		currentPage: '',
		isDone: false,
	};
	
	updateStatus():void {
		this.events.emit('update', status)
	}
	
	async crawlSite (domain: string): Promise<void> {
		  const homepage = new Page(`https://${domain}`, domain)
		await this.crawlPage(homepage)
		this.status.isDone = true;
		this.updateStatus();
		this.writeResults(domain)
	}
	
	getCrawled ():Array<string> {
	  const crawled: Array<string> = []
	  for (const request of this.myReqs) {
		crawled.push(request.target)
	  }
	  return crawled
	}
	
	async crawlPage (current: Page) {
		this.status.pagesCrawled++
		this.status.currentPage = current.target
		this.updateStatus()
		  await current.get()
	
	  const internalLinks = current.internalLinks()
	  if (!internalLinks) return
	
	  for (const link of internalLinks) {
		await this.processLink(link, current)
	  }
	}
	
	async processLink (link: string, current: Page) {
	  if (this.getCrawled().includes(link)) return
	  const newReq = new Page(link, current.domain, current.target)
	  this.myReqs.push(newReq)
	  await this.crawlPage(newReq)
	}
	
	writeResults (domain: string): void {
	  const path = this.makePathSafe(domain)
	  if (!fs.existsSync('crawls')) {
		fs.mkdirSync('crawls')
	  }
	  if (!fs.existsSync('crawls/' + path)) {
		fs.mkdirSync('crawls/' + path)
	  }
	  fs.writeFileSync(`crawls/${path}.json`, JSON.stringify(this.myReqs))
	  let i = 0
	  for (const req of this.myReqs) {
		fs.writeFileSync(`crawls/${path}/${i}.json`, JSON.stringify(req))
		i++
	  }
	}
	
	makePathSafe (domain:string):string {
	  return domain.replace(/\./g, '_')
	}
	
	loadResults (domain: string): Array<Page> {
	  const path = this.makePathSafe(domain)
	
	  const raw = fs.readFileSync(`crawls/${path}.json`)
	  const body = JSON.parse(raw.toString())
	  return body
	}
}
