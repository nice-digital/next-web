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

/** Sets the response content type */
export const withContentType = (
	response: ServerResponse,
	contentType: string
): ServerResponse => response.setHeader("Content-Type", contentType);

/** Sets the content type header on the given response to be `application/pdf` */
export const withPDFContentType = (response: ServerResponse): ServerResponse =>
	withContentType(response, "application/pdf");

/**
 * Convenience method for piping a readable file stream to a server response with a given content type
 *
 * @param fileStream The readable file stream
 * @param response The server response
 * @param contentType The content (MIME) type of the file
 */
export const pipeFile = async (
	fileStream: Readable,
	response: ServerResponse,
	contentType: string
): Promise<void> =>
	pipeline(fileStream, withContentType(response, contentType));

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

/**
 * Streams (and ends) a readable file stream to the output response, with a given content type.
 *
 * @param fileStream The readable file stream
 * @param response The server response
 * @returns Empty props
 */
export const getServerSideFile = async (
	fileStream: Readable,
	response: ServerResponse,
	contentType: string
): Promise<EmptyGetServerSidePropsResult> => {
	await pipeFile(fileStream, response, contentType);

	response.end();

	return { props: {} };
};
