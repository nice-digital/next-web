// Creator: k6 Browser Recorder 0.6.2

import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = { vus: 10, duration: '5m' }

export default function main() {
  let response

  group('page_1 - https://alpha.nice.org.uk/guidance/published', function () {
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/inconsultation.json',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
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
    sleep(3)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/indevelopment.json',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(1.8)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.3)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/awaiting-development.json',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(2.1)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.4)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/topic-selection.json',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(4.2)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.6)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.6)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=9999',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(2)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(11.1)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=2500&from=2024-01-01&to=2024-02-13',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(11)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=2500&from=2024-01-01&to=2024-02-13&s=Title',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(7.1)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=9999&from=2024-01-01&to=2024-02-13&s=Title',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(7.2)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=9999&s=Title&sp=on',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(1.9)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(5.9)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=2500&s=Title&nai=Antimicrobial+prescribing',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(8.8)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/guidance/published.json?ps=2500&s=Title&q=skin&nai=Antimicrobial+prescribing',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(0.8)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(8.2)
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=ski', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(1.7)
    response = http.get('https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin%20u',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin%20ul',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin%20ulc',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin%20ulcer',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
  })

  group('page_2 - https://alpha.nice.org.uk/search?q=skin%20ulcer', function () {
    response = http.get('https://alpha.nice.org.uk/search?q=skin%20ulcer', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(0.8)
    response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/1294c78852c53750.css', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6124-28df85bf86c7fe4f.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/5140-dd3d9d007ad122c7.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/4782-d24ff723a90b70d2.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/search-5be9ccab7d1a45f5.js',
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
    response = http.get(
      'https://alpha-search-api.nice.org.uk/api/typeahead?index=nice&q=skin%20ulcer',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://accounts.nice.org.uk/tophat?9023656275', {
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
    sleep(3.2)
    response = http.get('https://alpha.nice.org.uk/_next/static/css/1294c78852c53750.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/search.json?q=skin+ulcer&s=date',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(0.9)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.9)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/search.json?s=date&q=skin+ulcer&ndt=Quality+standards',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(6.6)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/search.json?q=skin+ulcer&ndt=Quality+standards',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(0.7)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(1.7)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/search.json?ps=15&q=skin+ulcer&sp=on',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(0.7)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(8.1)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/search.json?ps=15&q=skin+ulcer&sp=on&pa=5',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
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
    sleep(14.7)
  })

  group('page_3 - https://alpha.nice.org.uk/indicators/published', function () {
    response = http.get('https://alpha.nice.org.uk/indicators/published', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/19915850fa04a948.css', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6124-28df85bf86c7fe4f.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/5140-dd3d9d007ad122c7.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6482-97daf78b3b0774cc.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/4782-d24ff723a90b70d2.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/543-b9b624e9ccc6a1b7.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/published-5ca7af05df7c5a4f.js',
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
    response = http.get('https://accounts.nice.org.uk/tophat?9238770403', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/inconsultation-0b65f009b6c7646c.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment-f27884d21879bb98.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/7941-8f42c4b33dc3c1e8.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/%5Bslug%5D-c8a14db2fc832c2e.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/css/19915850fa04a948.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/7941-8f42c4b33dc3c1e8.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/%5Bslug%5D-c8a14db2fc832c2e.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/css/23090208c7c55d65.css', {
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
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment-f27884d21879bb98.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/inconsultation-0b65f009b6c7646c.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    sleep(3.4)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/published.json?ps=9999',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    sleep(0.9)
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(4.2)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/inconsultation.json?ps=9999',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D/consultations/%5BresourceTitleId%5D-b29319c04521bc70.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D/consultations/%5BresourceTitleId%5D-b29319c04521bc70.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/css/208f1afd8fa7413f.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(3.8)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/indevelopment.json?ps=9999',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D-bc24c7a80b01ffa4.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D-bc24c7a80b01ffa4.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/css/347a6ab2d3a024c2.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(4.3)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/indevelopment.json?ps=2500&rty=Clinical+commissioning+group+indicators',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(6.9)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/indevelopment.json?ps=2500&q=text&rty=Clinical+commissioning+group+indicators',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(2.4)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/published.json?ps=2500&q=text&rty=Clinical+commissioning+group+indicators',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(6.5)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/published.json?ps=2500&q=text&sp=on',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(1.6)
    response = http.get(
      'https://alpha.nice.org.uk/_next/data/Qrnd7RWy8tJ-BqcXnK7DJ/indicators/published.json?ps=2500',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'x-nextjs-data': '1',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(13.5)
  })

  group('page_4 - https://alpha.nice.org.uk/hub/indevelopment', function () {
    response = http.get('https://alpha.nice.org.uk/hub/indevelopment', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/19915850fa04a948.css', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6124-28df85bf86c7fe4f.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/5140-dd3d9d007ad122c7.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6482-97daf78b3b0774cc.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/4782-d24ff723a90b70d2.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/543-b9b624e9ccc6a1b7.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/indevelopment-f4ed466ac244d025.js',
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
    response = http.get('https://accounts.nice.org.uk/tophat?8264980189', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/published-b9dc1b923805ad9a.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/inconsultation-b5303c199a3b8787.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/awaiting-development-ac5965754c1c24a9.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/topic-selection-182cd9f0e0da0d3a.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/19915850fa04a948.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/published-b9dc1b923805ad9a.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/awaiting-development-ac5965754c1c24a9.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get('https://alpha.nice.org.uk/_next/static/css/22fb2b49afe20222.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/topic-selection-182cd9f0e0da0d3a.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/guidance/inconsultation-b5303c199a3b8787.js',
      {
        headers: {
          'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      }
    )
    sleep(63.2)
  })

  group('page_5 - https://alpha.nice.org.uk/hub/indevelopment/gid-hub10002', function () {
    response = http.get('https://alpha.nice.org.uk/hub/indevelopment/gid-hub10002', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/347a6ab2d3a024c2.css', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6124-28df85bf86c7fe4f.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D-bc24c7a80b01ffa4.js',
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
    response = http.get('https://accounts.nice.org.uk/tophat?2101702399', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/347a6ab2d3a024c2.css', {
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
    response = http.get('https://alpha.nice.org.uk/next-web/favicon.ico', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    sleep(66.5)
  })

  group('page_6 - https://alpha.nice.org.uk/hub/indevelopment/gid-hub10007', function () {
    response = http.get('https://alpha.nice.org.uk/hub/indevelopment/gid-hub10007', {
      headers: {
        'upgrade-insecure-requests': '1',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/media/5b883641122c40da-s.p.woff2', {
      headers: {
        origin: 'https://alpha.nice.org.uk',
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/cd88136244088fcc.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get('https://alpha.nice.org.uk/_next/static/css/347a6ab2d3a024c2.css', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/main-049e6acab825fa27.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
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
    response = http.get('https://alpha.nice.org.uk/_next/static/chunks/6124-28df85bf86c7fe4f.js', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
    response = http.get(
      'https://alpha.nice.org.uk/_next/static/chunks/pages/indicators/indevelopment/%5Bslug%5D-bc24c7a80b01ffa4.js',
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
    response = http.get('https://accounts.nice.org.uk/tophat?2127365572', {
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
    response = http.get('https://alpha.nice.org.uk/_next/static/css/347a6ab2d3a024c2.css', {
      headers: {
        'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
    })
  })
}