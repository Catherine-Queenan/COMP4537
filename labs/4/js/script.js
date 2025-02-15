/**
 * ChatGPT used as search tool and debugging.
 */


/**
 * Constant strings for use throughout the application.
 */
const server2 = "https://comp4537-lab4-ke456.ondigitalocean.app";

// Redirect and load constants
const postConst = "POST";
const jsonConst = "application/json";
const domContent = "DOMContentLoaded";
const apiDefinitions = "/api/definitions";
const wordGet = "/?word=";
const searchHtml = "search.html";
const storeHtml = "store.html";

// Constants for HTML elements
const storeFormConst = "storeForm";
const searchFormConst = "searchForm";
const wordConst = "word";
const definitionConst = "definition";
const searchWordConst = "searchWord";
const responseConst = "response";
const searchResultConst = "searchResult";
const submitConst = "submit";
const navigationConst = "navigation";
const successConst = "success";
const errorConst = "error";
const blockConst = "block";
const buttonConst = "button";
const dataEn = "data-en";

/**
 * Dictionary API class to interact with the server API.
 */
class DictionaryAPI {
    /**
     * Constructor for the DictionaryAPI class.
     * @param {string} apiBaseUrl - The base URL of the API. 
     */
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    /**
     * Asynchronous function to store a word in the dictionary.
     * @param {string} word - The word to store in the dictionary.
     * @param {string} definition - The definition of the word.
     * @returns {object} - The response object.
     */
    async storeWord(word, definition) {
        // Validate the input
        if (!this.validateInput(word, definition)) return { message: en.invalidInput, isSuccess: false };

        // Make a POST request to the API to store the word
        try {
            const response = await fetch(`${this.apiBaseUrl}${apiDefinitions}`, {
                method: postConst,
                headers: { "Content-Type": jsonConst },
                body: JSON.stringify({ word, definition })
            });

            // Parse the response JSON
            const data = await response.json();
            // Format the response message based on the status code
            return this.formatResponse(data, response.status);
        } catch (error) {
            // Return an error message if there is an issue connecting to the server
            return { message: en.errorConnecting, isSuccess: false };
        }
    }

    /**
     * Asynchronous function to search for a word in the dictionary.
     * @param {string} word - The word to search for in the dictionary.
     * @returns {object} - The response object.
     */
    async searchWord(word) {
        // Validate the input
        if (!this.validateInput(word)) return { message: en.invalidInput, isSuccess: false };

        // Make a GET request to the API to search for the word
        try {
            const response = await fetch(`${this.apiBaseUrl}${apiDefinitions}${wordGet}${encodeURIComponent(word)}`);

            // Parse the response JSON
            const data = await response.json();
            // Format the response message based on the status code
            return this.formatResponse(data, response.status);
        } catch (error) {
            // Return an error message if there is an issue connecting to the server
            return { message: en.errorConnecting, isSuccess: false };
        }
    }

    /** 
     * Function to validate the input word and definition. 
     * Ensures that the word is not empty, does not contain numbers, 
     * and the definition is not empty if provided.
     * @param {string} word - The word to validate.
     * @param {string} definition - The definition to validate.
     * @returns {boolean} - True if the input is valid, false otherwise.
     */
    validateInput(word, definition = null) {
        return word.trim() && !/\d/.test(word) && (definition === null || definition.trim());
    }

    /**
     * Formats the response message based on the data and status code.
     * @param {*} data - The data object from the response.
     * @param {*} statusCode - The status code of the response.
     * @returns {object} - The formatted response object.
     */
    formatResponse(data, statusCode) {
        // Extract the message and definition from the data object
        let message = data.message || (data.definition ? `${en.definitionMessage} ${data.definition}` : en.definitionNotFound);
        
        // Include the request number in the message if available
        let requestInfo = data.requestNumber ? `${en.requestMessage} ${data.requestNumber}` : "";
        
        // Include the status code and status text in the message if not successful
        let errorInfo = statusCode !== 200 ? `(${statusCode} ${this.getStatusText(statusCode)})` : "";

        // Determine if the request was successful based on the status code
        let isSuccess = statusCode === 200; 

        // Return the formatted response object
        return { 
            // Filter out any empty strings when joining the message parts
            message: [requestInfo, message, errorInfo].filter(Boolean).join(" | "), 
            isSuccess
        };
    }

    /**
     * Retrieves the status text corresponding to the status code.
     * @param {*} statusCode - The status code of the response.
     * @returns {string} - The status text corresponding to the status code.
     */
    getStatusText(statusCode) {
        // Define status messages for different status codes
        const statusMessages = {
            400: en.badRequest,
            404: en.notFound,
            500: en.internalServerError
        };
        // Return the status message if available, otherwise return an unknown error message
        return statusMessages[statusCode] || en.UnknownError;
    }
}

/**
 * DictionaryUI class to handle the user interface interactions.
 */
class DictionaryUI {
    /**
     * Constructor for the DictionaryUI class.
     * @param {DictionaryAPI} api - The DictionaryAPI instance to interact with the server API.
     */
    constructor(api) {
        this.api = api;
        this.initEventListeners();
        this.setTextContent();
        this.initNavigationButtons();
    }

    /**
     * Initializes the event listeners for the store and search forms.
     */
    initEventListeners() {
        this.setupStoreForm();
        this.setupSearchForm();
    }

    /**
     * Sets up the event listener for the store form submission.
     */
    setupStoreForm() {
        const storeForm = document.getElementById(storeFormConst);
        if (storeForm) {
            storeForm.addEventListener(submitConst, async (event) => {
                event.preventDefault();
                const word = document.getElementById(wordConst).value.trim();
                const definition = document.getElementById(definitionConst).value.trim();
                // Store the word and definition using the API
                const response = await this.api.storeWord(word, definition);
                // Display the response message on the page
                this.displayResponse(responseConst, response.message, response.isSuccess);
            });
        }
    }

    /**
     * Sets up the event listener for the search form submission.
     */
    setupSearchForm() {
        const searchForm = document.getElementById(searchFormConst);
        if (searchForm) {
            searchForm.addEventListener(submitConst, async (event) => {
                event.preventDefault();
                const searchWord = document.getElementById(searchWordConst).value.trim();
                // Search for the word using the API
                const response = await this.api.searchWord(searchWord);
                this.displayResponse(searchResultConst, response.message, response.isSuccess);
            });
        }
    }

    /**
     * Displays the response message on the page.
     * @param {*} elementId - The ID of the element to display the response message.
     * @param {String} message - The response message to display.
     * @param {Boolean} isSuccess - Whether the response was successful.
     * @returns 
     */
    displayResponse(elementId, message, isSuccess) {
        const element = document.getElementById(elementId);
        if (!element) return;

        // Set the message text, class, and display style based on the success status.
        element.innerText = message;
        element.className = isSuccess ? successConst : errorConst;
        element.style.display = blockConst;
    }

    /**
     * Initializes the navigation buttons for the Store and Search pages.
     */
    initNavigationButtons() {
        if (document.getElementById(storeFormConst)) {
            // Create a button for navigation from the Store page to the Search page
            const storeButton = new NavigationButton(navigationConst, en.goSearch, searchHtml);
            storeButton.createButton();
        }

        if (document.getElementById(searchFormConst)) {
            // Create a button for navigation from the Search page to the Store page
            const searchButton = new NavigationButton(navigationConst, en.goStore, storeHtml);
            searchButton.createButton();
        }
    }

    /**
     * Sets the text content of elements with the data-en attribute.
     */
    setTextContent() {
        const elements = document.querySelectorAll(`[${dataEn}]`);

        // Set the text content of elements based on the data-en attribute.
        elements.forEach((element) => {
            const key = element.getAttribute(dataEn);
            if (en[key]) {
                element.innerText = en[key];
            }
        });
    }
}

/**
 * NavigationButton class to create navigation buttons on the page.
 */
class NavigationButton {
    /**
     * Constructor for the NavigationButton class.
     * @param {*} containerId - The ID of the container element to append the button.
     * @param {String} buttonText - The text content of the button.
     * @param {*} targetPage - The target page to navigate to when the button is clicked.
     */
    constructor(containerId, buttonText, targetPage) {
        this.containerId = containerId;
        this.buttonText = buttonText;
        this.targetPage = targetPage;
    }

    /**
     * Creates a button element and appends it to the container.
     */
    createButton() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Create a new button element
        const button = document.createElement(buttonConst);
        button.innerText = this.buttonText;

        // Add click event to navigate to the target page
        button.onclick = () => {
            window.location.href = this.targetPage;
        };

        // Append the button to the container
        container.appendChild(button);
    }
}

/**
 * Start the application after the DOM content is loaded.
 */
document.addEventListener(domContent, () => {
    const api = new DictionaryAPI(server2);
    new DictionaryUI(api);
});
