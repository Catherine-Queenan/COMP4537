/**
 * Chatgpt used as alternative to search tool, and as debugging tool.
 */


/**
 * Constant variables used throughout the application.
 */

// Strings for colour generation
const letters = "0123456789ABCDEF";
const hash = "#";
// Strings for buttons
const memoryButton = "memoryButton";
const memoryScreen = "memoryScreen";
const go = "go";
// String for input box
const n = "n";
const label = "labelText";
// Strings for CSS properties
const margin = "0.5em";
const none = "none";
const auto = "auto";
const absolute = "absolute";
const transform = "transform 0.5s ease";
const transitionstart = "transitionstart";
const transformString = "translate({x}px, {y}px)";
// Integers for time and size limits
const second = 1000;
const widthLimit = 300;
const heightLimit = 250;

/**
 * Builds the user interface, including the label, input box, and go button.
 * Initializes the memory game and hides the UI elements when the game starts.
 */
class UIBuilder {
    constructor(label, n, goButton) {
        this.label = document.getElementById(label);
        this.n = document.getElementById(n);
        this.goButton = document.getElementById(goButton);

        // Set up the event listener for the Go! button
        this.goButton.onclick = () => {
            // Initialize the game when the go button is clicked
            this.memoryGame.initializeGame();
        };

        // Create a new memory game instance and initialize the game
        this.memoryGame = new MemoryGame(memoryScreen, n);
    }

    /**
     * Initializes the UI elements, setting the text and button labels according the user.js.
     */
    initializeUI() {
        this.label.innerHTML = userMessages.boxLabel();
        this.n.placeholder = userMessages.inputBox();
        this.goButton.innerHTML = userMessages.goButton();
    }

    /**
     * Hides the UI elements when the game starts by setting display to none.
     */
    hideUI() {
        this.label.style.display = none;
        this.n.style.display = none;
        this.goButton.style.display = none;
    }
}

/**
 * Holds data for each button object, including the color, number, and its ID.
 * Controls the appearance of the button, hiding or showing the number when it is flipped.
 */
class Button {
    constructor(color, number, id) {
        this.color = color;
        this.number = number;
        this.id = id;
    }

    /**
     * Flips the button, hiding or showing the number when it is flipped.
     */
    flip() {
        const button = document.getElementById(this.id);
        if (button.innerHTML === '') {
            button.innerHTML = this.number;
        } else {
            button.innerHTML = '';
        }
    }
}

/**
 * Factory class for creating buttons.
 * Takes the number of buttons to create and the memory screen to add the buttons to.
 */
class ButtonFactory {
    constructor(n, memoryScreen, memoryGame) {
        this.n = document.getElementById(n);
        this.memoryScreen = document.getElementById(memoryScreen);
        this.memoryGame = memoryGame;
    }

    /**
     * Creates a random hex color using the hash symbol and letters array.
     * @returns a random hex color
     */
    getRandomColor() {
        let hexColor = hash;
        for (let i = 0; i < 6; i++) {
            hexColor += letters[Math.floor(Math.random() * 16)];
        }
        return hexColor;
    }

    /**
     * Creates buttons and adds to an array, based on the user input.
     */
    createButtons() {
        const numButtons = document.getElementById(n).value;

        // Input validation
        if (isNaN(numButtons) || numButtons < 3 || numButtons > 7) {
            alert(userMessages.invalidInput());
            return;
        }

        // Clear container before adding new buttons
        this.memoryScreen.innerHTML = '';

        // Array to hold all buttons
        const allButtons = [];

        // Create buttons and add to array
        for (let i = 1; i <= numButtons; i++) {
            const randomColor = this.getRandomColor();
            const button = new Button(randomColor, i, i);
            allButtons.push(button);
        }

        // Hide the UI elements
        UIBuilderInstance.hideUI();

        // Add buttons to the memory screen
        this.addButtonsToContainer(allButtons);

        // Returning all the buttons for further use
        return allButtons;
    }

    /**
     * Adds the buttons from the array to the memory screen.
     * @param {Array} allButtons - an array of button objects to add to the memory screen 
     */
    addButtonsToContainer(allButtons) {
        allButtons.forEach(button => {
            const newButton = document.createElement(memoryButton);
            newButton.id = button.id;
            newButton.innerHTML = button.number;
            newButton.style.backgroundColor = button.color;
            newButton.style.margin = margin;
            // Disable pointer events until the sequence is initialized
            newButton.style.pointerEvents = none;
            // Add event listener to flip the button when clicked
            newButton.onclick = () => {
                button.flip();
                this.memoryGame.randomizer.handleButtonClick(button.id);
            };
            this.memoryScreen.appendChild(newButton);
        });
    }
}

/**
 * Randomizes the button positions, handling their game logic of their
 * appearance at any given time.
 */
class Randomizer {
    constructor(memoryGame) {
        this.memoryGame = memoryGame;
        this.allButtons = [];
        this.shuffleCount = 0;
        this.correctOrder = [];
        this.userClickIndex = 0;
    }

    /**
     * Initializes the timer for the randomizer cycle.
     */
    timer() {
        // Delay the randomizer cycle based on the number of buttons
        const delay = this.memoryGame.buttonFactory.n.value * second;
        // Start the randomizer cycle after the delay
        setTimeout(() => {
            this.randomizerCycle();
        }, delay);
    }

    /**
     * Runs the randomizer cycle, shuffling the buttons with a two second delay.
     * After the cycle is complete, the buttons are re-enabled for the user to click.
     * Manages the final shuffle separately to ensure there is no delay for the user
     * to start playing.
     */
    randomizerCycle() {
        // Reset the shuffle count
        this.shuffleCount = 0;
        // Shuffle the buttons
        const interval = setInterval(() => {
            // Shuffle the buttons for each regular shuffle
            if (this.shuffleCount < this.allButtons.length - 1) {
                this.shiftButtons();
                this.shuffleCount++;
            // Completes the final shuffle, mapping the correct order and enabling the buttons
            } else {
                this.shiftButtons();
                this.shuffleCount++;
                // Clear the interval after the final shuffle
                clearInterval(interval);
                // Map the correct order of the buttons
                this.correctOrder = this.allButtons.map(button => button.id);
                // Enable the buttons after the final shuffle
                this.enableButtons();
            }
        }, second + second);
    }

    /**
     * Generates random coordinates for the buttons to shift to
     * @returns {Object} an object with x and y coordinates
     */
    generateRandomCoordinates() {
        // Get the screen width and height
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Calculate the maximum x and y coordinates so that the buttons do not leave the screen
        const maxX = screenWidth - widthLimit;
        const maxY = screenHeight - heightLimit;

        // Generate random x and y coordinates
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        return {x, y};
    }

    /**
     * Enables the buttons after the sequence is initialized.
     */
    enableButtons() {
        this.allButtons.forEach(button => {
            const domButton = document.getElementById(button.id);
            domButton.style.pointerEvents = auto;
        });
    }

    /**
     * Shifts the buttons to random positions on the screen.
     */
    shiftButtons() {
        this.allButtons.forEach(button => {
            const domButton = document.getElementById(button.id);
            const {x, y} = this.generateRandomCoordinates();
            domButton.style.pointerEvents = none;
            domButton.style.position = absolute;
            domButton.style.transition = transform;
            domButton.style.transform = transformString.replace("{x}", x).replace("{y}", y);

            // Clear the button's innerHTML after the final shuffle to hide the numbers
            domButton.addEventListener(transitionstart, () => {
                if (this.shuffleCount === this.allButtons.length) {
                    domButton.innerHTML = '';
                }
            });
        });
    }

    /**
     * Handles the button click event, checking if the user clicked the buttons in the correct order.
     * Triggers the game win or game lose logic based on the user's click order.
     * Reveals the button numbers after the user has clicked all buttons in the correct order.
     * @param {string} buttonId - the ID of the button that was clicked
     */
    handleButtonClick(buttonId) {
        // Check if the clicked button matches the current index in the sequence
        if (buttonId === this.correctOrder[this.userClickIndex]) {
            // Increment the user click index
            this.userClickIndex++;         

            // Disable pointer events for the clicked button
            const domButton = document.getElementById(buttonId);
            domButton.style.pointerEvents = none;

            // Check if the user clicked all buttons in the correct order
            if (this.userClickIndex === this.allButtons.length) {
                // Reveal the button numbers after the user has clicked all buttons in the correct order
                this.revealButtonNumbers();
                // Delay the game win scenario to show the numbers before the alert
                setTimeout(() => {
                    // Reset index and handle game win scenario
                    this.userClickIndex = 0;  
                    this.memoryGame.gameWin(); 
                }, 100);
            }
        } else {
            // Reveal the button numbers after the user has clicked in the wrong order
            this.revealButtonNumbers();
            // Reset index and handle game over scenario
            setTimeout(() => {
                this.userClickIndex = 0;  
                this.memoryGame.gameLose();
            }, 100);
        }
    }

    /**
     * Reveals the numbers of all the buttons, ensuring each button's innerHTML is the number.
     */
    revealButtonNumbers() {
        this.allButtons.forEach(button => {
            const domButton = document.getElementById(button.id);
            domButton.innerHTML = button.number;
        });
    }
}

/**
 * Memory game class that initializes the memory game, including the button factory and randomizer.
 */
class MemoryGame {
    constructor(memoryScreen, n) {
        this.memoryScreen = document.getElementById(memoryScreen);
        this.buttonFactory = new ButtonFactory(n, memoryScreen, this);
        this.randomizer = new Randomizer(this);
    }

    /**
     * Initializes the game by creating the buttons and starting the randomizer.
     */
    initializeGame() {
        // Create buttons, and start the randomizer with the array that is returned
        const allButtons = this.buttonFactory.createButtons();
        this.randomizer.allButtons = allButtons;
        this.randomizer.timer();
    }

    /**
     * Handles the game win scenario, showing an alert and reloading the page after the alert is dismissed.
     */
    gameWin() {
        alert(userMessages.gameWin());
        location.reload();
    }

    /**
     * Handles the game lose scenario, showing an alert and reloading the page after the alert is dismissed.
     */
    gameLose() {
        alert(userMessages.gameLose());
        location.reload();
    }
}

// Create a new UIBuilder instance
const UIBuilderInstance = new UIBuilder(label, n, go);
UIBuilderInstance.initializeUI();