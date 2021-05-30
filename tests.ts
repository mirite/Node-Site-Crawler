export type TestGroup = {
	input: String,
	tests: Array<Test>,
}

export type Test = {

	function(url: String): String,
	expected: String,
}

export function runTestGroups(groups: Array<TestGroup>) {
	groups.forEach(group => runTestGroup(group));
}

function runTestGroup(testGroup: TestGroup) {
	testGroup.tests.forEach(test => {
		runTest(testGroup.input, test);
	});
}

function runTest(input: String, test: Test): void {
	const output = test.function(input);
	
	if (output === test.expected) return;
	console.log(`Failed Test: ${test.function.name}(${input}) returned ${output}. Expected: ${test.expected}`);
}