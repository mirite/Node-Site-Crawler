type TestGroup = {
	input: String,
	tests: Array<Test>,
}

type Test = {

	function(url: String): String,
	expected: String,
}

function findProtocol(url: String): String {
	if (!url.includes("//")) return ``;
	if (url.indexOf("//") === 0) return `https`;
	if (!url.includes("://")) return ``;
	return url.substring(0, url.indexOf(`://`));
}

function runTestGroups(groups: Array<TestGroup>) {
	groups.forEach(group => runTestGroup(group));
}

function runTestGroup(testGroup: TestGroup) {
	testGroup.tests.forEach(test => {
		runTest(testGroup.input, test);
	});
}

function runTest(input: String, test: Test): boolean {
	const output = test.function(input);
	console.log(`${test.function.name}(${input}) returned ${output}`);
	return output === test.expected;
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

runTestGroups(testStrings);
