import needle from "needle";

import { serverRuntimeConfig, publicRuntimeConfig } from "@/config";

import type { FormID, GetFormResponse } from "./types";

export * from "./types";

// Handle the case where server config might be empty during Next.js 15 migration
const apiKey =
	(serverRuntimeConfig as any).feeds?.jotForm?.apiKey ||
	process.env.JOTFORM_API_KEY ||
	"SECRET";
const baseURL =
	(publicRuntimeConfig as any).jotForm?.baseURL || "https://nice.jotform.com";

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
