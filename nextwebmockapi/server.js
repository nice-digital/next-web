require("dotenv").config();

const http = require("http");
const URL = require("url");

const jsonServer = require("json-server");

const http_port = process.env.HTTP_PORT || 3001;

const rewriter = jsonServer.rewriter({
	home: "home",
});

const server = jsonServer.create();
const middleware = jsonServer.defaults();
const router = jsonServer.router("mockdata.json");

router.render = (req, res) => {
	let requestUrl = new URL(req.url);
	if (requestUrl.path.includes("home")) {
		res.jsonp({
			_embedded: res.locals.data,
		});
	} else {
		res.jsonp(res.locals.data[0]);
	}
};

server.use(rewriter);
server.use(middleware);
server.use(router);

http.createServer(server).listen(http_port, () => {
	console.log(`Next web Mock API is running on http://localhost:${http_port}`);
});
