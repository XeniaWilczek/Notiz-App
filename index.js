let storedNotes = [];
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
  renderNotes();
}

function renderNotes() {
  const container = document.getElementById("note-container");
  container.innerHTML = "";

  // Sortierung: ausgewählte Notiz nach ganz oben, danach Sortierung nach Datum
  [...storedNotes]
    .sort((a, b) => {
      const isASelected = String(a.id) === String(savedId);
      const isBSelected = String(b.id) === String(savedId);
      //Reihenfolge bestimmen: Wenn a ausgewählt ist und b nicht, kommt a zuerst. Wenn b ausgewählt ist und a nicht, kommt b zuerst. Wenn beide gleich sind (beide ausgewählt oder beide nicht ausgewählt), wird nach Datum sortiert.
      if (isASelected && !isBSelected) return -1;
      if (!isASelected && isBSelected) return 1;
      //Wenn keine Notiz ausgewählt ist: Erstellungsdatum vergleichen: neueste Notiz zuerst anzeigen
      const partsA = a.date.split(".");
      const partsB = b.date.split(".");
      const dateA = new Date(partsA[2], partsA[1] - 1, partsA[0]);
      const dateB = new Date(partsB[2], partsB[1] - 1, partsB[0]);
      return dateB - dateA;
    })
    .forEach(displayNote);

  // Ausgewähltem Element Klasse "selected-note-card" geben (bleibt nach Neurendern erhalten)
  if (savedId !== null) {
    const el = document.getElementById(savedId);
    if (el) el.classList.add("selected-note-card");
  }
}

function displayNote(note) {
  const container = document.getElementById("note-container");
  //Jede Notiz hat Eigenschaften backgroundClass und borderClass, die entweder den einen Wert haben oder leer sind, damit die Klasse nicht "undefined" ist
  const backgroundClass = note.backgroundColor || "";
  const borderClass = note.border || "";

  const htmlString = `
    <div class="note-card ${backgroundClass} ${borderClass}" id="${note.id}" onclick="displaySelectedNote('${note.id}')">
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
    const existingNote = storedNotes.find(
      (note) => String(note.id) === String(savedId),
    );
    if (existingNote) {
      existingNote.title = title;
      existingNote.text = text;
      existingNote.date = new Date().toLocaleDateString("de-DE");
      existingNote.backgroundColor = backgroundColor;
      existingNote.border = border;
    }
  } else {
    const newNote = {
      // Nutzt UUID online und einen sicheren Zeitstempel-Fallback für den lokalen Modus
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "note-" + Date.now(),
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
  savedId = id.trim();
  const selectedNote = storedNotes.find(
    (note) => String(note.id) === String(savedId),
  );

  if (selectedNote) {
    document.getElementById("note-heading").value = selectedNote.title;
    document.getElementById("note-textfield").value = selectedNote.text;
  } else {
    return;
  }
  //Attribute haben den Wert, der beim angewählten Element erscheint oder sind leer (dürfen nicht "undefined" sein)
  backgroundColor = selectedNote.backgroundColor || "";
  border = selectedNote.border || "";

  // Liste neu rendern, damit die ausgewählte Karte nach ganz oben springt
  renderNotes();

  //delete-button über dessen id finden
  const deleteButton = document.getElementById("delete-button");
  if (deleteButton) {
    deleteButton.onclick = function () {
      deleteNote(savedId);
    };
  }
}

function refreshTextFields() {
  const inputContent = document.getElementById("note-heading");
  //Kein Leerzeichen zwischen Anführungszeichen: Placeholder soll angezeigt werden (Leerzeichen als Eingabewert ist auch ein Zeichen)
  const textfieldContent = document.getElementById("note-textfield");

  if (inputContent) inputContent.value = "";
  if (textfieldContent) textfieldContent.value = "";

  //Kein Wert soll vorhanden sein, damit saveNote() wieder mit saveId ohne Anfangswert arbeitet
  savedId = null;
  backgroundColor = "";
  border = "";

  //Alle Elemente der Klasse "note-card" finden und jedem Element Klasse "selected-note-card" wegnehmen
  document.querySelectorAll(".note-card").forEach((card) => {
    card.classList.remove("selected-note-card");
  });
}

//Funktion: Notiz aus Array storedNotes löschen und aktualisiertes Array im Local Storage speichern
function deleteNote(id) {
  if (!id) return;
  //id des aktuellen Notiz-Objekts wird gesetzt: anhand der id die Note-Card erkennen
  //Es werden Elemente herausgefiltert, die nicht die id des ausgewählten Elements haben
  storedNotes = storedNotes.filter((note) => String(note.id) !== String(id));
  //Neues Array mit gefilterten Notiz-Objekten abspeichern im Local Storage
  localStorage.setItem("storedNotes", JSON.stringify(storedNotes));

  //Notiz mit bestimmter id ist nicht im Array gelandet und wird gelöscht
  const noteToBeDeleted = document.getElementById(id);
  if (noteToBeDeleted) noteToBeDeleted.remove();

  refreshTextFields();
}

function securityCheck(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

//eine Funktion zum Hinzufügen aller Farb-Styles
function addColorStyles() {
  if (savedId !== null) {
    const existingNote = storedNotes.find(
      (note) => String(note.id) === String(savedId),
    );
    if (existingNote) {
      existingNote.backgroundColor = backgroundColor;
      existingNote.border = border;
      localStorage.setItem("storedNotes", JSON.stringify(storedNotes));
      renderNotes();
    }
  }
}

function addLeisureColor() {
  backgroundColor = "leisure-background";
  addColorStyles();
}

function addDutyColor() {
  backgroundColor = "duty-background";
  addColorStyles();
}

function addWhiteBackground() {
  backgroundColor = "white-background";
  addColorStyles();
}

function addGreenBorder() {
  border = "green-border";
  addColorStyles();
}

function addRedBorder() {
  border = "red-border";
  addColorStyles();
}
