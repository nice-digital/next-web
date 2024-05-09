import { sleep, check } from "k6";
import { SharedArray } from "k6/data";
import http from "k6/http";


// export const options = {
// 	stages: [
// 		{ duration: "5m", target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
// 		{ duration: "20m", target: 100 }, // stay at 100 users for 20 minutes
// 		{ duration: "5m", target: 0 }, // ramp-down to 0 users
// 	],
// 	thresholds: {
// 		"http_req_duration{status:200}": ["p(99)<1500"], // 99% of requests must complete below 1500ms
// 		"http_req_duration{expected_response:true}": ["p(99)<1500"], // 99% of requests must complete below 1500ms
// 		iteration_duration: ["p(95)<1500"], // 95% of requests must complete below 1500ms
// 		http_req_waiting: ["p(99)<1000"], // 99% of requests must complete below 1s
// 	},
// };

// export const options = {
//   stages: [
//     { duration: '1m', target: 100 }, // below normal load
//     { duration: '2m', target: 100 },
//     { duration: '3m', target: 200 }, // normal load
//     { duration: '3m30s', target: 200 },
//     { duration: '4m30s', target: 300 }, // around the breaking point
//     { duration: '6m', target: 300 },
//     { duration: '4m', target: 400 }, // beyond the breaking point
//     { duration: '3m', target: 400 },
//     { duration: '3m', target: 0 }, // scale down. Recovery stage.
//   ],
//   thresholds: {
//     'http_req_duration{status:200}': ['p(90)<1500'], // 99% of requests must complete below 1500ms
//     'iteration_duration': ['p(95)<1500'], // 95% of requests must complete below 1500ms
//     'http_req_waiting': ['p(90)<1000'], // 90% of requests must complete below 1s
//   },
// };

const searchTerms = new SharedArray("terms", function () {
	const t = JSON.parse(open("./combined_paths.json"));
	return t;
});

let params = {
	timeout: "120s",
	headers: {
		"cache-control": "no-cache",
	},
};

export default function () {
	const urlpath = searchTerms[Math.floor(Math.random() * searchTerms.length)];
	const res = http.get("https://alpha.nice.org.uk" + encodeURI(urlpath), params);
	// check(res, {
		// "status is 200": (r) => r.status === 200,

		// console.log(urlpath);

		// sleep(Math.random() * 2);

		// for (const p in res.headers) {
		// 	if (res.headers.hasOwnProperty(p)) {
		// 		console.log(p + " : " + res.headers[p]);
		// 	}
		// }

		// console.log("\n\n\n\n");

		// console.log(res.body + "\n\n\n\n");
	// });
}
