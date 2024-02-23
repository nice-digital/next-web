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
    'page_1 - https://alpha.nice.org.uk/guidance/published?ndt=Guidance&pa=6&sp=on',
    function () {
      response = http.get('https://alpha.nice.org.uk/guidance/published?ndt=Guidance&pa=6&sp=on', {
        headers: {
          'upgrade-insecure-requests': '1',
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      sleep(11.9)
    }
  )

  // group('page_2 - https://alpha.nice.org.uk/guidance/published?pa=2&ps=25', function () {
  //   response = http.get('https://alpha.nice.org.uk/guidance/published?pa=2&ps=25', {
  //     headers: {
  //       'upgrade-insecure-requests': '1',
  //       'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //       'sec-ch-ua-mobile': '?0',
  //       'sec-ch-ua-platform': '"Windows"',
  //     },
  //   })
  //   sleep(13.7)
  // })

  // group(
  //   'page_3 - https://alpha.nice.org.uk/guidance/published?ndt=Guidance&ngt=Public+health+guidelines',
  //   function () {
  //     response = http.get(
  //       'https://alpha.nice.org.uk/guidance/published?ndt=Guidance&ngt=Public+health+guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //           'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //           'sec-ch-ua-mobile': '?0',
  //           'sec-ch-ua-platform': '"Windows"',
  //         },
  //       }
  //     )
  //     sleep(11.5)
  //   }
  // )

  // group('page_4 - https://alpha.nice.org.uk/guidance/inconsultation?type=hst,ta', function () {
  //   response = http.get('https://alpha.nice.org.uk/guidance/inconsultation?type=hst,ta', {
  //     headers: {
  //       'upgrade-insecure-requests': '1',
  //       'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //       'sec-ch-ua-mobile': '?0',
  //       'sec-ch-ua-platform': '"Windows"',
  //     },
  //   })
  //   sleep(11.6)
  // })

  // group('page_5 - https://alpha.nice.org.uk/guidance/indevelopment', function () {
  //   response = http.get('https://alpha.nice.org.uk/guidance/indevelopment', {
  //     headers: {
  //       'upgrade-insecure-requests': '1',
  //       'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //       'sec-ch-ua-mobile': '?0',
  //       'sec-ch-ua-platform': '"Windows"',
  //     },
  //   })
  //   sleep(11.6)
  // })

  // group('page_6 - https://alpha.nice.org.uk/guidance/proposed', function () {
  //   response = http.get('https://alpha.nice.org.uk/guidance/proposed', {
  //     headers: {
  //       'upgrade-insecure-requests': '1',
  //       'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  //       'sec-ch-ua-mobile': '?0',
  //       'sec-ch-ua-platform': '"Windows"',
  //     },
  //   })
  //   sleep(13.5)
  // })

  // group(
  //   'page_7 - http://alpha.nice.org.uk/guidance/awaiting-development?ndt=Guidance&ndt=Quality%20standard&ngt=Cancer%20service%20guidelines&ngt=Clinical%20guidelines&ngt=Public%20health%20guidelines&ngt=Safe%20staffing%20guidelines&ngt=Social%20care%20guidelines&pa=2&ps=25&sp=on',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/awaiting-development?ndt=Guidance&ndt=Quality+standard&ngt=Cancer+service+guidelines&ngt=Clinical+guidelines&ngt=Public+health+guidelines&ngt=Safe+staffing+guidelines&ngt=Social+care+guidelines&pa=2&ps=25&sp=on&ndt=Quality+standard&ngt=Clinical+guidelines&ngt=Public+health+guidelines&ngt=Safe+staffing+guidelines&ngt=Social+care+guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //     sleep(15.8)
  //   }
  // )

  // group(
  //   'page_8 - http://alpha.nice.org.uk/guidance/topic-selection?ndt=Guidance&ngt=Antimicrobial%20prescribing%20guidelines&ngt=Clinical%20guidelines&ngt=Medical%20technologies%20guidance&ngt=Medicines%20practice%20guidelines&ngt=Public%20health%20guidelines&sp=on',
  //   function () {
  //     response = http.get(
  //       'http://alpha.nice.org.uk/guidance/topic-selection?ndt=Guidance&ngt=Antimicrobial+prescribing+guidelines&ngt=Clinical+guidelines&ngt=Medical+technologies+guidance&ngt=Medicines+practice+guidelines&ngt=Public+health+guidelines&sp=on&ngt=Clinical+guidelines&ngt=Medical+technologies+guidance&ngt=Medicines+practice+guidelines&ngt=Public+health+guidelines',
  //       {
  //         headers: {
  //           'upgrade-insecure-requests': '1',
  //         },
  //       }
  //     )
  //   }
  // )
}
