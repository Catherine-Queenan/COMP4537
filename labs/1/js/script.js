/**
 * ChatGPT used as alternative to search tool, and as debugging tool.
 */

/**
 * Constant variables used throughout the application.
 */
// Navigational strings
const home = '/index.html';
const writer = '/writer.html';
const reader = '/reader.html';

// Button strings
const click = 'click';
const add = 'add';
const remove = 'remove';
const back = 'back';
const writerHTML = 'writer';
const readerHTML = 'reader';
const buttonRemove = 'button';
const className = 'class';

// Local storage and note strings
const storageNotes = 'notes';
const elementNote = 'note';
const dataIndex = 'data-index';
const title = 'title';
const notesContainer = 'notesContainer';
const divNotes = 'div';
const inputText = 'textarea';
const notesInput = 'noteInput_';
const storage = 'storage';
const input = 'input';

// Time strings
const dateTime = 'dateTime';
const storeTime = 'storeTime';
const updateTime = 'updateTime';

// General string
const DOMContentLoaded = 'DOMContentLoaded';

/**
 * Controller for the navigational buttons within the application.
 */
class navigationController {
    constructor() {}

    /**
     * Handles the button click event to navigate back to the home page.
     * @param {HTMLElement} button
     */
    backHome(button) {
        button.addEventListener(click, () => {
            window.location.href = `.${home}`;
        });
    }

    /**
     * Handles the button click event to navigate to the writer page.
     * @param {HTMLElement} button 
     */
    writerButton(button) {
        button.addEventListener(click, () => {
            window.location.href = `.${writer}`;
        })
    }

    /**
     * Handles the button click event to navigate to the reader page.
     * @param {HTMLElement} button 
     */
    readerButton(button) {
        button.addEventListener(click, () => {
            window.location.href = `.${reader}`;
        })
    }
    
}

class noteButtonController {
    constructor() {}

    updateNote(noteInput) {
        const note = noteInput ? noteInput.value : '';
        if (note) {
            // JSON string retrieved from localStorage via key is parsed into JavaScript array
            // If empty, defaults to an empty array
            const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];
            notes[parseInt(noteInput.id.split("_")[1], 10)] = note;
            // Converts the notes array back into JSON string and stores it in localStorage with the key storageNotes
            localStorage.setItem(storageNotes, JSON.stringify(notes));
        }
        // Calls updateTime to update the time displayed on the page
        this.updateTime();
    }

    /**
     * Handles the button click event to add a new note.
     * @param {HTMLElement} button
     */
    addButton(button) {
        button.addEventListener(click, () => {
            // JSON string retrieved from localStorage via key is parsed into JavaScript array
            const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];
            // Adds a new empty note to the notes array
            notes.push("");
            // Converts the notes array back into JSON string and stores it in localStorage with the key storageNotes
            localStorage.setItem(storageNotes, JSON.stringify(notes));
            // Calls displayNotes to update the list of notes
            this.displayNotes();
        });
    }

    /**
     * Handles the button click event to remove a note.
     * @param {HTMLElement} button
     */
    removeButton(button) {
        button.addEventListener(click, () => {
            // Retrieves the index of the note to remove from the button's data-index attribute
            const index = button.getAttribute(dataIndex);
            // JSON string retrieved from localStorage via key is parsed into JavaScript array
            // If empty, defaults to an empty array
            const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];
            // Removes the note at the specified index
            notes.splice(index, 1);
            // Converts the notes array back into JSON string and stores it in localStorage with the key storageNotes
            localStorage.setItem(storageNotes, JSON.stringify(notes));
            // Calls displayNotes to update the list of notes
            this.displayNotes();
        });
    }

    /**
     * Displays the notes stored in localStorage on the writer page.
     * Creates a div element for each note containing an input element for the note text
     * and a button to remove the note.
     */
    displayNotes() {
        // Retrieves the notesContainer element from the DOM and sets inner HTML to an empty string
        const noteContainer = document.getElementById(notesContainer);
        noteContainer.innerHTML = "";
        // JSON string retrieved from localStorage via key is parsed into JavaScript array
        const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];

        // Iterates over each note in the notes array
        notes.forEach((note, index) => {
            // Creates a new div element to contain the note input and remove button
            const noteDiv = document.createElement(divNotes);
            // Creates a new input element for the note text
            const noteInput = document.createElement(inputText);
            // Sets the ID of the note input element to noteInput_ followed by the index
            noteInput.id = notesInput + index;
            noteInput.value = note;
            noteInput.placeholder = messages.enterNote;

            // Adds an event listener to the note input element to update the note when the input event is triggered
            noteInput.addEventListener(input, () => this.updateNote(noteInput))
            // Appends the note input element to the note div
            noteDiv.appendChild(noteInput)
            
            // Creates a new button element for removing the note
            const removeButton = document.createElement(buttonRemove);
            removeButton.textContent = messages.remove;
            removeButton.setAttribute(className, remove);
            removeButton.setAttribute(dataIndex, index);
            this.removeButton(removeButton);
            noteDiv.appendChild(removeButton);

            // Appends the note div to the note container
            noteContainer.appendChild(noteDiv);
        });
        this.updateTime();  
    }

    /**
     * Displays the notes stored in localStorage.
     * Creates a div element for each note containing a non-editable input element for the note text.
     */
    viewNotes() {
        // Retrieves the notesContainer element from the DOM and sets inner HTML to an empty string
        const noteContainer = document.getElementById(notesContainer);
        noteContainer.innerHTML = "";
        // Retrieves the notes array from localStorage by parsing the JSON string
        const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];
        // Iterates over each note in the notes array
        notes.forEach((note, index) => {
            // Creates a new div element to contain the note input, with a unique ID
            const noteDiv = document.createElement(divNotes);
            const noteInput = document.createElement(divNotes);
            noteInput.id = notesInput + index;
            noteInput.setAttribute(className, elementNote);
            noteInput.value = note;
            noteInput.textContent = note;
            // Replaces newline characters with line breaks in the note text
            noteInput.innerHTML = note.replace(/\n/g, '<br>');

            noteDiv.appendChild(noteInput)

            noteContainer.appendChild(noteDiv);
            
        });
        this.updateTime();
    }

    /**
     * Updates the time displayed on the page to the current time.
     */
    updateTime() {
        // Creates a new Date object to get the current date and time
        const date = new Date();
        const thisTime = document.getElementById(dateTime);
        thisTime.textContent = date.toLocaleString();
        // Stores the current date and time in localStorage with the key updateTime
        localStorage.setItem(updateTime, date.toLocaleString());
    }
}

/**
 * Class to build the user interface based on the current page.
 */
class UIBuilder {
    // Constructor for the UIBuilder class
    constructor(currentPage) {
        this.currentPage = currentPage;
        this.noteButtonController = new noteButtonController();
        this.navigationController = new navigationController();
        this.initializeUI(currentPage);
    }

    /**
     * Initializes the user interface based on the current page.
     * Uses includes() to check if the current page includes the writer, reader, or home page
     */
    initializeUI() {
        if (this.currentPage.includes(writer)) {
            this.initWriterUI();
        } else if (this.currentPage.includes(reader)) {
            this.initReaderUI();
        } else if (this.currentPage.includes(home)) {
            this.initHomeUI();
        }
    }

    /**
     * Initializes the user interface for the home page.
     */
    initHomeUI() {
        // Retrieves the title, reader, and writer buttons from the DOM
        this.readerButton = document.getElementById(readerHTML);
        this.writerButton = document.getElementById(writerHTML);

        // Sets the inner HTML of the title, reader, and writer buttons to the corresponding messages
        document.getElementById(title).innerHTML = messages.title;
        this.readerButton.innerHTML = messages.reader;
        this.writerButton.innerHTML = messages.writer;

        // Adds event listeners to the reader and writer buttons to navigate to the corresponding pages
        this.navigationController.writerButton(this.writerButton);
        this.navigationController.readerButton(this.readerButton);
        
    }

    /**
     * Initializes the user interface for the writer page.
     */
    initWriterUI() {
        // Retrieves the add note button, remove note buttons, and back home button from the DOM
        this.addNoteButton = document.getElementById(add);
        this.removeNoteButtons = document.querySelectorAll(remove);
        this.backHomeButton = document.getElementById(back);

        // Sets the inner HTML of the date and time, store time, add note, remove note, and back home buttons to the corresponding messages
        document.getElementById(dateTime).innerHTML = messages.updateTime;
        document.getElementById(storeTime).innerHTML = messages.storeTime;
        this.addNoteButton.innerHTML = messages.add;
        // Iterates over each remove note button and sets the inner HTML to the remove message
        this.removeNoteButtons.forEach((button) => {
            button.innerHTML = messages.remove;
        });
        this.backHomeButton.innerHTML = messages.back;

        this.noteButtonController.addButton(this.addNoteButton);
        // Iterates over each remove note button and adds an event listener to remove the note when clicked
        this.removeNoteButtons.forEach((button) => {
            this.noteButtonController.removeButton(button);
        });
        this.navigationController.backHome(this.backHomeButton);

        // Calls displayNotes and updateTime to update the list of notes and the timestamp
        this.noteButtonController.displayNotes();
        this.noteButtonController.updateTime();
    }

    /**
     * Initializes the user interface for the reader page.
     */
    initReaderUI() {
        // Retrieves the back home button from the DOM
        this.backHomeButton = document.getElementById(back);

        // Sets the inner HTML of the date and time, store time, and back home buttons to the corresponding messages
        document.getElementById(dateTime).innerHTML = messages.updateTime;
        document.getElementById(updateTime).innerHTML = messages.updateTime;
        this.backHomeButton.innerHTML = messages.back;

        this.navigationController.backHome(this.backHomeButton);

        this.noteButtonController.viewNotes();
        this.noteButtonController.updateTime();

        // Adds an event listener to the window object to listen for storage events (localstorage)
        window.addEventListener(storage, (event) => {
            if (event.key === storageNotes) {
                // Calls viewNotes and updateTime to update the list of notes and the timestamp
                this.noteButtonController.viewNotes();
                this.noteButtonController.updateTime();
            }
        });
    }
}

/**
 * Class to store notes in an array.
 */
class Notes {
    constructor() {
        this.notes = [];
    }
}

// Event listener to create a new instance of the UIBuilder class when the DOM content is loaded
document.addEventListener(DOMContentLoaded, () => {
    new UIBuilder(window.location.href);
});