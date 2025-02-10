const server2 = "https://comp4537-lab4-ke456.ondigitalocean.app";

const postConst = "POST";
const jsonConst = "application/json";
const domContent = "DOMContentLoaded";
const apiDefinitions = "/api/definitions";
const wordGet = "/?word=";

const storeFormConst = "storeForm";
const searchFormConst = "searchForm";
const wordConst = "word";
const definitionConst = "definition";
const searchWordConst = "searchWord";
const responseConst = "response";
const searchResultConst = "searchResult";
const submitConst = "submit";

const successConst = "success";
const errorConst = "error";
const blockConst = "block";

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
}

document.addEventListener(domContent, () => {
    const api = new DictionaryAPI(server2);
    new DictionaryUI(api);
});
