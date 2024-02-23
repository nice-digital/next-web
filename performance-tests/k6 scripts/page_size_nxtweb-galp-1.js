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
    'page_1 - http://alpha.nice.org.uk/guidance/published?ndt=Guidance&ndt=Quality%20standard&ngt=Antimicrobial%20prescribing%20guidelines&ngt=Clinical%20guidelines&ngt=Diagnostics%20guidance&ngt=Highly%20specialised%20technologies%20guidance&ngt=Social%20care%20guidelines&ps=50&',
    function () {
      response = http.get(
        'https://alpha.nice.org.uk/guidance/published?ndt=Guidance&ndt=Quality+standard&ngt=Antimicrobial+prescribing+guidelines&ngt=Clinical+guidelines&ngt=Diagnostics+guidance&ngt=Highly+specialised+technologies+guidance&ngt=Social+care+guidelines&ps=50&ndt=Quality+standard&ngt=Clinical+guidelines&ngt=Diagnostics+guidance&ngt=Highly+specialised+technologies+guidance&ngt=Social+care+guidelines',
        {
          headers: {
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      sleep(1.9)
    }
  )

  // group(
  //   'page_2 - http://alpha.nice.org.uk/guidance/inconsultation?ndt=Guidance&ndt=NICE%20advice&ngt=Clinical%20guidelines&ngt=Diagnostics%20guidance&ngt=Interventional%20procedures%20guidance&ngt=NICE%20guidelines&ps=50&sp=on',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/inconsultation?ndt=Guidance&ndt=NICE+advice&ngt=Clinical+guidelines&ngt=Diagnostics+guidance&ngt=Interventional+procedures+guidance&ngt=NICE+guidelines&ps=50&sp=on&ndt=NICE+advice&ngt=Diagnostics+guidance&ngt=Interventional+procedures+guidance&ngt=NICE+guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //     sleep(1.2)
  //   }
  // )

  // group(
  //   'page_3 - http://alpha.nice.org.uk/guidance/indevelopment?ngt=Interventional%20procedures%20guidance&ngt=Social%20care%20guidelines&pa=4&ps=25&sp=on',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/indevelopment?ngt=Interventional+procedures+guidance&ngt=Social+care+guidelines&pa=4&ps=25&sp=on&ngt=Social+care+guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //     sleep(1.3)
  //   }
  // )

  // group(
  //   'page_4 - https://alpha.nice.org.uk/guidance/indevelopment?ndt=Guidance&ngt=Safe%20staffing%20guidelines',
  //   function () {
  //     response = http.get(
  //       'https://alpha.nice.org.uk/guidance/indevelopment?ndt=Guidance&ngt=Safe%20staffing%20guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //           'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //           'sec-ch-ua-mobile': '?0',
  //           'sec-ch-ua-platform': '"Windows"',
  //         },
  //       }
  //     )
  //     sleep(1.4)
  //   }
  // )

  // group(
  //   'page_5 - http://alpha.nice.org.uk/guidance/proposed?ngt=NICE%20guidelines&ps=50&s=DateAsc',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/proposed?ngt=NICE%20guidelines&ps=50&s=DateAsc',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //     sleep(1.9)
  //   }
  // )

  // group(
  //   'page_6 - http://alpha.nice.org.uk/guidance/awaiting-development?ndt=Guidance&ngt=Clinical%20guidelines&ngt=Diagnostics%20guidance&ngt=Public%20health%20guidelines&ngt=Technology%20appraisal%20guidance&pa=7&sp=on',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/awaiting-development?ndt=Guidance&ngt=Clinical+guidelines&ngt=Diagnostics+guidance&ngt=Public+health+guidelines&ngt=Technology+appraisal+guidance&pa=7&sp=on&ngt=Diagnostics+guidance&ngt=Public+health+guidelines&ngt=Technology+appraisal+guidance',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //     sleep(3.2)
  //   }
  // )

  // group(
  //   'page_7 - http://alpha.nice.org.uk/guidance/topic-selection?ps=9999&s=DateAsc',
  //   function () {
  //     response = http.get('http://alpha.nice.org.uk/guidance/topic-selection?ps=9999&s=DateAsc', {
  //       headers: {
  //         'upgrade-insecure-requests': '1',
  //       },
  //     })
  //   }
  // )
}
