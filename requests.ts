const axios = require('axios').default;

type PageResponse = {
  body: string,
  code: number,
  isError: boolean,
}

function isErrorCode(code:number):boolean {
  return code > 399 && code !== 999;
}

export default async function (url: string) : Promise<PageResponse> {
  const response = await axios.get(url);
  const pageResponse = {
    body: response.data,
    code: response.status,
    isError: isErrorCode(response.status),
  };

  return pageResponse;
}
