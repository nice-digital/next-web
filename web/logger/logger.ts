import pino from "pino";

export const logger = pino({
	//prettyPrint: { colorize: true },
});

// import pinoms from "pino-multi-stream";
// import { getTransport } from "pino-mq";

// const streams = [
// 	//{ stream: fs.createWriteStream("/tmp/info.stream.out") },
// 	//{ level: "fatal", stream: fs.createWriteStream("/tmp/fatal.stream.out") },
// 	{ stream: getTransport() },
// ];

// export const logger = pinoms();
