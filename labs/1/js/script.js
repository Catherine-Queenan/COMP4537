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

// Local storage and note strings
const storageNotes = 'notes';
const elementNote = 'note';
const dataIndex = 'data-index';
const title = 'title';
const notesContainer = 'notesContainer';
const divNotes = 'div';

// Time strings
const dateTime = 'dateTime';
const storeTime = 'storeTime';
const updateTime = 'updateTime';

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

    /**
     * Handles the button click event to add a new note.
     * @param {HTMLElement} button
     */
    addButton(button) {
        button.addEventListener(click, () => {
            // Get the note from the HTML input field
            const noteContainer = document.getElementById(notesContainer);
            const noteInput = document.getElementById(elementNote);
            // If there is a note, add it to the local storage and display all notes within storage
            if (notesContainer.style.display === 'none') {
                notesContainer.style.display = 'block';
                noteInput.focus();
            } else {
                const note = noteInput ? noteInput.value : '';
                if (note) {
                    // JSON string retrieved from localStorage via key is parsed into JavaScript array
                    // If empty, defaults to an empty array
                    const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];
                    notes.push(note);
                    // Converts the notes array back into JSON string and stores it in localStorage with the key storageNotes
                    localStorage.setItem(storageNotes, JSON.stringify(notes));
                    noteInput.value = '';
                    // Sets the input field to an empty string and calls displayNotes to update the list of notes
                    this.displayNotes();
                    notesContainer.style.display = 'none';
                }
            }
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
     * Displays the notes stored in localStorage.
     */
    displayNotes() {
        const notesContainer = document.getElementById(notesContainer);
        notesContainer.innerHTML = '';
        const notes = JSON.parse(localStorage.getItem(storageNotes)) || [];

        notes.forEach((note, index) => {
            const noteDiv = document.createElement(divNotes);
            noteDiv.textContent = note;

            const removeButton = document.createElement(buttonRemove);
            removeButton.textContent = messages.remove;
            removeButton.setAttribute(dataIndex, index);
            this.removeButton(removeButton);
            noteDiv.appendChild(removeButton);

            notesContainer.appendChild(noteDiv);
        });
    }

}

class UIBuilder {
    constructor(currentPage) {
        this.currentPage = currentPage;
        this.noteButtonController = new noteButtonController();
        this.navigationController = new navigationController();
        this.initializeUI(currentPage);
    }

    initializeUI() {
        if (this.currentPage.includes(writer)) {
            this.initWriterUI();
        } else if (this.currentPage.includes(reader)) {
            this.initReaderUI();
        } else if (this.currentPage.includes(home)) {
            this.initHomeUI();
        }
    }

    initHomeUI() {
        this.readerButton = document.getElementById(readerHTML);
        this.writerButton = document.getElementById(writerHTML);

        document.getElementById(title).innerHTML = messages.title;
        this.readerButton.innerHTML = messages.reader;
        this.writerButton.innerHTML = messages.writer;

        this.navigationController.writerButton(this.writerButton);
        this.navigationController.readerButton(this.readerButton);
        
    }

    // initWriterUI() {
    //     const addNoteButton = document.getElementById(add);
    //     const backHomeButton = document.getElementById(back);

    //     // Initially hide the input container
    //     const noteInputContainer = document.getElementById('noteInputContainer');
    //     noteInputContainer.style.display = 'none';

    //     this.noteButtonController.addButton(addNoteButton);
    //     this.navigationController.backHome(backHomeButton);

    //     this.noteButtonController.displayNotes(); // Display existing notes
    // }

    initWriterUI() {
        this.addNoteButton = document.getElementById(add);
        this.removeNoteButtons = document.querySelectorAll(remove);
        this.backHomeButton = document.getElementById(back);

        document.getElementById(dateTime).innerHTML = messages.updateTime;
        document.getElementById(storeTime).innerHTML = messages.storeTime;
        this.addNoteButton.innerHTML = messages.add;
        this.removeNoteButtons.forEach((button) => {
            button.innerHTML = messages.remove;
        });
        this.backHomeButton.innerHTML = messages.back;

        this.noteButtonController.addButton(this.addNoteButton);
        this.removeNoteButtons.forEach((button) => {
            this.noteButtonController.removeButton(button);
        });
        this.navigationController.backHome(this.backHomeButton);

        this.noteButtonController.displayNotes();
    }

    initReaderUI() {
        this.backHomeButton = document.getElementById(back);

        document.getElementById(dateTime).innerHTML = messages.updateTime;
        document.getElementById(updateTime).innerHTML = messages.updateTime;
        this.backHomeButton.innerHTML = messages.back;

        this.navigationController.backHome(this.backHomeButton);
    }
}

class Notes {
    constructor() {
        this.notes = [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UIBuilder(window.location.href);
});

// Loop through the notes in writer, each in their own div that has a remove button
// for each, and removeButton is called there. 

// displayNotes also gets current time and puts it on screen