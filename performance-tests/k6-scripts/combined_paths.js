import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";


export const options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1500ms
    'iteration_duration': ['p(95)<1500'], // 95% of requests must complete below 1500ms
    'http_req_waiting': ['p(99)<1000'], // 99% of requests must complete below 120ms   
  },
};
const mixmatchPages = new SharedArray("pages", function () {
  const t = JSON.parse(open("./combined_paths.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const mixmatchPage = mixmatchPages[Math.floor(Math.random() * mixmatchPages.length)];

 // http.get("https://alpha.nice.org.uk", {noConnectionReuse: true} + mixmatchPage, params);
  http.get("https://alpha.nice.org.uk" + mixmatchPage, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
  sleep(Math.random() * 0.25);
}
