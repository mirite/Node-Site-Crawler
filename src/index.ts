import EventEmitter from "events";
import fs from "fs";

import Page from "./pages";

export { default as Page } from "./pages";

export type Status = {
	pagesCrawled: number;
	currentPage: string;
	isDone: boolean;
};

export class Crawler {
	events: EventEmitter;

	myReqs: Array<Page>;

	status: Status;

	domain: string;

	/** @param domain */
	constructor(domain: string) {
		this.events = new EventEmitter();
		this.domain = domain;

		this.myReqs = [];

		this.status = {
			pagesCrawled: 0,
			currentPage: "",
			isDone: false,
		};
	}

	updateStatus(): void {
		this.events.emit("update", this.status);
	}

	async crawlSite(): Promise<void> {
		const homepage = new Page(`https://${this.domain}/`, this.domain);
		await this.crawlPage(homepage);
		this.status.isDone = true;
		this.updateStatus();
		this.writeResults();
	}

	getCrawled(): Array<string> {
		const crawled: Array<string> = [];
		this.myReqs.forEach((request) => {
			crawled.push(request.target);
		});
		return crawled;
	}

	/** @param current */
	async crawlPage(current: Page) {
		this.status.pagesCrawled += 1;
		this.status.currentPage = current.target;
		this.updateStatus();
		await current.get();

		const internalLinks = current.internalLinks();
		if (!internalLinks) return;

		for (const link of internalLinks) {
			await this.processLink(link, current);
		}
	}

	/**
	 * @param link
	 * @param current
	 */
	async processLink(link: string, current: Page): Promise<void> {
		let skip = false;
		this.myReqs.forEach((request) => {
			if (request.target === link) {
				request.sources.push(current.target);
				skip = true;
			}
		});
		if (skip) return;
		const newReq = new Page(link, current.domain, current.target);
		this.myReqs.push(newReq);
		await this.crawlPage(newReq);
	}

	writeResults(): void {
		const path = this.makePathSafe();
		if (!fs.existsSync("crawls")) {
			fs.mkdirSync("crawls");
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

	makePathSafe(): string {
		return this.domain.replace(/\./g, "_");
	}

	loadResults(): Array<Page> {
		const path = this.makePathSafe();

		const raw = fs.readFileSync(`crawls/${path}.json`);
		const body = JSON.parse(raw.toString());
		return body;
	}
}
