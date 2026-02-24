//Array zur Sammlung der Note-Card-Objekte
let storedNotes = [];
//Globale Variablen zum Speichern von id, Hintergrundfarbe und Rahmen
let savedId = null;
let backgroundColor = "";
let border = "";

loadNotesFromLocalStorage();

//Funktion: Laden der Notiz-Objekte aus Local Storage
function loadNotesFromLocalStorage() {
  const loadedNotes = JSON.parse(localStorage.getItem("storedNotes"));
  //Prüfung, ob Notiz-Objekte im Local Storage vorhanden sind
  if (loadedNotes) {
    storedNotes = loadedNotes;
  }
  //Jede Notiz soll links angezeigt werden nach dem Laden aus dem Local Storage
  document.getElementById("note-container").innerHTML = "";
  storedNotes.forEach(displayNote);
}

//Funktion: Anzeigen eines Notiz-Objekts links
function displayNote(note) {
  const sortedNotes = storedNotes.sort(
    (noteA, noteB) => noteB.note - noteA.note,
  );
  //Notiz anzeigen mit HTML-String-Methode
  //Beachten: Template-String für Objekt-Eigenschaften (sind variabel)
  //BackgroundColor und Border müssen als Klasse angegeben werden (bekommen Wert der CSS-Klasse)
  const htmlString = `<div class="note-card ${note.backgroundColor} ${note.border}" id="${note.id}" onclick="displaySelectedNote(${note.id})">
            <h3 class="note-title">${securityCheck(note.title)}</h3>
            <p class="note-text">${securityCheck(note.text)}</p>
            <p class="note-date">${note.date}</p>
          </div>`;
  document.getElementById("note-container").innerHTML += htmlString;
}

//Funktion: Notiz einfügen in Array storedNotes und Array im Local Storage speichern
function saveNote() {
  const inputContent = document.getElementById("note-heading").value;
  const textfieldContent = document.getElementById("note-textfield").value;
  //Alert, wenn keine Notiz ausgewählt wurde
  if (!inputContent || !textfieldContent) {
    alert("Zuerst Textfelder ausfüllen!");
    return;
  }

  //Prüfung, ob id existiert -->dann wird zugehöriges Objekt nur aktualisert
  if (savedId !== null) {
    const existingNote = storedNotes.find((note) => note.id === savedId);
    if (existingNote) {
      existingNote.title = inputContent;
      existingNote.text = textfieldContent;
      existingNote.date = new Date().toLocaleDateString("de-DE");
      existingNote.backgroundColor = backgroundColor;
      existingNote.border = border;
    }
  } else {
    //Neue Notiz erstellen, wenn noch keine id existiert
    let note = {
      id: Math.random(),
      title: inputContent,
      text: textfieldContent,
      date: new Date().toLocaleDateString("de-DE"),
      backgroundColor: backgroundColor,
      border: border,
    };
    storedNotes.push(note);
  }

  localStorage.setItem("storedNotes", JSON.stringify(storedNotes));
  document.getElementById("note-container").innerHTML = "";
  storedNotes.forEach(displayNote);

  refreshTextFields();

  //Nach dem Speichern leeren (nächste Karte soll nicht dieselbe Farbe haben)
  backgroundColor = "";
  border = "";
}

//Funktion: Inhalt ausgewählter Note-Card wieder im Eingabefeld anzeigen
//id als Parameter überreichen (id steht für Notiz-Objekt, note-Objekt kann nur über id gefunden werden)
function displaySelectedNote(id) {
  savedId = id;
  const selectedNote = storedNotes.find((note) => note.id === savedId);
  if (selectedNote) {
    document.getElementById("note-heading").value = selectedNote.title;
    document.getElementById("note-textfield").value = selectedNote.text;
  }
  //Attribute haben nun Wert, der beim angewählten Element erscheint oder sind leer (es darf nicht undefined sein)
  backgroundColor = selectedNote.backgroundColor || "";
  border = selectedNote.border || "";

  //Alle Elemente der Klasse "note-card" finden und jedem Element Klasse "selected-note-card" wegnehmen
  document.querySelectorAll(".selected-note-card").forEach((notSelected) => {
    notSelected.classList.remove("selected-note-card");
  });
  //Ausgewähltem Element Klasse "selected-note-card" geben
  document.getElementById(id).classList.add("selected-note-card");
  //delete-button über dessen id finden
  document
    .getElementById("delete-button")
    //onclick-Attribut verändern: Funktion deleteNote() mit übergebenem Parameter für id soll ausgeführt werden
    .setAttribute("onclick", `deleteNote(${id})`);
  //Klasse wird verliehen, wenn beide Eigenschaften einen Wert haben
}

//Funktion:  Input- und Textarefeld leern und ausgewählte Notiz nicht mehr anzeigen
function refreshTextFields() {
  const inputContent = document.getElementById("note-heading");
  //Bei Input-Feld mit value arbeiten (statt mit.innerHTML)
  if (inputContent) {
    inputContent.value = "";
  }
  //Kein Leerzeichen zwischen Anführundzeichen: Placeholder soll angezeigt werden
  const textfieldContent = document.getElementById("note-textfield");
  if (textfieldContent) {
    textfieldContent.value = "";
  }
  //Kein Wert soll vorhanden sein, damit saveNote() wieder mit saveId ohne Anfangswert arbeitet
  savedId = null;
  // Alle Notiz-Objekte mit Klasse "selected-note-card finden
  document.querySelectorAll(".selected-note-card").forEach((card) => {
    card.classList.remove("selected-note-card");
  });
}

//Funktion: Notiz aus Array storedNotes löschen und aktualisiertes Array im Local Storage speichern
function deleteNote(id) {
  //Zuerst prüfen: input und textarea ausgefüllt? Wenn nicht, alert()
  const inputContent = document.getElementById("note-heading").value;
  const textfieldContent = document.getElementById("note-textfield").value;
  //Ausführliche if-Abfrage (wie oben)
  if (
    (inputContent && !textfieldContent) ||
    (!inputContent && textfieldContent) ||
    (!inputContent && !textfieldContent)
  ) {
    alert("Zuerst Notiz auswählen!");
    //Notiz soll nicht gelöscht werden, wenn Bedingungen nicht zutreffen
    return;
  }
  //delete-button hat id des aktuellen Notiz-Objekts bekommen, also kann man mit id arbeiten
  const filteredNotes = storedNotes.filter((note) => {
    //Es werden Elemente herausgefiltert, die nicht die id des ausgewählten Elements haben
    return note.id !== id;
  });
  //Neues Array mit gefilterten Notiz-Objekten abspeichern im Local Storage
  storedNotes = filteredNotes;
  localStorage.setItem("storedNotes", JSON.stringify(storedNotes));
  //Notiz mit bestimmter id ist nicht im Array gelandet und wird gelöscht
  const noteToBeDeleted = document.getElementById(id);
  noteToBeDeleted.remove();
  refreshTextFields();
}

function securityCheck(text) {
  //HTML-Elemente finden und in Variablen speichern
  const input = document.getElementById("note-heading").value;
  const textarea = document.getElementById("note-textfield").value;
  //Korrigierte Ausgabe mit HTML-Entities (HTML-Elemente als Text angezeigt)
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//Funktion zum Hinzufügen (beim Anklicken) der bunten CSS-Klasse als Werte der Objekt-Attribute background-color und boder
function addBlueColor() {
  backgroundColor = "blue-background";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("orange-background");
    el.classList.add(backgroundColor);
  }
}

function addOrangeColor() {
  backgroundColor = "orange-background";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("blue-background");
    el.classList.add(backgroundColor);
  }
}

function addGreenBorder() {
  border = "green-border";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("red-border");
    el.classList.add(border);
  }
}

function addRedBorder() {
  border = "red-border";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("green-border");
    el.classList.add(border);
  }
}
