import { ArrayTestGroup, runArrayTestGroups } from './tests';

function find(body: string): Array<string> {

	const re = /href=[\"\']?([^\"\'\ \>]+)[\"\']?/g;
	const results: Array<string> = [];
	let match:RegExpExecArray;
	while ((match = re.exec(body)) !== null) {
		results.push(match[1]);
		//console.log(match);
	}
	return results;
}

function runTests() {
	runArrayTestGroups(testArrays);
}

const testArrays: Array<ArrayTestGroup> = [
	{
		input: `<a href=https://jesseconner.ca>`,
		tests: [
			{
				function: find,
				expected: [`https://jesseconner.ca`],
			},

		],

	},
	{
		input: `<a href="https://jesseconner.ca">`,
		tests: [
			{
				function: find,
				expected: [`https://jesseconner.ca`],
			},

		],

	},
	{
		input: `<a href='https://jesseconner.ca'>`,
		tests: [
			{
				function: find,
				expected: [`https://jesseconner.ca`],
			},

		],

	},
	{
		input: `<a href=https://jesseconner.ca targe="_blank">`,
		tests: [
			{
				function: find,
				expected: [`https://jesseconner.ca`],
			},

		],

	},
	{
		input: `<a href=https://jesseconner.ca targe="_blank"><link rel="stylesheet" href="styles/style.css"><a href='#'>Blah</a>`,
		tests: [
			{
				function: find,
				expected: [`https://jesseconner.ca`,`styles/style.css`,`#`],
			},

		],

	},
]

export default {
	find,
	runTests,
}
