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
    { duration: '1m', target: 100 }, // below normal load
    { duration: '2m', target: 100 },
    { duration: '2m30s', target: 200 }, // normal load
    { duration: '3m', target: 200 },
    { duration: '2m', target: 300 }, // around the breaking point
    { duration: '3m', target: 300 },
    { duration: '2m', target: 400 }, // beyond the breaking point
    { duration: '3m', target: 400 },
    { duration: '5m', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    'http_req_duration': ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'iteration_duration': ['p(95)<1500'], // 99% of requests must complete below 1.5s
    'http_req_waiting': ['p(99)<1000'], // 99% of requests must complete below 1s    
  },
};

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
      response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/_next/static/css/880448627b6eb47f.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/webpack-cefddfb7403e4fd5.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/framework-ce84985cd166733a.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/_app-56f0982eb3cf1e42.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/forms/subscribe-to-nice-news-for-health-and-social-care-fd623251a8923aee.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_buildManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_ssgManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://accounts.nice.org.uk/tophat?7230332392', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/next-web/icons/icon-32x32.png', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      sleep(8.9)
    }
  )

  group(
    'page_2 - http://alpha.nice.org.uk/forms/interventional-procedures-register-an-interest',
    function () {
      response = http.get(
        'http://alpha.nice.org.uk/forms/interventional-procedures-register-an-interest',
        {
          headers: {
            'upgrade-insecure-requests': '1',
          },
        }
      )
      response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/_next/static/css/880448627b6eb47f.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/webpack-cefddfb7403e4fd5.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/framework-ce84985cd166733a.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/_app-56f0982eb3cf1e42.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/forms/interventional-procedures-register-an-interest-c7f1b7d26ade7e3a.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_buildManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_ssgManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://accounts.nice.org.uk/tophat?7146907054', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      sleep(44.9)
    }
  )

  group(
    'page_3 - http://alpha.nice.org.uk/forms/interventional-procedures-register-an-interest?p=ipg149&returnurl=/guidance/ipg149/chapter/4-about-this-guidance&t=0',
    function () {
      response = http.get(
        'http://alpha.nice.org.uk/forms/interventional-procedures-register-an-interest?p=ipg149&returnurl=/guidance/ipg149/chapter/4-about-this-guidance&t=0',
        {
          headers: {
            'upgrade-insecure-requests': '1',
          },
        }
      )
      response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2',
        {
          headers: {
            origin: 'https://alpha.nice.org.uk',
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/_next/static/css/880448627b6eb47f.css', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/webpack-cefddfb7403e4fd5.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/framework-ce84985cd166733a.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/_app-56f0982eb3cf1e42.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/chunks/pages/forms/interventional-procedures-register-an-interest-c7f1b7d26ade7e3a.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_buildManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get(
        'https://alpha.nice.org.uk/_next/static/Qrnd7RWy8tJ-BqcXnK7DJ/_ssgManifest.js',
        {
          headers: {
            'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
        }
      )
      response = http.get('https://accounts.nice.org.uk/tophat?9585423395', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
      response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      })
    }
  )
}
