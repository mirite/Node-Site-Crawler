
import { TestGroup, runTestGroups } from './tests';

function findProtocol(url: string): string {
	if (!url.includes("//")) return ``;
	if (url.indexOf("//") === 0) return `https`;
	if (!url.includes("://")) return ``;
	return url.substring(0, url.indexOf(`://`)).toLowerCase();
}

function findDomain(url: string): string {
	if (isRelative(url)) return ``;
	const protocol = findProtocol(url);
	let output = url.replace(protocol, ``).toLowerCase();
	const re = /(\:?\/\/)/i;
	output = output.replace(re, '');
	if (output.includes(`/`)) return output.substring(0, output.indexOf(`/`));
	return output;
}

function isRelative(url: string): boolean {
	return findProtocol(url) === ``;
}

function runTests() {
	runTestGroups(testStrings);
}

const testStrings: Array<TestGroup> = [
	{
		input: `https://jesseconner.ca`,
		tests: [
			{
				function: findProtocol,
				expected: `https`,
			},
			{
				function: findDomain,
				expected: `jesseconner.ca`,
			},

		],

	},
	{
		input: `//SomeCDN/asset.css`,
		tests: [{
			function: findProtocol,
			expected: `https`,
		},
		{
			function: findDomain,
			expected: `somecdn`,
		},
		],
	},
	{
		input: `//assets.SomeCDN/asset.css`,
		tests: [{
			function: findProtocol,
			expected: `https`,
		},
		{
			function: findDomain,
			expected: `assets.somecdn`,
		},
		],
	},
	{
		input: `//jesseconner.ca/`,
		tests: [{
			function: findProtocol,
			expected: `https`,
		},
		{
			function: findDomain,
			expected: `jesseconner.ca`,
		},
		],
	},
	{
		input: `ftp://127.0.0.1`,
		tests: [{
			function: findProtocol,
			expected: `ftp`,
		},
		{
			function: findDomain,
			expected: `127.0.0.1`,
		},
		],
	},
	{
		input: `/index.html`,
		tests: [{
			function: findProtocol,
			expected: ``,
		},
		{
			function: findDomain,
			expected: ``,
		},],
	},
	{
		input: '/',
		tests: [{
			function: findProtocol,
			expected: ``,
		},
		{
			function: findDomain,
			expected: ``,
		},],
	},
	{
		input: `folder/index`,
		tests: [{
			function: findProtocol,
			expected: ``,
		},
		{
			function: findDomain,
			expected: ``,
		},],
	},
	{
		input: `bad//relative`,
		tests: [{
			function: findProtocol,
			expected: ``,
		},
		{
			function: findDomain,
			expected: ``,
		},],
	}
];

export default {
	findProtocol,
	runTests,
};