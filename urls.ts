
import {TestGroup, runTestGroups} from './tests';

function findProtocol(url: String): String {
	if (!url.includes("//")) return ``;
	if (url.indexOf("//") === 0) return `https`;
	if (!url.includes("://")) return ``;
	return url.substring(0, url.indexOf(`://`));
}

function runTests() {
	runTestGroups(testStrings);
}

const testStrings:Array<TestGroup> = [
	{
		input: `https://jesseconner.ca`,
		tests: [{
			function: findProtocol,
			expected: `https`,
		}],
		
	},
	{
		input: `//SomeCDN/asset.css`,
		tests: [{
			function: findProtocol,
			expected: `https`,
		}],
	},
	{
		input: `ftp://127.0.0.1`,
		tests: [{
			function: findProtocol,
			expected: `ftp`,
		}],
	},
	{
		input: `/index.html`,
		tests: [{
			function: findProtocol,
			expected: ``,
		}],
	},
	{
		input: '/',
		tests: [{
			function: findProtocol,
			expected: ``,
		}],
	},
	{
		input: `folder/index`,
		tests: [{
			function: findProtocol,
			expected: ``,
		}],
	},
	{
		input: `bad//relative`,
		tests: [{
			function: findProtocol,
			expected: ``,
		}],
	}
];

export default  {
	findProtocol,
	runTests,
};