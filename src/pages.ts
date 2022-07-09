import LinkFinder from './links';
import Request from './requests';

export default class Page {
  target: string;

  domain: string;

  source?: string;

  sources: Array<string>;

  responseCode?: number;

  body?: string;

  /**
     * Creates a new page object. get() must be called to populate the object.
     *
     * @param target The URL of the page that this object represents.
     * @param domain The domain of the crawl. Eg. google.ca
     * @param source The URL of the page that linked to this one.
     */
  constructor(target: string, domain: string, source?: string) {
    this.target = target;
    this.domain = domain;
    this.source = source ?? '';
    this.sources = [this.source];
  }

  async get(): Promise<void> {
    const response = await Request(this.target);
    this.body = response.body;
    this.responseCode = response.code;
  }

  links(): Array<string> {
    if (!this.body) return [];
    return LinkFinder.find(this.body, this.domain, this.target);
  }

  internalLinks(): Array<string> {
    if (!this.body) return [];
    return LinkFinder.findInternal(this.body, this.domain, this.target);
  }

  externalLinks(): Array<string> {
    if (!this.body) return [];
    return LinkFinder.findExternal(this.body, this.domain);
  }
}
