import links from "../src/links";
import {test, expect} from 'vitest';

type ArrayTest = {
	function: (url: string) => Array<string | boolean>;
	expected: Array<string | boolean>;
};

type ArrayTestGroup = {
	input: string;
	tests: Array<ArrayTest>;
};

const domain = "jesseconner.ca";
const current = "https://jesseconner.ca/";

/** @param body */
function findBridge(body: string): Array<string> {
	return links.find(body, domain, current);
}

const testArrays: Array<ArrayTestGroup> = [
	{
		input: "<a href=https://jesseconner.ca>",
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/"],
			},
		],
	},
	{
		input: '<a href="https://jesseconner.ca">',
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/"],
			},
		],
	},
	{
		input: '<a href="newPage.html">',
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/newPage.html"],
			},
		],
	},
	{
		input: "<a href='https://jesseconner.ca'>",
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/"],
			},
		],
	},
	{
		input: '<a href=https://jesseconner.ca targe="_blank">',
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/"],
			},
		],
	},
	{
		input:
			'<a href=https://jesseconner.ca targe="_blank"><link rel="stylesheet" href="styles/style.css"><a href=\'#\'>Blah</a>',
		tests: [
			{
				function: findBridge,
				expected: ["https://jesseconner.ca/"],
			},
		],
	},
];

testArrays.forEach((group) => {
	group.tests.forEach((urlTest) => {
		test(`${urlTest.function.name} for ${group.input} returns ${urlTest.expected}`, () => {
			expect(urlTest.function(group.input)[0]).toBe(urlTest.expected[0]);
		});
	});
});

test("Find Internal Links Only", () => {
	expect(
		links.findInternal(
			'<a href="/index.html">Blah</a><a href="https://google.ca">Google</a>',
			domain,
			current,
		)[0],
	).toBe("https://jesseconner.ca/index.html");
});

test("Find External Links Only", () => {
	expect(
		links.findExternal(
			'<a href="/">Blah</a><a href="https://google.ca">Google</a>',
			domain,
		)[0],
	).toBe("https://google.ca/");
});

test("Skip unsupported types", () => {
	expect(links.find('<a href="/index.pdf">Blah</a>', domain).length).toBe(0);
});

test("Skip on page anchors", () => {
	expect(links.find('<a href="#readmore">Blah</a>', domain).length).toBe(0);
});

test("No links returns empty array", () => {
	expect(links.find("Blah", domain).length).toBe(0);
});

test("Blank links get skipped", () => {
	expect(links.find('<a href="">Boo</a>', domain).length).toBe(0);
});

test("Unsupported protocols get skipped", () => {
	expect(
		links.find('<a href="ftp://hello@gmail.com">Boo</a>', domain).length,
	).toBe(0);
});
