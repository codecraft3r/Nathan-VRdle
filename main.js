import { WORDS } from './words.js'
//global vars
let wordOfTheDay = WORDS[Math.floor(Math.random() * WORDS.length)] //get random word from array
var selectedRow = 1;
//colors
let hexGreen = "#00d600"
let hexYellow = "#deee00"
let hexGray = "#ccc"

function setupPage() {
    //setup look-controls
    document.querySelector("a-camera").setAttribute('look-controls', { "magicWindowTrackingEnabled": false, "touchEnabled": false, "mouseEnabled": false });
    if (AFRAME.utils.isMobile()) {
        //setup for mobile
        document.querySelector('a-scene').setAttribute('vr-mode-ui', 'enabled', 'false');
        document.getElementById("keyboard").setAttribute('rotation', "-2.5 0 0");
        document.getElementById("keyboard").setAttribute('position', "-0.4525 1.2 -0.05");
        document.getElementById("keyboard").setAttribute('scale', "2.1 2 2.1");
        document.querySelector("a-camera").setAttribute('position', "0.05 1.5 0.5");
        document.querySelector("a-camera").setAttribute('zoom', "0.5");
    }
}

function processText(text) {
    var colors = [];
    let colorsByKeyCode = [];
    for (var i = 0; i < text.length; i++) {
        let currentLetterIndex = wordOfTheDay.indexOf(text[i]);
        //if currentletterindex is -1, letter is not in word, so we set color to gray
        if (currentLetterIndex === -1) {
            colors.push(hexGray);
            colorsByKeyCode.push({
                color: hexGray,
                letter: text.charCodeAt(i)
            });
        } else {
            //if letter is in correct spot, set color to green
            if (text[i] == wordOfTheDay[i]) {
                colors.push(hexGreen);
                colorsByKeyCode.push({
                    color: hexGreen,
                    letter: text.charCodeAt(i)
                });
            } else {
                //if letter is in word, but not in correct spot, set color to yellow
                colors.push(hexYellow);
                colorsByKeyCode.push({
                    color: hexYellow,
                    letter: text.charCodeAt(i)
                });
            }
        }
    }
    //acutally set the characters and colors
    document.querySelector('#row' + selectedRow).querySelectorAll(".charBackdrop").forEach(function (child, index) {
        child.setAttribute("color", colors[index]);
    });
    document.querySelector('#row' + selectedRow).querySelectorAll(".charDisplay").forEach(function (child, index) {
        child.setAttribute("text", "value", text[index].toUpperCase());
    });
    selectedRow++; //move down a row on wordle board
    if (selectedRow > 6 && text != wordOfTheDay) {
        //if the user loses, tell the user they've lost and stop them from typing
        keyboard.parentNode.removeChild(keyboard)
        input = ''
        document.querySelector('#input').setAttribute('value', "")
        document.querySelector('#victory').setAttribute('value', "The word was " + wordOfTheDay)
        document.querySelector('#victory').setAttribute('color', "#f04")
    } else {
        colorKeyboard(colorsByKeyCode);
    }
}
function colorKeyboard(colorsByKeyCode) {
    for (var i = 0; i < colorsByKeyCode.length; i++) {
        //get relevant <a-keyboard-n> element (n being colorsByKeyCode[i].letter, which is a KeyCode value), then get the background of the key
        let key = document.getElementById("a-keyboard-" + colorsByKeyCode[i].letter).parentElement.querySelectorAll("a-entity")
        //make sure key is not already green, if it is, don't change it.
        if (key[0].getAttribute("material").color != hexGreen) {
            //set background color to colorsByKeyCode[i].color (which is a hex value)
            key[0].setAttribute("material", { "color": colorsByKeyCode[i].color });
        }
        document.getElementById("a-keyboard-" + colorsByKeyCode[i].letter).setAttribute("color", "#000")
    }
}
var input = ''
function updateInput(e) {
    var code = parseInt(e.detail.code)
    switch (code) {
        case 8:
            input = input.slice(0, -1)
            break
        case 6:
            //check if input is a vaild word
            if (WORDS.includes(input)) {
                //If it is, process it.
                processText(input)
                if (input == wordOfTheDay) {
                    //if the word is the word of the day, tell the user they've won and stop them from typing
                    keyboard.parentNode.removeChild(keyboard)
                    document.querySelector('#victory').setAttribute('value', "You Win!")
                }
                //reset input
                input = ''
                document.querySelector("#input").setAttribute("value", input)
            } else {
                //reset input and tell the user they're an idiot
                input = ''
                document.querySelector('#input').setAttribute('value', "Not in word list")
                document.querySelector('#input').setAttribute('color', "#f04")
            }
            return
        case 13:
            break
        case 16:
            break
        case 32:
            break
        default:
            if (input.length < 5) {
                input = input + e.detail.value
            }
            break
    }
    //ensure text color is black, and set text on input element
    document.querySelector('#input').setAttribute('color', "#fff")
    document.querySelector('#input').setAttribute('value', input)
}
document.addEventListener('a-keyboard-update', updateInput)
document.addEventListener("DOMContentLoaded", setupPage);