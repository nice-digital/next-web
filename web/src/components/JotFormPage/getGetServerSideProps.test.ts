import { getForm } from "@/feeds/jotform/jotform";
import { logger } from "@/logger";

import { getGetServerSideProps } from "./getGetServerSideProps";

import type { GetServerSidePropsContext } from "next";

jest.mock("@/feeds/jotform/jotform");

const getFormMock = (getForm as jest.Mock).mockResolvedValue({
	responseCode: 200,
	message: "success",
	content: {
		id: "223412731228044",
		username: "nice_teams",
		title: "NICE UK open content licence form",
		height: "539",
		status: "ENABLED",
		created_at: "2022-12-08 06:31:44",
		updated_at: "2023-03-27 05:03:55",
		last_submission: "2023-03-24 14:43:43",
		new: "34",
		count: "46",
		type: "LEGACY",
		favorite: "0",
		archived: "0",
		url: "https://nice.jotform.com/223412731228044",
	},
	duration: "14.98ms",
});

const getServerSidePropsContext = {
	resolvedUrl: "/forms/anything",
} as GetServerSidePropsContext;

describe("getGetServerSideProps", () => {
	it("should return valid props after successful API form response", async () => {
		getFormMock.mockResolvedValueOnce({
			responseCode: 200,
			message: "success",
			content: {
				status: "ENABLED",
				height: "987",
			},
			duration: "17.33ms",
		});

		await expect(
			getGetServerSideProps("1234")(getServerSidePropsContext)
		).resolves.toStrictEqual({
			props: {
				height: "987",
				formID: "1234",
			},
		});
	});

	it("should log error message and throw when the API request to JotForm fails", async () => {
		const error = new Error("Test error");
		getFormMock.mockRejectedValueOnce(error);

		expect(jest.isMockFunction(logger.error)).toBe(true);

		await expect(
			getGetServerSideProps("1234")(getServerSidePropsContext)
		).rejects.toBe(error);

		expect(logger.error).toHaveBeenCalledWith(
			"Could not get form from JotForm API with id 1234 at URL /forms/anything",
			error
		);
	});

	it("should log message and return not found when the form is not found", async () => {
		getFormMock.mockResolvedValueOnce({
			responseCode: 404,
			message: "Requested URL (/form/1234) is not available!",
			content: "",
			duration: "14.48ms",
			info: "https://api.jotform.com/docs",
		});

		expect(jest.isMockFunction(logger.info)).toBe(true);

		const result = await getGetServerSideProps("1234")(
			getServerSidePropsContext
		);

		expect(result).toStrictEqual({ notFound: true });

		expect(logger.info).toHaveBeenCalledWith(
			"Couldn't find form with id 1234 at URL /forms/anything"
		);
	});

	it("should log message and throw when the request to JotForm API is unauthorized", async () => {
		getFormMock.mockResolvedValueOnce({
			responseCode: 401,
			message: "You're not authorized to use (/form-id) ",
			content: "",
			duration: "15.15ms",
			info: "https://api.jotform.com/docs#form-id",
		});

		await expect(
			getGetServerSideProps("1234")(getServerSidePropsContext)
		).rejects.toThrow(
			"Got 401 unauthorized response for form with id 1234 at URL /forms/anything"
		);
	});

	it("should log warning message and return not found when form is disabled", async () => {
		getFormMock.mockResolvedValueOnce({
			responseCode: 200,
			message: "success",
			content: {
				status: "DISABLED",
			},
			duration: "17.33ms",
		});

		expect(jest.isMockFunction(logger.warn)).toBe(true);

		const result = await getGetServerSideProps("1234")(
			getServerSidePropsContext
		);

		expect(result).toStrictEqual({ notFound: true });

		expect(logger.warn).toHaveBeenCalledWith(
			"Form with id 1234 at URL /forms/anything is disabled"
		);
	});
});
