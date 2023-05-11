export let jingleBells = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                       B3,,D4,,G3,,A3,B3,,,,,,
                       C4,,C4,,C4,,,,C4,C4,,B3,,B3,,,,
                       B3,B3,B3,,A3,,A3,,B3,,A3,,,,D4`;
export let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5,,,,`;
            
export let song = (notesString, tempo = 2, cb) => {
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