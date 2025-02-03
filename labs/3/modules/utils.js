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
const readFilePath = "readFile/file.txt";
const fileName = "file.txt";

// Content types
const contentType = "Content-Type";
const textPlain = "text/plain";
const textHtml = "text/html";
const utf = "utf8";
const htmlStyle = "style=\"color:blue\"";

class ServerInfo {
    constructor() {}

    getName(req) {
        let parsedUrl = url.parse(req.url, true);
        return parsedUrl.query.name || messages.guest;
    }

    getDate() {
        return new Date().toString();
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);

        if (parsedUrl.pathname === `${pathName}${datePath}`) {
            const name = this.getName(req);
            const dateTime = this.getDate();
            const responseMessage = messages.greeting.replace("%1", name).replace("%2", dateTime);

            res.writeHead(200, { contentType: textHtml });
            res.end(`<p ${htmlStyle}>${responseMessage}</p>`);
        }
        // Writing to file
        else if (parsedUrl.pathname === `${pathName}${writeFilePath}`) {
            const text = parsedUrl.query.text || "";
            if (text) {
                this.writeToFile(text); // Append the text to file.txt
                res.writeHead(200, { contentType: textPlain });
                res.end(`Text "${text}" appended to file.txt`);
            } else {
                res.writeHead(400, { contentType: textPlain });
                res.end(messages.errorText);
            }
        }
        // Reading from file
        else if (parsedUrl.pathname === `${pathName}${readFilePath}`) {
            const filePath = path.join(__dirname, fileName);

            fs.readFile(filePath, utf, (err, data) => {
                if (err) {
                    res.writeHead(404, { contentType: textPlain });
                    const error = messages.errorFile.replace("%1", parsedUrl.pathname);
                    res.end(error);
                } else {
                    res.writeHead(200, { contentType: textPlain });
                    res.end(data);
                }
            });
        }
        else {
            res.writeHead(404, { contentType: textPlain });
            res.end(messages.error);
        }
    }
    
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

module.exports = ServerInfo;
