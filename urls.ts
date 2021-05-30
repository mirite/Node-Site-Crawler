import { TestGroup, runTestGroups } from './tests';

function findProtocol(url: string): string {
	if (!url.includes("//")) return ``;
	if (url.indexOf("//") === 0) return `https`;
	if (!url.includes("://")) return ``;
	return url.substring(0, url.indexOf(`://`)).toLowerCase();
}

function findDomain(url: string): string {
	if (isRelativeToRoot(url)) return ``;
	if (isRelativeToPage(url)) return ``;
	if (isOnPageAnchor(url)) return ``;
	const protocol = findProtocol(url);
	let output = url.replace(protocol, ``).toLowerCase();
	const re = /(\:?\/\/)/i;
	output = output.replace(re, '');
	if (output.includes(`/`)) return output.substring(0, output.indexOf(`/`));
	return output;
}

function endURL(url: string): string {
	if (!url.includes(`.`) && url.substring(url.length - 1) != `/`) return url + `/`;
	return url;
}

function findPath(url: string): string {
	if (isOnPageAnchor(url)) return ``;
	let output = removeDomain(url);
	output = removeAnchor(output);
	if (output === ``) return `/`;
	output = cleanPath(output)
	return output;
}

function stripDoubles(url: string): string {
	return url.replace(`//`, `/`);
}

function cleanPath(url: string) {
	url = endURL(url);
	url = stripDoubles(url);
	url = removeAnchor(url);
	return url;
}

function findPathFromRoot(url: string, sourcePage: string): string {
	let output = ``;

	let sourcePath = findPath(sourcePage);
	
	if ( sourcePath.substring(sourcePath.length - 1) != `/`) {
		const fileName = findFileName(sourcePage);
		sourcePath = sourcePath.replace(fileName, ``);
	}
	output = `/` + sourcePath + url;
	output = cleanPath(output)
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

function isRelativeToRoot(url: string): boolean {
	if (isOnPageAnchor(url)) return false;
	return findProtocol(url) === `` && url.substring(0,1) === `/`;
}

function isRelativeToPage(url: string): boolean {
	if (isOnPageAnchor(url)) return false;
	return findProtocol(url) === `` && url.substring(0,1) != `/`;
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

function isInternal(url: string, domain: string): boolean {
	if (isRelativeToRoot(url)) return true;
	if (isRelativeToPage(url)) return true;
	const linkDomain = findDomain(url);
	return domain === linkDomain;
}

function runTests() {
	runTestGroups(testStrings);
}

function formatExternalLink(url: string): string {
	const path = findPath(url);
	let output = ``;
	if (path && path != `/`) {
		output = findProtocol(url) + `://` + findDomain(url) + `/` + path;
	} else {
		output = findProtocol(url) + `://` + findDomain(url) + `/`;
	}
	
	return output;
}

function formatLink(url: string, domain: string, current: string): string {
	if (isOnPageAnchor(url)) return ``;
	if (!isInternal(url, domain)) return formatExternalLink(url);
	
	if (isRoot(url)) return `https://` + domain + `/`;
	let output;
	let path;
	if (isRelativeToRoot(url)) {
		path = findPath(url)
	}
	if (isRelativeToPage(url)) {
		path = findPathFromRoot(url, current);
	}
	output = `https://` + domain + path;
	return output;

}

function formatLinkTestBridge(url: string): string {
	return formatLink(url, `jesseconner.ca`, `https://jesseconner.ca/pages/`);
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
			{
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
				expected: false,
			},
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://somecdn/asset.css`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://assets.somecdn/asset.css`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `ftp://127.0.0.1/`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: `index.html`,
			},
			
			{
				function: findFileType,
				expected: `html`,
			},
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/index.html`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/`,
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
				expected: `folder/index/`,
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
				function: isRelativeToPage,
				expected: true,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/pages/folder/index/`,
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
				expected: `bad/relative/`,
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
				function: isRelativeToPage,
				expected: true,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/pages/bad/relative/`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `http://localhost/`,
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
				function: isRelativeToPage,
				expected: true,
			},
			{
				function: isRelativeToRoot,
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
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/pages/somefolder.php`,
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
				function: isRelativeToPage,
				expected: false,
			},
			{
				function: isRelativeToRoot,
				expected: true,
			},
			{
				function: findFileName,
				expected: `someimage.png?size=1x1`,
			},
			
			{
				function: findFileType,
				expected: `png`,
			},
			{
				function: formatLinkTestBridge,
				expected: `https://jesseconner.ca/path/someimage.png?size=1x1`,
			},
		],
	},
];

export default {
	findProtocol,
	isInternal,
	runTests,
	cleanLink: formatLink,
};