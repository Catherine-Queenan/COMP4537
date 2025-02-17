/**
 * ChatGPT used as a search tool and for debugging.
 */

/**
 * Constants for strings used in the code.
 */
// General constants
const dataEn = "data-en";
const URLconst = "https://comp4537-lab5-fr5ic.ondigitalocean.app";
const domContentConst = "DOMContentLoaded";

// UI constants
const insertButton = "insertBtn";
const submitButton = "submitQuery";
const queryInputConst = "queryInput";
const responseOutputConst = "responseOutput";
const clickConst = "click";
const objectConst = "object";

// Table constants
const tableClass = "data-table";
const paragraph = "p";
const tableHead = "thead";
const tableRow = "tr";
const tableHeader = "th";
const tableData = "td";
const tableBody = "tbody";
const tableConst = "table";
const tClass = "table class";
const preConst = "pre";

// API and HTML methods constants
const getConst = "GET";
const postConst = "POST";
const selectConst = "SELECT";
const insertConst = "INSERT";
const insertEndpoint = "/insert";
const queryEndpoint = "/query";
const contentTypeHeader = "Content-Type";
const applicationJson = "application/json";
const sqlConst = "sql";
const i = "i";

/**
 * UIBuilder Class for managing the frontend structure and updates.
 */
class UIBuilder {
    constructor() {
        this.dataEn = dataEn;
        this.initEventListeners();
        this.setTextContent();
    }

    /**
     * Sets the text content of elements with the data-en attribute.
     */
    setTextContent() {
        const elements = document.querySelectorAll(`[${this.dataEn}]`);

        // Set the text content of elements based on the data-en attribute.
        elements.forEach((element) => {
            const key = element.getAttribute(this.dataEn);
            if (en[key]) {
                element.innerText = en[key];
            }
        });
    }

    /**
     * Initializes event listeners for buttons.
     */
    initEventListeners() {
        document.getElementById(insertButton).addEventListener(clickConst, () => {
            APIHandler.insertPatients();
        });

        document.getElementById(submitButton).addEventListener(clickConst, () => {
            const query = document.getElementById(queryInputConst).value.trim();
            APIHandler.executeQuery(query);
        });
    }

    /**
     * Updates the response section with the given message.
     * If the message is an array of objects, it formats it as an HTML table.
     */
    static updateResponse(response) {
        const outputElement = document.getElementById(responseOutputConst);
    
        try {
            // If response contains "data" and it's an array, format it as a table
            if (response?.data && Array.isArray(response.data)) {
                outputElement.innerHTML = UIBuilder.formatTable(response.data);
            } 
            // If response is an array but not inside "data", format it as a table
            else if (Array.isArray(response)) {
                outputElement.innerHTML = UIBuilder.formatTable(response);
            } 
            // If response is an object, format it as JSON
            else if (typeof response === objectConst) {
                outputElement.innerHTML = `<${preConst}>${JSON.stringify(response, null, 4)}</${preConst}>`;
            } 
            // If response is plain text, display it as is
            else {
                outputElement.innerText = response;
            }
        } catch (error) {
            console.error(`${en.errorUpdatingResponse} ${error}`);
            outputElement.innerText = en.errorProcessing;
        }
    }

    static formatTable(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return `<${paragraph}>` + en.noData + `</${paragraph}>`;
        }
    
        // Use tableHeaders from en.js to generate table headers
        const headers = Object.keys(en.tableHeaders);
        
        if (headers.length === 0) {
            return `<${paragraph}>` + en.invalidFormat + `</${paragraph}>`;
        }
    
        let table = `<${tClass}="${tableClass}">`;
        table += `<${tableHead}><${tableRow}>` + headers.map(header => `<${tableHeader}>${en.tableHeaders[header]}</${tableHeader}>`).join("") + `</${tableRow}></${tableHead}>`;
    
        table += `<${tableBody}>`;
        data.forEach(row => {
            if (!row) return; // Skip undefined rows
    
            table += `<${tableRow}>`;
            headers.forEach(header => {
                let cellValue = row[header] === undefined || row[header] === null ? en.NA : row[header];
                table += `<${tableData}>${cellValue}</${tableData}>`;
            });
            table += `</${tableRow}>`;
        });
        table += `</${tableBody}></${tableConst}>`;

        return table;
    }    
      
}

/**
 * APIHandler Class for making API requests and handling database operations.
 */
class APIHandler {
    static serverUrl = URLconst;

    /**
     * Sends a POST request to insert predefined patient records.
     */
    static async insertPatients() {
        const patients = en.patients;
    
        try {
            const response = await fetch(`${this.serverUrl}${insertEndpoint}`, {
                method: postConst,
                headers: { [contentTypeHeader]: applicationJson },
                body: JSON.stringify(patients),
            });
    
            if (!response.ok) {
                throw new Error(en.insertFail);
            }
    
            const result = await response.json();
            UIBuilder.updateResponse(result.message || en.insertSuccess);
        } catch (error) {
            console.error(en.insertError, error);
            UIBuilder.updateResponse(en.errorConnecting);
        }
    }
    

    /**
     * Sends an SQL query to the server, distinguishing between GET (SELECT) and POST (INSERT).
     */
    static async executeQuery(query) {
        if (!query.match(new RegExp(`^(${selectConst}|${insertConst})`, `${i}`))) {
            UIBuilder.updateResponse(en.invalidQuery);
            return;
        }
    
        const method = query.trim().toUpperCase().startsWith(selectConst) ? getConst : postConst;
        const url = `${this.serverUrl}${queryEndpoint}?${sqlConst}=${encodeURIComponent(query)}`;
    
        const options = {
            method: method,
            headers: { [contentTypeHeader]: applicationJson }
        };
    
        if (method === postConst) {
            options.body = JSON.stringify({ sql: query });
        }
    
        try {
            const response = await fetch(url, options);
            const result = await response.json();
    
            // Check if response is an array or object
            if (Array.isArray(result)) {
                UIBuilder.updateResponse(result); // Properly formatted as a table
            } else if (typeof result === objectConst) {
                UIBuilder.updateResponse(result.message || result);
            } else {
                UIBuilder.updateResponse(en.errorConnecting);
            }
        } catch (error) {
            UIBuilder.updateResponse(en.errorConnecting);
        }
    }
}

/**
 * Initialize UI after the DOM is loaded.
 */
document.addEventListener(domContentConst, () => new UIBuilder());
