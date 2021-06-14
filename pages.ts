import LinkFinder from './links';
import Request from './requests';

export default class Page {
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
        const response = await Request(this.target);
        this.body = response.body;
        this.responseCode = response.code;
      } catch (err) {
        this.responseCode = err.status;
      }
    }

    links(): Array<string> {
      if (!this.body) return null;
      return LinkFinder.find(this.body, this.domain, this.target);
    }

    internalLinks(): Array<string> {
      if (!this.body) return null;
      return LinkFinder.findInternal(this.body, this.domain, this.target);
    }

    externalLinks(): Array<string> {
      if (!this.body) return null;
      return LinkFinder.findExternal(this.body, this.domain);
    }
}
