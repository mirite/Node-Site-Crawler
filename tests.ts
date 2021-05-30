export type TestGroup = {
	input: string,
	tests: Array<Test>,
}

export type Test = {

	function(url: string): string|boolean,
	expected: string|boolean,
}

export function runTestGroups(groups: Array<TestGroup>) {
	groups.forEach(group => runTestGroup(group));
}

function runTestGroup(testGroup: TestGroup) {
	testGroup.tests.forEach(test => {
		runTest(testGroup.input, test);
	});
}

function runTest(input: string, test: Test): void {
	const output = test.function(input);
	
	if (output === test.expected) return;
	console.log(`Failed Test: ${test.function.name}(${input}) returned ${output}. Expected: ${test.expected}`);
}