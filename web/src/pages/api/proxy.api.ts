// pages/api/proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const surveyUrl = "https://customervoice.microsoft.com/";

	try {

		const response = await fetch(surveyUrl, {
			headers: {
				Authorization: "efQwYEKzLUel3XQP91ON6fIhpwsw1jRDoSJZSVZYegJUMjQ3M1laSE9TVThHMzFXRFE5NkJIV1Y4Ni4u",
				Cookie: req.headers.cookie || "",
			},
		});
		// const response = await fetch(surveyUrl);
		let html = await response.text();

		// Inject custom CSS
		const customCss = `<style>
			body { font-family: Arial, sans-serif !important; }
			.survey-container { background: #f4f4f4 !important; }
		</style>`;

		// Inject into the `<head>` section
		html = html.replace("</head>", `${customCss}</head>`);

		res.setHeader("Content-Type", "text/html");
		res.send(html);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch survey content" });
	}
}
