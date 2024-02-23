import http from "k6/http";
import { SharedArray } from "k6/data";
import { sleep } from "k6";

const jotForms = new SharedArray("forms", function () {
  const t = JSON.parse(open("./jotforms_page.json"));
  return t;
});

let params = {
  timeout: "120s",
};

export default function () {
  const jotForm = jotForms[Math.floor(Math.random() * jotForms.length)];

  http.get("https://alpha.nice.org.uk" + jotForm, params);
//   console.log(searchTerm); //This can slow the number of requests per second - only use for debugging
//   sleep(Math.random() * 0.25);
}



