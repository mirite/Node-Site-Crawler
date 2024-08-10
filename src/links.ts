import URLTools from "./urls";

const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const allowedFileList = ["php", "asp", "htm", "html", "aspx", ""];
const allowedProtocolList = ["http", "https", ""];

/**
 * @param result
 * @param domain
 * @param current
 */
function findLink(result, domain, current) {
	const match = result.href;

	const link = URLTools.cleanLink(match, domain, current ?? "");

	if (!link) return null;
	if (!allowedFileList.includes(URLTools.findFileType(link))) return null;
	if (!allowedProtocolList.includes(URLTools.findProtocol(link))) return null;
	if (
		URLTools.findDomain(link).includes(":") ||
		URLTools.findPath(link).includes(":")
	)
		return null;
	return link;
}

/**
 * @param body
 * @param domain
 * @param current
 */
function find(body: string, domain: string, current?: string): Array<string> {
	const dom = new JSDOM(body);
	const doc = dom.window.document;
	const anchors = doc.querySelectorAll("a");

	const results: Array<string> = [];
	anchors.forEach((result) => {
		const link = findLink(result, domain, current);
		if (link) results.push(link);
	});
	return results;
}

/**
 * @param body
 * @param domain
 * @param current
 */
function findInternal(
	body: string,
	domain: string,
	current: string,
): Array<string> {
	const allLinks = find(body, domain, current);
	return allLinks.filter((link) => URLTools.isInternal(link, domain));
}

/**
 * @param body
 * @param domain
 */
function findExternal(body: string, domain: string): Array<string> {
	const allLinks = find(body, domain);
	return allLinks.filter((link) => !URLTools.isInternal(link, domain));
}

export default {
	find,
	findInternal,
	findExternal,
};
