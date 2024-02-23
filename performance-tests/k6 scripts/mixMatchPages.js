import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

const mixmatchPages = new SharedArray("pages", function () {
  const t = JSON.parse(open("./mixMatchPages.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const mixmatchPage = mixmatchPages[Math.floor(Math.random() * mixmatchPages.length)];

  http.get("https://alpha.nice.org.uk" + mixmatchPage, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
//   sleep(Math.random() * 0.25);
}
