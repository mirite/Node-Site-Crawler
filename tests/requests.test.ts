import request from '../requests';

test('intentional404.php returns status code 404', async () => {
  const response = await (request('https://github.com/intentional404'));
  expect(response.code).toBe(404);
});
