const axios = require('axios').default;

type PageResponse = {
  body: string,
  code: number,
  isError: boolean,
}

export function isErrorCode(code:number):boolean {
  return code > 399 && code !== 999;
}

export default async function request(url: string): Promise<PageResponse> {
  let pageResponse;

  try {
    const response = await axios.get(url);
    pageResponse = {
      body: response.data,
      code: response.status,
      isError: isErrorCode(response.status),
    };
  } catch (err) {
    pageResponse = {
      body: '',
      code: 0,
      isError: true,
    };
  }

  return pageResponse;
}
