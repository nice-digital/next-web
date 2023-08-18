import needle from "needle";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";

import type { FormID, GetFormResponse } from "./types";

export * from "./types";

const { apiKey } = serverRuntimeConfig.feeds.jotForm,
	{ baseURL } = publicRuntimeConfig.jotForm;

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
