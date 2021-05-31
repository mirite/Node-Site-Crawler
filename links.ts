import { ArrayTestGroup, runArrayTestGroups } from './tests';
import URLTools from './urls';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const allowedFileList = [`php`, `asp`, `htm`, `html`, `aspx`, ``];
const allowedProtocolList = [`http`, `https`, ``];

function find(body: string, domain: string, current?: string): Array<string> {
	
	const dom = new JSDOM(body);
	const doc = dom.window.document;
	const anchors = doc.querySelectorAll(`a`);

	// const re = /href=[\"\']?([^\"\'\ \>]+)[\"\']?/g;
	const results: Array<string> = [];
	// let match:RegExpExecArray;
	//while ((match = re.exec(body)) !== null) {
	for (const result of anchors) {
		const match = result.href;
		const link = URLTools.cleanLink(match, domain, current ?? ``);
		if (!link) continue;
		if (!allowedFileList.includes(URLTools.findFileType(link))) continue;
		if (!allowedProtocolList.includes(URLTools.findProtocol(link))) continue;
		if (URLTools.findDomain(link).includes(`:`) || URLTools.findPath(link).includes(`:`) ) continue;
		results.push(link);
	}
	return results;
}

function findInternal(body: string, domain: string, current: string): Array<string> {
	const allLinks = find(body, domain, current);
	return allLinks.filter(link => { return URLTools.isInternal(link, domain) });
}

function findExternal(body: string, domain: string): Array<string> {
	const allLinks = find(body, domain);
	return allLinks.filter(link => {return !URLTools.isInternal(link, domain)});
}

function runTests() {
	runArrayTestGroups(testArrays);
}

function findBridge(body: string): Array<string> {
	return find(body, `https://jesseconner.ca`);
}

const testArrays: Array<ArrayTestGroup> = [
	{
		input: `<a href=https://jesseconner.ca>`,
		tests: [
			{
				function: findBridge,
				expected: [`https://jesseconner.ca/`],
			},

		],

	},
	{
		input: `<a href="https://jesseconner.ca">`,
		tests: [
			{
				function: findBridge,
				expected: [`https://jesseconner.ca/`],
			},

		],

	},
	{
		input: `<a href='https://jesseconner.ca'>`,
		tests: [
			{
				function: findBridge,
				expected: [`https://jesseconner.ca/`],
			},

		],

	},
	{
		input: `<a href=https://jesseconner.ca targe="_blank">`,
		tests: [
			{
				function: findBridge,
				expected: [`https://jesseconner.ca/`],
			},

		],

	},
	{
		input: `<a href=https://jesseconner.ca targe="_blank"><link rel="stylesheet" href="styles/style.css"><a href='#'>Blah</a>`,
		tests: [
			{
				function: findBridge,
				expected: [`https://jesseconner.ca/`],
			},

		],

	},
]

export default {
	find,
	findInternal,
	findExternal,
	runTests,
}
