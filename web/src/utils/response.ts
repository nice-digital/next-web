import { type ServerResponse } from "http";
import { pipeline as callbackPipeline, type Readable } from "stream";
import { promisify } from "util";

/**
 * A type respresenting empty props to be returned from getServerSideProps.
 * Useful when a 'page' uses the raw response to serve content.
 */
export type EmptyGetServerSidePropsResult = { props: Record<string, never> };

/** A promise based stream pipeline */
export const pipeline = promisify(callbackPipeline);

/** Sets the content type header on the given response to be `application/pdf` */
export const withPDFContentType = (
	response: ServerResponse
): ServerResponse => {
	response.setHeader("Content-Type", "application/pdf");
	return response;
};

/**
 * Convenience method for piping a readable PDF stream to a server response
 *
 * @param pdfStream The readable PDF stream
 * @param response The server response
 */
export const pipePDF = async (
	pdfStream: Readable,
	response: ServerResponse
): Promise<void> => pipeline(pdfStream, withPDFContentType(response));

/**
 * Streams (and ends) a readable PDF stream to the output response.
 *
 * @param pdfStream The readable PDF stream
 * @param response The server response
 * @returns Empty props
 */
export const getServerSidePDF = async (
	pdfStream: Readable,
	response: ServerResponse
): Promise<EmptyGetServerSidePropsResult> => {
	await pipePDF(pdfStream, response);

	response.end();

	return { props: {} };
};
