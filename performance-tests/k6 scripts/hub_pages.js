import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

const hubPages = new SharedArray("pages", function () {
  const t = JSON.parse(open("./hub_page.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const hubPage = hubPages[Math.floor(Math.random() * hubPages.length)];

  http.get("https://alpha.nice.org.uk" + hubPage, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
//   sleep(Math.random() * 0.25);
}
