import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

const searchTerms = new SharedArray("terms", function () {
  const t = JSON.parse(open("./top_1000_nice_index_typeahead_terms.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

  http.get("https://alpha-search-api.nice.org.uk" + searchTerm, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
//   sleep(Math.random() * 0.25);
}

