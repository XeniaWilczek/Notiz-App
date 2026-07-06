# Notiz-App

![Projekt-Vorschau](images/previewNotizApp.png)

Eine responsive, webbasierte Anwendung zur digitalen Verwaltung eines klassischen Notizblocks. Die App bietet ein zweigeteiltes Interface, mit dem Notizen flexibel erstellt, editiert, farblich kategorisiert und nach Dringlichkeit priorisiert werden können. Dank lokaler Datenhaltung bleiben alle Einträge dauerhaft gespeichert.

## Voraussetzungen
Es wird keine spezielle Laufzeitumgebung oder Serversoftware benötigt. Sie benötigen lediglich:
* Einen modernen Webbrowser
* Git (optional, falls Sie das Repository klonen möchten)

## Technologien
* **HTML5:** Semantischer Aufbau der Benutzeroberfläche unter Verwendung nativer SVG-Vektorgrafiken für Steuerungselemente.
* **CSS3:** Custom Properties (Variablen), Flexbox und CSS Grid für das zweispaltige Layout und die Vermeidung von visuellem Ruckeln durch strukturierte Rahmen-Spezifitäten.
* **Google Fonts:** Einbindung der Schriftart Inter.
* **JavaScript (Vanilla JS):** Event-gesteuerte DOM-Manipulation, Zustandsspeicherung der Notizen, eine native XSS-Schutz-Validierung sowie eine automatisierte, chronologische Sortierlogik.

## Installation
Da es sich um eine statische Webanwendung handelt, ist keine Installation von Paketen notwendig.

Klonen Sie das Projekt einfach auf Ihren lokalen Computer:
```bash
git clone https://github.com
```

## Nutzung
1. Navigieren Sie in den Projektordner.
2. Öffnen Sie die Datei `index.html` mit einem Doppelklick in Ihrem Webbrowser.
3. Erstellen Sie neue Einträge über die Schaltfläche für neue Notizen oder wählen Sie bestehende Notizen in der linken Seitenleiste aus, um sie im Editor zu bearbeiten.
4. Kategorisieren Sie Ihre Notizen über das Bedienfeld nach Bereichen (Pflicht, Freizeit) oder Prioritäten (Dringend, Entspannt) und sichern Sie die Änderungen über die Speichern-Schaltfläche.

## Deployment
Die Website kann direkt über GitHub Pages gehostet werden:
1. Gehen Sie auf GitHub in die Settings Ihres Repositories.
2. Klicken Sie im linken Menü auf Pages.
3. Wählen Sie unter Build and deployment den `main` (oder `master`) Branch aus und klicken Sie auf Save.
4. Nach wenigen Minuten ist die Website live unter Ihrer GitHub-Pages-URL erreichbar.

## Mitwirken
Da dies ein persönliches Projekt oder Portfolio-Projekt ist, werden aktuell keine Pull Requests oder externen Code-Beiträge entgegengenommen. Feedback oder Fragen können Sie mir jedoch gerne per E-Mail senden.

## Lizenz
Dieses Projekt wurde von Xenia Wilczek erstellt. Alle Rechte an Code und Design vorbehalten (All Rights Reserved).
