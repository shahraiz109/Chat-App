const http = require("http");
const app = require("./app");
const { host, port } = require("./config/env");
const createSocketServer = require("./socket");

const server = http.createServer(app);
createSocketServer(server);

server.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
