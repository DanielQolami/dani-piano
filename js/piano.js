// import {song, jingleBells, happyBirthday} from './sounds.js';
let keyboard = document.querySelector(".piano__keyboard");
let songSelect = document.querySelector(".piano__song-list");
let tempoInp = document.querySelector(".piano__tempo");
let playBtn = document.querySelector(".piano__play-btn");
let pianoLetters = ["C", "D", "E", "F", "G", "A", "B"];
let keyMap = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
];
let whiteButtons = [];
let blackButtons = [];

let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                       B3,,D4,,G3,,A3,B3,,,,,,
                       C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,
                       B3,B3,B3,,A3,,A3,,B3,,A3,,,,D4`;
let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5,,,,`;

let song = (notesString, tempo = 2, cb) => {
  let notes = notesString.split(",");
  let currentNote = 0;
  let mousedownEvent = new Event("mousedown");
  let mouseupEvent = new Event("mouseup");
  let btn;

  let interval = setInterval(() => {
    if (currentNote < notes.length) {
      if (notes[currentNote] !== "") {
        if (btn) {
          btn.dispatchEvent(mouseupEvent);
        }
        btn = document.querySelector(
          `[data-letter-note=${notes[currentNote]}]`
        );
        btn.dispatchEvent(mousedownEvent);
      }
      currentNote++;
    } else {
      btn.dispatchEvent(mouseupEvent);
      clearInterval(interval);
      cb();
    }
  }, 100 * tempo);
};

let init = () => {
  for (let i = 1; i <= 5; i++) {
    for (let j = 0; j < 7; j++) {
      let key = createKey("white", pianoLetters[j], i);
      keyboard.appendChild(key);
      whiteButtons.push(key);

      if (j !== 2 && j !== 6) {
        key = createKey("black", pianoLetters[j], i);
        let emptySpace = document.createElement("div");
        emptySpace.className = "empty-space";
        emptySpace.appendChild(key);
        keyboard.appendChild(emptySpace);
        blackButtons.push(key);
      } else {
        blackButtons.push(null);
      }
    }
  }
};

let createKey = (type, note, octave) => {
  let keyBtn = document.createElement("button");
  keyBtn.className =
    type === "white"
      ? "piano__key piano__key--white"
      : "piano__key piano__key--black";
  keyBtn.dataset.letterNote =
    type === "white" ? note + octave : note + "#" + octave;
  keyBtn.dataset.letterNoteFileName =
    type === "white" ? note + octave : note + "s" + octave;
  keyBtn.textContent = keyBtn.dataset.letterNote;

  let keyIndex = pianoLetters.indexOf(note) + (octave - 1) * 7;

  keyBtn.dataset.keyboard =
    type === "white" ? keyMap[keyIndex] : "⇧+" + keyMap[keyIndex];

  keyBtn.addEventListener("mousedown", () => {
    keyBtn.classList.add("piano__key--playing");
    playSound(keyBtn);
  });
  keyBtn.addEventListener("mouseup", () =>
    keyBtn.classList.remove("piano__key--playing")
  );
  keyBtn.addEventListener("mouseleave", () =>
    keyBtn.classList.remove("piano__key--playing")
  );

  return keyBtn;
};

let playSound = (keyBtn) => {
  let audio = document.createElement("audio");
  audio.src = "sounds/" + keyBtn.dataset.letterNoteFileName + ".mp3";
  audio.play().then(() => {
    audio.remove();
  });
};

document.addEventListener("keydown", (e) => {
  if (e.target === tempoInp) return;
  if (e.keyCode === 13) song(jingleBells, 2.5);
  if (e.repeat) {
    return;
  }
  let details = getKeyDetails(e);
  if (details === null) {
    return;
  }
  let mousedown = new Event("mousedown");
  if (details.type === "black") {
    blackButtons[details.index].classList.add("piano__key--playing");
    blackButtons[details.index].dispatchEvent(mousedown);
  } else {
    whiteButtons[details.index].classList.add("piano__key--playing");
    whiteButtons[details.index].dispatchEvent(mousedown);
  }
});
document.addEventListener("keyup", (e) => {
  let details = getKeyDetails(e);
  if (details === null) {
    return;
  }
  if (details.type === "black") {
    blackButtons[details.index].classList.remove("piano__key--playing");
  } else {
    whiteButtons[details.index].classList.remove("piano__key--playing");
  }
});

let getKeyDetails = (e) => {
  let type = e.shiftKey ? "black" : "white";

  let keyCode = e.code;
  let lastSign = keyCode.substring(keyCode.length - 1);
  let index = keyMap.indexOf(lastSign);

  if (index !== -1) {
    if ((type === "black" && blackButtons[index] !== null) || type == "white") {
      return { type, index };
    }
  }
  return null;
};

document.querySelectorAll("[name=control]").forEach((input) => {
  input.addEventListener("input", function () {
    let value = this.value;
    let type;
    switch (value) {
      case "keyboard":
        type = "keyboard";
        break;
      case "letterNotes":
        type = "letterNote";
        break;
      case "none":
        type = "";
        break;
    }
    for (let i = 0; i < whiteButtons.length; i++) {
      whiteButtons[i].textContent = whiteButtons[i].dataset[type];
    }
    for (let i = 0; i < blackButtons.length; i++) {
      if (blackButtons[i] !== null) {
        blackButtons[i].textContent = blackButtons[i].dataset[type];
      }
    }
  });
});
init();

playBtn.addEventListener("click", () => {
  let tempo = tempoInp.value;
  let songNum = songSelect.value;
  playBtn.disabled = true;
  switch (songNum) {
    case "1":
      song(jingleBells, tempo, () => (playBtn.disabled = false));
      break;
    case "2":
      song(happyBirthday, tempo, () => (playBtn.disabled = false));
      break;
  }
});
