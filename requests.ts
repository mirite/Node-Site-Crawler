const axios = require('axios').default;

type Request = {
	target: string,
	source: string,
	responseCode: number,
	body: string,
}

async function getPage(request:Request): Promise<Request> {

	try {
		const response = await axios.get(request.target);
		request.body = response.data;
		request.responseCode = response.status;
		
		return request;
	} catch (err) {
		console.log(err);
		return request;
	}

}
export default {Request, getPage}