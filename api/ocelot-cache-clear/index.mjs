/* global fetch */

const basicErrorResponse = {
	statusCode: 500,
	body: "Error clearing cache, Check logs for more detail.",
};

export const handler = async (event) => {
	console.info("Cache clear triggered.");

	let tokenResponse;

	try {
		const params = new URLSearchParams({
			grant_type: "client_credentials",
			client_id: process.env.client_id,
			client_secret: process.env.client_secret,
			scope: process.env.scope,
		});

		tokenResponse = await fetch(process.env.token_url, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});
	} catch (error) {
		console.error(
			`Cache clear failed. Error with token API Call - ${error.message}.`
		);
		return basicErrorResponse;
	}

	if (tokenResponse.status == 200) {
		let tokenResponseBody = await tokenResponse.json();
		let dataResponse;

		try {
			dataResponse = await fetch(process.env.cache_clear_url, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${tokenResponseBody.access_token}`,
				},
			});
		} catch (error) {
			console.error(
				`Cache clear failed. Error with ocelot delete call - ${error.message}.`
			);
			return basicErrorResponse;
		}

		if (dataResponse.status !== 204) {
			console.error(
				`Error clearing cache, Unexpected HTTP Status Received : HTTPCode - ${dataResponse.status} | Status - ${dataResponse.statusText}`
			);
			return basicErrorResponse;
		} else {
			const response = {
				statusCode: 200,
				body: "Cache cleared successfully",
			};
			return response;
		}
	} else {
		console.error(
			`Error getting token, Unexpected HTTP Status Received : HTTPCode - ${tokenResponse.status} | Status - ${tokenResponse.statusText}`
		);
		return basicErrorResponse;
	}
};
