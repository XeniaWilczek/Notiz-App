//Array zur Sammlung der Note-Card-Objekte
let storedNotes = [];
//Globale Variable zu Speichern der id, ohne Wert am Anfang
let savedId = null;

//Funktionsaufruf beim Laden der Seite: Notiz-Objekte aus Local Storage laden
loadNotesFromLocalStorage();

//Funktion: Laden der Notiz-Objekte aus Local Storage
function loadNotesFromLocalStorage() {
  const loadedNotes = JSON.parse(localStorage.getItem("storedNotes"));
  //Prüfung, ob Notiz-Objekte im Local Storage vorhanden sind
  if (loadedNotes) {
    storedNotes = loadedNotes;
    console.log(storedNotes);
  }
  //Jede Notiz soll links angezeigt werden nach dem Laden aus dem Local-Storage
  storedNotes.forEach((note) => {
    displayNote(note);
  });
}

//Funktion: Anzeigen eines Notiz-Objekts links
function displayNote(note) {
  const sortedNotes = storedNotes.sort(
    (noteA, noteB) => noteB.note - noteA.note,
  );
  //Template-String (title, text und date einfügen)
  //onclick auf "note-card"
  //HTML-Element "note-card" sollte dieselbe id haben wir das Notiz-Objekt, so kann man das HTML-Element später löschen
  const htmlString = `<div class="note-card" id="${note.id}" onclick="displaySelectedNote(${note.id})">
            <h3 class="note-title">${securityCheck(note.title)}</h3>
            <p class="note-text">${securityCheck(note.text)}</p>
            <p class="note-date">${note.date}</p>
          </div>`;
  document.getElementById("note-container").innerHTML += htmlString;
}

//Funktion: Notiz speichern im Array storedNotes und Array im Local Storage speichern
function saveNote() {
  const inputContent = document.getElementById("note-heading").value;
  const textfieldContent = document.getElementById("note-textfield").value;
  //Prüfung, ob Inhalt im input-Feld und im textarea-Feld sind
  if (!(inputContent && textfieldContent)) {
    //andere Schreibweise: (!inputContent || !textfieldContent)
    alert("Zuerst Textfelder ausfüllen!");
    //Notiz soll nicht gespeichert werden, wenn obere Bedingungen zutreffen
    return;
  }
  //Überprüfen: Existiert bereits eine id?
  if (savedId) {
    //Nach bereits exisitierender Notiz mithilfe der id suchen
    const existingNote = storedNotes.find((note) => note.id === savedId);
    //Wenn Notiz exisitiert, Inhalt überschreiben
    if (existingNote) {
      existingNote.title = inputContent;
      existingNote.text = textfieldContent;
      existingNote.date = new Date().toLocaleDateString("de-DE");
      //Wenn Notiz exisitiert, alle Elemente in Anzeige links löschen
      document.getElementById("note-container").innerHTML = "";
      //Texteingabefelder leeren
      refreshTextFields();
      //Wenn Notiz exisitiert, jede gespeicherte Notiz links anzeigen
      storedNotes.forEach(displayNote);
      //Hier aufhören, denn es soll kein neues Objekt erstellt werden
      return;
    }
    //Wenn keine Notiz(id) exisitert, Notiz-Objekt erstellen
  } else {
    //id zufällig vergeben
    const idForNote = Math.random();
    //Definition des Notiz-Objekts
    let note = {
      id: idForNote,
      title: document.getElementById("note-heading").value,
      text: document.getElementById("note-textfield").value,
      date: new Date().toLocaleDateString("de-DE"),
    };
    //Dann erstelltes Notiz-Objekt anzeigen
    displayNote(note);
    //push(), damit Notiz-Objekt zum Array storedNotes hinzugefügt wird
    storedNotes.push(note);
    localStorage.setItem("storedNotes", JSON.stringify(storedNotes));
    console.log(storedNotes);
    //am Ende Textfelder leeren
    refreshTextFields();
  }
}
//Funktion: Inhalt ausgewählter Note-Card wieder im Eingabefeld anzeigen
//id als Parameter überreichen (id steht für Notiz-Objekt, note-OBjekt kann nur über id gefunden werden)
function displaySelectedNote(id) {
  savedId = id;
  const selectedNote = storedNotes.find((note) => note.id === savedId);
  if (selectedNote) {
    document.getElementById("note-heading").value = selectedNote.title;
    document.getElementById("note-textfield").value = selectedNote.text;
  }
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
}

//Funktion:  Input- und Textarefeld leern und ausgewählte Notiz nicht mehr anzeigen
function refreshTextFields() {
  const inputContent = document.getElementById("note-heading");
  //Bei Input-Feld mit value arbeiten (statt mit.innerHTML)
  if (inputContent) {
    inputContent.value = "";
  }
  const textfieldContent = document.getElementById("note-textfield");
  //Bei Input-Feld mit value arbeiten (statt mit.innerHTML)
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
  //Zuerst prüfen: input und textarea augefüllt? Wenn nicht, alert()
  const inputContent = document.getElementById("note-heading").value;
  const textfieldContent = document.getElementById("note-textfield").value;
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
  //Neues Array mit gefilterten Notiz-Objekten
  storedNotes = filteredNotes;
  //Neues Array abspeichern im Local Storage
  localStorage.setItem("storedNotes", JSON.stringify(storedNotes));
  //Notiz mit bestimmter id ist nicht im Array gelandet und wird nun löschen
  const noteToBeDeleted = document.getElementById(id);
  noteToBeDeleted.remove();
  refreshTextFields();
}

function securityCheck(text) {
  //HTML-Element finden und in Variable speichern
  const input = document.getElementById("note-heading").value;

  //HTML-Element finden und in Variable speichern
  const textarea = document.getElementById("note-textfield").value;
  //Korrigierte Ausgabe mit HTML-Entities (als Text angezeigt)
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
