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
// export const options = {
//   stages: [
//     { duration: '1m', target: 100 }, // below normal load
//     { duration: '2m', target: 100 },
//     { duration: '2m30s', target: 200 }, // normal load
//     { duration: '3m', target: 200 },
//     { duration: '2m', target: 300 }, // around the breaking point
//     { duration: '3m', target: 300 },
//     { duration: '2m', target: 400 }, // beyond the breaking point
//     { duration: '3m', target: 400 },
//     { duration: '5m', target: 0 }, // scale down. Recovery stage.
//   ],
//   thresholds: {
//     'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
//     'iteration_duration': ['p(95)<1500'], // 99% of requests must complete below 1.5s
//     'http_req_waiting': ['p(99)<1000'], // 99% of requests must complete below 1s    
//   },
// };

const jotForms = new SharedArray("forms", function () {
  const t = JSON.parse(open("./jotforms_pages.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const jotForm = jotForms[Math.floor(Math.random() * jotForms.length)];

  http.get("https://alpha.nice.org.uk" + jotForm, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
  sleep(Math.random() * 0.25);
}






