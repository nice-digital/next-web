module.exports = {
	filter(data) {
		return true;
		console.log(data);
		return !!data.req;
	},
	output: {
		path: "request.log", // name of file
		options: {
			path: "logs/", // path to write files to
			size: "10M", // max file size
			rotate: 5, // keep 5 rotated logs
		},
	},
};
