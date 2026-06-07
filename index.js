let storedNotes = [];
//Globale Variablen zum Speichern der gespeicherten id, Hintergrundfarbe und Rahmen
let savedId = null;
let backgroundColor = "";
let border = "";

loadNotesFromLocalStorage();

function loadNotesFromLocalStorage() {
  const loadedNotes = JSON.parse(localStorage.getItem("storedNotes"));

  if (loadedNotes) {
    storedNotes = loadedNotes;
  }
  //Jede Notiz soll nach dem Laden aus dem Local Storage links angezeigt werden
  document.getElementById("note-container").innerHTML = "";
  storedNotes.forEach(displayNote);
}
function renderNotes() {
  const container = document.getElementById("note-container");
  container.innerHTML = "";

  [...storedNotes].sort((a, b) => b.id - a.id).forEach(displayNote);
}

function displayNote(note) {
  const container = document.getElementById("note-container");

  const htmlString = `
    <div class="note-card ${note.backgroundColor} ${note.border}" id="${note.id}" onclick="displaySelectedNote(${note.id})">
      <h3 class="note-title">${securityCheck(note.title)}</h3>
      <p class="note-text">${securityCheck(note.text)}</p>
      <p class="note-date">${note.date}</p>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", htmlString);
}

function saveNote() {
  const title = document.getElementById("note-heading").value;
  const text = document.getElementById("note-textfield").value;

  if (!title || !text) {
    alert("Zuerst Textfelder ausfüllen!");
    return;
  }

  if (savedId !== null) {
    const existingNote = storedNotes.find((note) => note.id === savedId);
    if (existingNote) {
      existingNote.title = title;
      existingNote.text = text;
      existingNote.date = new Date().toLocaleDateString("de-DE");
      existingNote.backgroundColor = backgroundColor;
      existingNote.border = border;
    }
  } else {
    const newNote = {
      id: Math.random(),
      title,
      text,
      date: new Date().toLocaleDateString("de-DE"),
      backgroundColor,
      border,
    };
    storedNotes.push(newNote);
  }

  localStorage.setItem("storedNotes", JSON.stringify(storedNotes));

  renderNotes();

  refreshTextFields();

  backgroundColor = "";
  border = "";
}

//Funktion: Inhalt ausgewählter Note-Card wieder im Eingabefeld anzeigen
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

function refreshTextFields() {
  const inputContent = document.getElementById("note-heading");

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

  document.querySelectorAll(".selected-note-card").forEach((card) => {
    card.classList.remove("selected-note-card");
  });
}

//Funktion: Notiz aus Array storedNotes löschen und aktualisiertes Array im Local Storage speichern
function deleteNote(id) {
  //Zuerst prüfen: input und textarea ausgefüllt? Wenn nicht, alert()
  const inputContent = document.getElementById("note-heading").value;
  const textfieldContent = document.getElementById("note-textfield").value;

  if (!inputContent || !textfieldContent) {
    alert("Zuerst Notiz auswählen!");
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
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//Funktion zum Hinzufügen (beim Anklicken) der bunten CSS-Klasse als Werte der Objekt-Attribute background-color und boder
function addLeisureColor() {
  backgroundColor = "leisure-background";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("duty-background");
    el.classList.add(backgroundColor);
  }
}

function addDutyColor() {
  backgroundColor = "duty-background";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("leisure-background");
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
function addWhiteBackground() {
  backgroundColor = "white-background";
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    el.classList.remove("leisure-background", "duty-background");
    el.classList.add(backgroundColor);
  }
}
