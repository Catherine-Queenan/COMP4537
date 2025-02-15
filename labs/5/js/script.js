class UIBuilder {
    constructor() {
        this.dataEn = "data-en"; // Attribute for translations
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
        document.getElementById("insertBtn").addEventListener("click", () => {
            APIHandler.insertPatients();
        });

        document.getElementById("submitQuery").addEventListener("click", () => {
            const query = document.getElementById("queryInput").value.trim();
            APIHandler.executeQuery(query);
        });
    }

    /**
     * Updates the response section with the given message.
     */
    static updateResponse(message) {
        document.getElementById("responseOutput").innerText = message;
    }
}

class APIHandler {
    static serverUrl = "http://server2-address"; // Replace with actual backend URL

    /**
     * Sends a POST request to insert predefined patient records.
     */
    static async insertPatients() {
        const patients = [
            { name: "Sara Brown", dateOfBirth: "1910-01-01" },
            { name: "John Smith", dateOfBirth: "1941-01-01" },
            { name: "Jack Ma", dateOfBirth: "1961-01-30" },
            { name: "Elon Musk", dateOfBirth: "1999-01-01" }
        ];

        try {
            const response = await fetch(`${this.serverUrl}/insert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patients),
            });

            const result = await response.json();
            UIBuilder.updateResponse(result.message || en.insertSuccess);
        } catch (error) {
            UIBuilder.updateResponse(en.errorConnecting);
        }
    }

    /**
     * Sends an SQL query to the server, distinguishing between GET (SELECT) and POST (INSERT).
     */
    static async executeQuery(query) {
        // Using a simple regex to check for SELECT and INSERT statements
        if (!query.match(/^(SELECT|INSERT)/i)) {
            UIBuilder.updateResponse(en.invalidQuery);
            return;
        }

        const method = query.trim().toUpperCase().startsWith("SELECT") ? "GET" : "POST";
        const url = `${this.serverUrl}/query?sql=${encodeURIComponent(query)}`;

        const options = {
            method: method,
            headers: { "Content-Type": "application/json" }
        };

        // Add body only for POST requests
        if (method === "POST") {
            options.body = JSON.stringify({ sql: query });
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            UIBuilder.updateResponse(result.message || JSON.stringify(result.data, null, 2));
        } catch (error) {
            UIBuilder.updateResponse(en.errorConnecting);
        }
    }
}

// Initialize UI
document.addEventListener("DOMContentLoaded", () => new UIBuilder());