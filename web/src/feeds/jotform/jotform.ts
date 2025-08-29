import needle from "needle";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";

import type { FormID, GetFormResponse } from "./types";

export * from "./types";

// Access config from properly loaded YAML configs
const apiKey =
	(serverRuntimeConfig as { feeds?: { jotForm?: { apiKey?: string } } }).feeds
		?.jotForm?.apiKey || "SECRET";
const baseURL =
	(publicRuntimeConfig as { jotForm?: { baseURL?: string } }).jotForm
		?.baseURL || "https://nice.jotform.com";

export const getForm = async (formID: FormID): Promise<GetFormResponse> => {
	const response = await needle(
		"get",
		`${baseURL}/API/form/${formID}?apiKey=${apiKey}`,
		{
			json: true,
		}
	);

	return response.body as GetFormResponse;
};
