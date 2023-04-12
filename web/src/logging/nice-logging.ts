import { LoggerOptions } from "pino";
import { serializeError } from "serialize-error";

import { publicRuntimeConfig } from "@/config";

const errorSerializer = (error: Error): unknown =>
	process.env.NODE_ENV === "production"
		? // Nice logging requires exception to be a string
		  JSON.stringify(serializeError(error), null, 2)
		: // But locally for development we don't want the extra quotes
		  serializeError(error);

/**
 * NICE logging requires log events to be in a specific format. Generally that means capitalized properties with specific names
 * e.g. Message not message, or Timestamp rather than time.
 * See MAS for a similar formatting setup using log4js instead of Pino:
 * https://github.com/nice-digital/MAS/blob/c92d8931c197d4bff31b351d1df3074d847aee27/cms/logging/utils.js#L39-L56
 */
export const niceLoggingPinoOptions: LoggerOptions = {
	// Only log warnings and above in production
	level: process.env.NODE_ENV === "production" ? "warn" : "debug",
	messageKey: "Message",
	// The preceeding comma here looks a bit weird, but pino requires "a partial JSON string representation of the time"
	// See https://getpino.io/#/docs/api?id=timestamp-boolean-function
	timestamp: () => `,"Timestamp":"${new Date(Date.now()).toISOString()}"`,
	mixin: () => ({
		NodeEnv: process.env.NODE_ENV,
		Application: "Next Web",
		Environment: publicRuntimeConfig.environment,
		"Properties.NodeVersion": process.version,
		"Properties.version": publicRuntimeConfig.buildNumber,
	}),
	formatters: {
		level(label, _number) {
			return {
				// Make sure Level is a string like 'Warn' or 'Error'
				Level: label[0].toUpperCase() + label.slice(1).toLowerCase(),
			};
		},
		bindings(bindings) {
			return { ProcessId: bindings.pid, MachineName: bindings.hostname };
		},
	},
	hooks: {
		logMethod(inputArgs, method, _level) {
			// Make sure any errors are logged with an correct key so they can be properly serialized
			const mappedArgs = inputArgs.map((arg) =>
				arg instanceof Error
					? {
							// Capital e for exception for NICE logging
							Exception: arg,
					  }
					: arg
			);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return method.apply(this, mappedArgs as [ms: string, args: any[]]);
		},
	},
	serializers: {
		Exception: errorSerializer,
	},
};
