const http = require("http");
const ServerInfo = require("./modules/utils");

class Server {
    constructor(port) {
        this.port = port || 3000;
        this.serverInfo = new ServerInfo();
    }

    handleRequest(req, res) {
        this.serverInfo.handleRequest(req, res); // Pass `res` to avoid errors
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

const app = new Server(3000);
app.start();
