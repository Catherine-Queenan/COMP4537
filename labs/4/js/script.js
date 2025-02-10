const server2 = "https://comp4537-lab4-ke456.ondigitalocean.app";

const postConst = "POST";
const jsonConst = "application/json";
const domContent = "DOMContentLoaded";
const apiDefinitions = "/api/definitions";
const wordGet = "/?word=";
const searchHtml = "search.html";
const storeHtml = "store.html";

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

class DictionaryAPI {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
    }

    async storeWord(word, definition) {
        if (!this.validateInput(word, definition)) return { message: en.invalidInput, isSuccess: false };

        try {
            const response = await fetch(`${this.apiBaseUrl}${apiDefinitions}`, {
                method: postConst,
                headers: { "Content-Type": jsonConst },
                body: JSON.stringify({ word, definition })
            });

            const data = await response.json();
            return this.formatResponse(data, response.status);
        } catch (error) {
            return { message: en.errorConnecting, isSuccess: false };
        }
    }

    async searchWord(word) {
        if (!this.validateInput(word)) return { message: en.invalidInput, isSuccess: false };

        try {
            const response = await fetch(`${this.apiBaseUrl}${apiDefinitions}${wordGet}${encodeURIComponent(word)}`);
            const data = await response.json();
            return this.formatResponse(data, response.status);
        } catch (error) {
            return { message: en.errorConnecting, isSuccess: false };
        }
    }

    validateInput(word, definition = null) {
        return word.trim() && !/\d/.test(word) && (definition === null || definition.trim());
    }

    formatResponse(data, statusCode) {
        let message = data.message || (data.definition ? `${en.definitionMessage} ${data.definition}` : en.definitionNotFound);
        let requestInfo = data.requestNumber ? `${en.requestMessage} ${data.requestNumber}` : "";
        let errorInfo = statusCode !== 200 ? `(${statusCode} ${this.getStatusText(statusCode)})` : "";

        let isSuccess = statusCode === 200; 

        return { 
            message: [requestInfo, message, errorInfo].filter(Boolean).join(" | "), 
            isSuccess 
        };
    }

    getStatusText(statusCode) {
        const statusMessages = {
            400: en.badRequest,
            404: en.notFound,
            500: en.internalServerError
        };
        return statusMessages[statusCode] || en.UnknownError;
    }
}

class DictionaryUI {
    constructor(api) {
        this.api = api;
        this.initEventListeners();
        this.setTextContent();
        this.initNavigationButtons();
    }

    initEventListeners() {
        this.setupStoreForm();
        this.setupSearchForm();
    }

    setupStoreForm() {
        const storeForm = document.getElementById(storeFormConst);
        if (storeForm) {
            storeForm.addEventListener(submitConst, async (event) => {
                event.preventDefault();
                const word = document.getElementById(wordConst).value.trim();
                const definition = document.getElementById(definitionConst).value.trim();
                const response = await this.api.storeWord(word, definition);
                this.displayResponse(responseConst, response.message, response.isSuccess);
            });
        }
    }

    setupSearchForm() {
        const searchForm = document.getElementById(searchFormConst);
        if (searchForm) {
            searchForm.addEventListener(submitConst, async (event) => {
                event.preventDefault();
                const searchWord = document.getElementById(searchWordConst).value.trim();
                const response = await this.api.searchWord(searchWord);
                this.displayResponse(searchResultConst, response.message, response.isSuccess);
            });
        }
    }

    displayResponse(elementId, message, isSuccess) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.innerText = message;
        element.className = isSuccess ? successConst : errorConst;
        element.style.display = blockConst;
    }

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

    setTextContent() {
        const elements = document.querySelectorAll(`[${dataEn}]`);

        elements.forEach((element) => {
            const key = element.getAttribute(dataEn);
            if (en[key]) {
                element.innerText = en[key];
            }
        });
    }
}

class NavigationButton {
    constructor(containerId, buttonText, targetPage) {
        this.containerId = containerId;
        this.buttonText = buttonText;
        this.targetPage = targetPage;
    }

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

document.addEventListener(domContent, () => {
    const api = new DictionaryAPI(server2);
    new DictionaryUI(api);
});
