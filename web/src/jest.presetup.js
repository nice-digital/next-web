// Ensure test environment is properly set
Object.defineProperty(process.env, "NODE_ENV", {
	value: "test",
	writable: false,
});
