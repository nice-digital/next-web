// Creator: k6 Browser Recorder 0.6.2

import { sleep, group } from 'k6'
import http from 'k6/http'

//export const options = { vus: 10, duration: '5m' }
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

export default function main() {
  let response 

  group('page_1 - search', function () {
    response = http.get('https://alpha.nice.org.uk/search?q=&s=date', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    //sleep(8.2)
  })

  group('page_2 - homepage', function () {
    response = http.get('https://alpha.nice.org.uk/guidance/published?ndt=Guidance&ndt=Quality%20standard', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(3.2)
  })

  group('page_3 - select a guidance programme', function () {
    response = http.get('https://alpha.nice.org.uk/guidance/published?ndt=Guidance&ndt=Quality+standard&ngt=NICE+guidelines', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(3.2)
  })  

  group('page_4 - test dates', function () {
    response = http.get('https://alpha.nice.org.uk/guidance/date', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(3.3)
    response = http.get(
      'https://alpha.nice.org.uk/guidance/published?from=2022-11-01&to=2022-11-30',
      {
        headers: {
          'upgrade-insecure-requests': '1',
          'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    sleep(2.6)
    response = http.get(
      'https://alpha.nice.org.uk/guidance/published?from=2022-12-01&to=2023-01-27&ndt=Guidance&ngt=Technology+appraisal+guidance',
      {
        headers: {
          'upgrade-insecure-requests': '1',
          'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    sleep(0.6)
  })
}