/**
 * ChatGPT used for debugging.
 */

/**
 * String constants for the server.
 */
// Requirements
const url = require('url');
const messages = require('../lang/en/en');
const fs = require('fs');
const path = require('path');

// URL paths
const pathName = "/labs/3/";
const datePath = "getDate/";
const writeFilePath = "writeFile/";
const readFilePath = "readFile/";
const fileName = "file.txt";

// Content types
const contentType = "Content-Type";
const textPlain = "text/plain";
const textHtml = "text/html";
const utf = "utf8";
const htmlStyle = "style=\"color:blue\"";

/**
 * ServerInfo class to handle server requests. 
 * It provides methods to get the name of the user, the current date, and handle requests.
 */
class ServerInfo {
    constructor() {}

    /**
     * Get the name of the user from the request query parameters.
     * @param {*} req
     * @returns 
     */
    getName(req) {
        // Parse the URL to get the query parameters
        let parsedUrl = url.parse(req.url, true);
        // Return the name if it exists, otherwise return the default guest name
        return parsedUrl.query.name || messages.guest;
    }

    /**
     * Gets the current date as a string.
     * @returns the current date as a string.
     */
    getDate() {
        return new Date().toString();
    }

    /**
     * Handles the server request based on the URL path.
     * It returns a greeting message with the user name and current date if the path is correct.
     * It writes the text to a file if the path is correct.
     * It reads the content of the file if the path is correct.
     * @param {*} req 
     * @param {*} res 
     */
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);

        // Greeting message
        if (parsedUrl.pathname === `${pathName}${datePath}`) {
            // Get the name and date
            const name = this.getName(req);
            const dateTime = this.getDate();
            const responseMessage = messages.greeting.replace("%1", name).replace("%2", dateTime);

            // Send the response
            res.writeHead(200, { contentType: textHtml });
            res.end(`<p ${htmlStyle}>${responseMessage}</p>`);
        }
        // Writing to file
        else if (parsedUrl.pathname === `${pathName}${writeFilePath}`) {
            // Get the text from the query parameters
            const text = parsedUrl.query.text || "";
            // Write the text to the file
            if (text) {
                this.writeToFile(text); // Append the text to file.txt
                res.writeHead(200, { contentType: textPlain });
                const successMessage = messages.successText.replace("%1", text);
                res.end(successMessage);
            // If no text is provided, return an error    
            } else {
                res.writeHead(400, { contentType: textPlain });
                res.end(messages.errorText);
            }
        }
        // Reading from file
        else if (parsedUrl.pathname.startsWith(`${pathName}${readFilePath}`)) {
            // Get the file name from the URL   
            const params = parsedUrl.pathname.split('/');
            // Get the file name by taking the last element of the array
            const file = params[params.length - 1];
            
            // Read the file content
            const filePath = path.join(__dirname, file);
            fs.readFile(filePath, utf, (err, data) => {
                // If there is an error, return a 404 status code
                if (err) {
                    res.writeHead(404, { contentType: textPlain });
                    const error = messages.errorFile.replace("%1", file);
                    res.end(error);
                // If the file is read successfully, return the content    
                } else {
                    res.writeHead(200, { contentType: textPlain });
                    res.end(data);
                }
            });
        }
        // If the path is incorrect, return a 404 status code
        else {
            res.writeHead(404, { contentType: textPlain });
            res.end(messages.error);
        }
    }
    
    /**
     * Writes the text to a file.
     * @param {*} text
     */
    writeToFile(text) {
        const filePath = path.join(__dirname, fileName);

        // Append to the file or create it if it doesn't exist
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                console.error(messages.fileError.replace("%1", fileName), err);
            }
        });
    }
}

// Export the ServerInfo class
module.exports = ServerInfo;