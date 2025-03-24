// import { useRouter } from "next/router";
import { useRouter } from "next/compat/router";
import pino, { Logger } from "pino";

import { niceLoggingPinoOptions } from "./nice-logging";

export const logger = pino(niceLoggingPinoOptions);

/**
 * React hook for using a logger within a React component (or other hook) that logs extra info to do with the current route.
 *
 * @returns A child pino logger that automatically logs extra routing info
 */
export const useLogger = (): Logger => {
	const router = useRouter();

	const pathname = router?.pathname;
	const query = router?.query;
	// 'Enrich' logs with extra request info like we do here in Guidance Web:
	// https://github.com/nice-digital/guidance-web/blob/master/Guidance.Web/RequestEnricher.cs#L19-L26
	return logger.child({
		Properties: {
			RequestPath: pathname,
			RequestQueryString: JSON.stringify(query), // Types have to match in ELK so make sure this is a string and not an object
			RequestUserAgent:
				typeof window === "undefined" ? undefined : window.navigator.userAgent,
		},
	});
};
