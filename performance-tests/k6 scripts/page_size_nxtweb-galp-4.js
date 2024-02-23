import { sleep, group } from 'k6'
import http from 'k6/http'
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// export const options = {
//   stages: [
//     { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
//     { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
//     { duration: '5m', target: 0 }, // ramp-down to 0 users
//   ],
//   thresholds: {
//     'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
//     'iteration_duration': ['p(95)<1500'], // 99% of requests must complete below 1.5s
//     'http_req_waiting': ['p(99)<1000'], // 99% of requests must complete below 1s    
//   },
// };

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

// const customCounter = new Counter("custom_trend");
// const customGauge = new Gauge("custom_gauge");
// const customRate = new Rate("custom_rate");
// const customTrend = new Trend("custom_trend");

// export const options = {
//   ext: {
//     loadimpact:{
//       project: 3622495,
//       name: "GALP10"
//     }
//   }
// };

//export const options = { vus: 2, duration: '1m' }

export default function main() {
  let response

  group(
    'page_1 - Published Guidance and QS',
    function () {
      response = http.get(
        'https://alpha-search-api.nice.org.uk/api/search?om=[{%22gst%22:[%22Published%22]},{%22ndt%22:[%22Guidance%22]},{%22ndt%22:[%22Quality%20standard%22]}]&sp=on&index=guidance',
        {
          headers: {
            dnt: '1',
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
          timeout: '120s'
        }
      )
    }
  )

  sleep(Math.random() * 2);
}

