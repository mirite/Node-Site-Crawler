import Page from "../src/pages";
import {test, expect} from 'vitest';

test("All external links found", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	await page.get();
	expect(page.externalLinks().length).toBe(6);
});

test("All internal links found", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	await page.get();
	expect(page.internalLinks().length).toBe(12);
});

test("All links found", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	await page.get();
	expect(page.links().length).toBe(18);
});

test("Empty array returned for external links on empty page", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	expect(page.externalLinks().length).toBe(0);
});

test("Empty array returned for internal links on empty page", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	expect(page.internalLinks().length).toBe(0);
});

test("Empty array returned for links on empty page", async () => {
	const page = new Page("https://jesseconner.ca/", "jesseconner.ca");
	expect(page.links().length).toBe(0);
});
