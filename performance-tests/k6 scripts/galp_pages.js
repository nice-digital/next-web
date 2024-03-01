import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 1 minute.
    { duration: '8m', target: 200 }, // stay at 100 users for 3 minutes
    { duration: '2m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<2500'], // 99% of requests must complete below 120ms
    'iteration_duration': ['p(95)<1500'], // 95% of requests must complete below 150ms
    'http_req_waiting': ['p(99)<1500'], // 99% of requests must complete below 120ms   
  },
};

const galpPages = new SharedArray("listPages", function () {
  const t = JSON.parse(open("./galp_pages.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const galpPage = galpPages[Math.floor(Math.random() * galpPages.length)];

  http.get("https://alpha.nice.org.uk" + galpPage, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
   sleep(Math.random() * 0.25);
}