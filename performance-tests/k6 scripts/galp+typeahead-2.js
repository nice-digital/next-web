import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {
    // stages: [
    //   { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    //   { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    //   { duration: '5m', target: 0 }, // ramp-down to 0 users
    // ],
    // thresholds: {
    //   'http_req_duration': ['p(99)<120'], // 99% of requests must complete below 120ms
    //   'iteration_duration': ['p(95)<150'], // 95% of requests must complete below 150ms
    //   'http_req_waiting': ['p(99)<120'], // 99% of requests must complete below 120ms   
    // },
  //};
  // export const options = {
    stages: [
      { duration: '1m', target: 10 }, // below normal load
      { duration: '2m', target: 10 },
      { duration: '2m30s', target: 20 }, // normal load
      { duration: '3m', target: 20 },
      { duration: '2m', target: 30 }, // around the breaking point
      { duration: '3m', target: 30 },
      { duration: '2m', target: 40 }, // beyond the breaking point
      { duration: '3m', target: 40 },
      { duration: '5m', target: 0 }, // scale down. Recovery stage.
    ],
    thresholds: {
      'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
      'iteration_duration': ['p(95)<1500'], // 99% of requests must complete below 1.5s
      'http_req_waiting': ['p(99)<1000'], // 99% of requests must complete below 1s    
    },
  };
  
  // export const options = {
  //   ext: {
  //     loadimpact:{
  //       project: 3622495,
  //       name: "top100Search"
  //     }
  //   }
  // };

export default function scenario_1() {
  let response

  group('page_1 - https://alpha.nice.org.uk/guidance/published', function () {
    response = http.get('https://alpha.nice.org.uk/guidance/published', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    // sleep(12.2)
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=hyp', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=hype', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=hyper', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    // sleep(0.9)
  })

  group('page_2 - https://alpha.nice.org.uk/search?q=hyper', function () {
    response = http.get('https://alpha.nice.org.uk/search?q=hyper', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    // sleep(2.5)
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=hyper', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
  })
}
