const http = require("http");
const ServerInfo = require("./modules/utils");

/**
 * Class to create a server that listens to requests on a specific port.
 */
class Server {
    // Constructor with a default port of 8080
    constructor(port) {
        this.port = port || 8080;
        this.serverInfo = new ServerInfo();
    }

    /**
     * Callback function to handle the server request.
     * @param {*} req 
     * @param {*} res 
     */
    handleRequest(req, res) {
        this.serverInfo.handleRequest(req, res); // Pass `res` to avoid errors
    }

    /**
     * Start the server and listen to requests on the specified port.
     */
    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            
        });
    }
}

// Create a new server instance and start it
const app = new Server(8080);
app.start();