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

function findPath(url: string): string {
	if (isOnPageAnchor(url)) return ``;
	let output = removeDomain(url);
	output = removeAnchor(output);
	if (output === ``) return `/`;
	return output;
}

function findFileName(url: string): string {
	let output = findPath(url);
	if (!output) return ``;
	output = output.substring(output.lastIndexOf(`/`) + 1);
	if (!output.includes(`.`)) return ``;
	return output;
}

function findFileType(url: string): string {
	let filename = findFileName(url);
	if (!filename) return ``;
	if (filename.includes(`?`)) filename = filename.substring(0, filename.indexOf(`?`));
	const fileType = filename.substring(filename.indexOf(`.`) + 1);
	return fileType;
}

function isRelative(url: string): boolean {
	return findProtocol(url) === ``;
}

function isOnPageAnchor(url: string): boolean {
	return url.substring(0, 1) === `#`;
}

function removeDomain(url: string): string {
	let output = url.toLowerCase();
	const domain = findDomain(url);
	//  console.log(url, domain);
	if(domain) output = output.substring(output.indexOf(domain) + domain.length + 1);
	return output;
}

function removeAnchor(url: string): string {
	if (!url.includes(`#`)) return url;
	let output = url.substring(0, url.indexOf(`#`));
	return output;
}

function isRoot(url: string): boolean {
	if (isOnPageAnchor(url)) return false;
	let bare = removeDomain(url);
	bare = removeAnchor(bare);
	return bare === `` || bare === `/`;
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
			{
				function: findPath,
				expected: `/`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: findFileName,
				expected: ``,
			},
			{
				function: findFileType,
				expected: ``,
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
			{
				function: findPath,
				expected: `asset.css`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: `asset.css`,
			},
			
			{
				function: findFileType,
				expected: `css`,
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
			{
				function: findPath,
				expected: `asset.css`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: `asset.css`,
			},
			
			{
				function: findFileType,
				expected: `css`,
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
			{
				function: findPath,
				expected: `/`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
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
			{
				function: findPath,
				expected: `/`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
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
			},
			{
				function: findPath,
				expected: `/index.html`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: `index.html`,
			},
			
			{
				function: findFileType,
				expected: `html`,
			},
		],
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
			},
			{
				function: findPath,
				expected: `/`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `folder/index`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
			function: findDomain,
			expected: ``,
			},
			{
				function: findPath,
				expected: `folder/index`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `bad//relative`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
				function: findDomain,
				expected: ``,
			},
			{
				function: findPath,
				expected: `bad//relative`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `#`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
				function: findDomain,
				expected: ``,
			},
			{
				function: findPath,
				expected: ``,
			},
			{
				function: isOnPageAnchor,
				expected: true,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `#somewhere`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
				function: findDomain,
				expected: ``,
			},
			{
				function: findPath,
				expected: ``,
			},
			{
				function: isOnPageAnchor,
				expected: true,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `http://localhost/#home`,
		tests: [
			{
				function: findProtocol,
				expected: `http`,
			},
			{
				function: findDomain,
				expected: `localhost`,
			},
			{
				function: findPath,
				expected: `/`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: ``,
			},
			
			{
				function: findFileType,
				expected: ``,
			},
		],
	},
	{
		input: `somefolder.php#home`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
				function: findDomain,
				expected: ``,
			},
			{
				function: findPath,
				expected: `somefolder.php`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: `somefolder.php`,
			},
			
			{
				function: findFileType,
				expected: `php`,
			},
		],
	},
	{
		input: `/path/someimage.png?size=1x1`,
		tests: [
			{
				function: findProtocol,
				expected: ``,
			},
			{
				function: findDomain,
				expected: ``,
			},
			{
				function: findPath,
				expected: `/path/someimage.png?size=1x1`,
			},
			{
				function: isOnPageAnchor,
				expected: false,
			},
			{
				function: isRoot,
				expected: false,
			},
			{
				function: findFileName,
				expected: `someimage.png?size=1x1`,
			},
			
			{
				function: findFileType,
				expected: `png`,
			},
		],
	},
];

export default {
	findProtocol,
	runTests,
};