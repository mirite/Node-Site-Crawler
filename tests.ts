export type TestGroup = {
	input: string,
	tests: Array<Test>,
}

export type ArrayTestGroup = {
	input: string,
	tests: Array<ArrayTest>,
}

export type ArrayTest = {

	function(url: string): Array<string|boolean>,
	expected: Array<string|boolean>,
}

export type Test = {

	function(url: string): string|boolean,
	expected: string|boolean,
}

export function runTestGroups(groups: Array<TestGroup>) {
	groups.forEach(group => runTestGroup(group));
}

export function runArrayTestGroups(groups: Array<ArrayTestGroup>) {
	groups.forEach(group => runArrayTestGroup(group));
}

function runTestGroup(testGroup: TestGroup) {
	testGroup.tests.forEach(test => {
		runTest(testGroup.input, test);
	});
}

function runArrayTestGroup(testGroup: ArrayTestGroup) {
	testGroup.tests.forEach(test => {
		runArrayTest(testGroup.input, test);
	});
}

function runTest(input: string, test: Test): void {
	const output = test.function(input);
	
	if (output === test.expected) return;
	console.log(`Failed Test: ${test.function.name}(${input}) returned ${output}. Expected: ${test.expected}`);
}

function runArrayTest(input: string, test: ArrayTest): void {
	const output = test.function(input);
	
	const unmatched = output.filter(result => !test.expected.includes(result));
	if (unmatched.length === 0) return;
	console.log(`Failed Test: ${test.function.name}(${input}) returned ${output}. Expected: ${test.expected}`);
}