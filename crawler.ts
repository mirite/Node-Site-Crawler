import fs from 'fs';
import EventEmitter from 'events';
import Page from './pages';

export type Status = {
    pagesCrawled: number,
    currentPage: string,
    isDone: boolean,
}

export class Crawler {
    events: EventEmitter

    myReqs: Array<Page>

    status: Status

    domain: string

    constructor(domain: string) {
      this.events = new EventEmitter();
      this.domain = domain;

      this.myReqs = [];

      this.status = {
        pagesCrawled: 0,
        currentPage: '',
        isDone: false,
      };
    }

    updateStatus(): void {
      this.events.emit('update', this.status);
    }

    async crawlSite(): Promise<void> {
      const homepage = new Page(`https://${this.domain}`, this.domain);
      await this.crawlPage(homepage);
      this.status.isDone = true;
      this.updateStatus();
      this.writeResults();
    }

    getCrawled():Array<string> {
      const crawled: Array<string> = [];
      this.myReqs.forEach((request) => {
        crawled.push(request.target);
      });
      return crawled;
    }

    async crawlPage(current: Page) {
      this.status.pagesCrawled += 1;
      this.status.currentPage = current.target;
      this.updateStatus();
      await current.get();

      const internalLinks = current.internalLinks();
      if (!internalLinks) return;

      internalLinks.forEach(async (link) => {
        await this.processLink(link, current);
      });
    }

    async processLink(link: string, current: Page) {
      if (this.getCrawled().includes(link)) return;
      const newReq = new Page(link, current.domain, current.target);
      this.myReqs.push(newReq);
      await this.crawlPage(newReq);
    }

    writeResults(): void {
      const path = this.makePathSafe(this.domain);
      if (!fs.existsSync('crawls')) {
        fs.mkdirSync('crawls');
      }
      if (!fs.existsSync(`crawls/${path}`)) {
        fs.mkdirSync(`crawls/${path}`);
      }
      fs.writeFileSync(`crawls/${path}.json`, JSON.stringify(this.myReqs));
      let i = 0;
      this.myReqs.forEach((req) => {
        fs.writeFileSync(`crawls/${path}/${i}.json`, JSON.stringify(req));
        i += 1;
      });
    }

    makePathSafe():string {
      return this.domain.replace(/\./g, '_');
    }

    loadResults(): Array<Page> {
      const path = this.makePathSafe();

      const raw = fs.readFileSync(`crawls/${path}.json`);
      const body = JSON.parse(raw.toString());
      return body;
    }
}
