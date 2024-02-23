import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = { vus: 2, duration: '1m' }

export default function main() {
  let response

  group(
    'page_1 - https://alpha-search-api.nice.org.uk/api/search?om=[%7B%22gst%22:[%22Published%22]%7D,%7B%22ndt%22:[%22Guidance%22]%7D,%7B%22ndt%22:[%22Quality%20standard%22]%7D]&sp=on&index=guidance&q=&ps=1000',
    function () {
      response = http.get(
        'https://alpha-search-api.nice.org.uk/api/search?om=[%7B%22gst%22:[%22Published%22]%7D,%7B%22ndt%22:[%22Guidance%22]%7D,%7B%22ndt%22:[%22Quality%20standard%22]%7D]&sp=on&index=guidance&q=&ps=1000',
        {
          headers: {
            dnt: '1',
            'upgrade-insecure-requests': '1',
            'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
          },
          timeout: '300s'
        }
      )
    }
  )

  sleep(Math.random() * 2);
}
