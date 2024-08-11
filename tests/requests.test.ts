import request, { isErrorCode } from "../src/requests";
import { test, expect } from "vitest";

test("intentional404.php returns status code 404", async () => {
	const response = await request("https://github.com/intentional404");
	expect(response.code).toBe(404);
});

test("200 returns ! isErrorCode", () => {
	expect(isErrorCode(200)).toBe(false);
});

test("400 returns isErrorCode", () => {
	expect(isErrorCode(400)).toBe(true);
});
