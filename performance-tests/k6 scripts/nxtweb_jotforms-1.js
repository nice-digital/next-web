import { sleep, group } from 'k6'
import http from 'k6/http'

// export const options = {
//   stages: [
//     { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
//     { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
//     { duration: '5m', target: 0 }, // ramp-down to 0 users
//   ],
//   thresholds: {
//     'http_req_duration': ['p(99)<120'], // 99% of requests must complete below 120ms
//     'iteration_duration': ['p(95)<150'], // 95% of requests must complete below 150ms
//     'http_req_waiting': ['p(99)<120'], // 99% of requests must complete below 120ms   
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

export default function scenario_1() {
  let response

  group(
    'page_1 - http://alpha.nice.org.uk/forms/subscribe-to-nice-news-for-health-and-social-care',
    function () {
      response = http.get(
        'https://alpha.nice.org.uk/forms/subscribe-to-nice-news-for-health-and-social-care',
        {
          headers: {
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )      
    }
  )   
}
