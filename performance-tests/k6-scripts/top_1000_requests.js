import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

const searchTerms = new SharedArray("terms", function () {
	const t = JSON.parse(open("./combined_paths.json"));
	return t;
});

let params = {
	timeout: "120s",
	headers: {
		"Content-Type": "application/json",
		"cache-control": "no-cache",
	},
};

export default function () {
	const urlpath = searchTerms[Math.floor(Math.random() * searchTerms.length)];
	const res = http.get("https://alpha.nice.org.uk" + urlpath, params);
	// console.log(urlpath);

	// sleep(Math.random() * 2);

	// for (const p in res.headers) {
	// 	if (res.headers.hasOwnProperty(p)) {
	// 		console.log(p + " : " + res.headers[p]);
	// 	}
	// }

	// console.log("\n\n\n\n");

	// console.log(res.body + "\n\n\n\n");
}
