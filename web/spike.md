# steps to test page extensions against next build output

Start with clearing the .next/ build directory.

## Step 1: Build with page extensions enabled
- `cd web/`
- `rm -rf .next/`  - to ensure we get a fresh build
- `npm run build -- --experimental-app-only` - builds only the app directory
- we should see a build output similar to:
	```
		Route (app)                                Size     First Load JS
	┌ ○ /_not-found                            0 B                0 B
	├ ○ /example                               0 B                0 B
	├ ○ /example/example-child-page            0 B                0 B
	└ λ /test-page                             0 B                0 B
	+ First Load JS shared by all              85 kB
	├ chunks/472-02dfbb497517aacb.js         32.1 kB
	├ chunks/fd9d1056-e4950b334bc218cf.js    50.9 kB
	├ chunks/main-app-856b29080fb8d2da.js    231 B
	└ chunks/webpack-b41a772dc5d91230.js     1.73 kB
  ```


## Step 2: Build with pageExtensions removed.
- checkout the commit `b4c9d05d1d0978fda4934ca99edcf4c7eb698341`.
	This commit already removes the page extensions from app router pages ,and comments out the pageExtension property in next.config.
- clear the build directory in `web/`. `cd web/`, `rm -rf .next/`
- `npm run build -- --experimental-app-only` - builds only the app directory
- we should see a build output similar to:
```
Route (app)                              Size     First Load JS
┌ ○ /_not-found                          0 B                0 B
├ ○ /example                             145 B          85.1 kB
├ ○ /example/example-child-page          145 B          85.1 kB
└ λ /test-page                           145 B          85.1 kB
+ First Load JS shared by all            85 kB
  ├ chunks/472-02dfbb497517aacb.js       32.1 kB
  ├ chunks/fd9d1056-e4950b334bc218cf.js  50.9 kB
  ├ chunks/main-app-856b29080fb8d2da.js  231 B
  └ chunks/webpack-7a68b22a1c5ecb24.js   1.73 kB


λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
```

