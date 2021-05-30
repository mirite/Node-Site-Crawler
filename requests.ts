const axios = require('axios').default;
import LinkFinder from './links';

export default class Request {

	target: string;
	domain: string;
	source?: string;
	responseCode?: number;
	body?: string;

	constructor(target: string, domain: string, source?: string) {
		this.target = target;
		this.domain = domain;
		this.source = source ?? '';
	}

	async get(): Promise<void> {

		try {
			const response = await axios.get(this.target);
			this.body = response.data;
			this.responseCode = response.status;
			
		} catch (err) {
			console.log(err);
		}
	
	}

	links(): Array<string> {
		if (!this.body) return null;
		return LinkFinder.find(this.body);
	}

	internalLinks(): Array<string> {
		if (!this.body) return null;
		return LinkFinder.findInternal(this.body, this.domain);
	}

	externalLinks(): Array<string> {
		if (!this.body) return null;
		return LinkFinder.findExternal(this.body, this.domain);
	}

}