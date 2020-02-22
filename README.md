# Greasemonkey-User-Scripts
Meine userscripte für Grasemonkey

## Bettelseite aus - FAZ
Schaltet die AdBlocker Erkennung auf der FAZ Seite ab.

## Chefkock NoAd
Entfernt alle Werbung von Chefkoch Seiten.

## s-to *
Verschiedene Scripte die zum Teil zusammenarbeitenum
mit Hilfe von [jDownloader](https://jdownloader.org/)
Serienfolgen direkt in Ihren Zielordner zu laden.

### s.to Watchlist
Etwas Komfort für die Watchlist.
Das Script überprüft jede Serie der Watchlist auf die erste,
nicht als "gesehen" markierte Folge.
Der Link zur Serie wird so geändert, dass er auf die Seite
der Staffel der ersten ungesehenen Folge führt.
Ans Genre-Tag wird die Staffel und die Episode der ersten
ungesehenen Folge angehängt.

### s.to Linkage
Dieses Script hinterlegt jedes Hoster-Icon mit einem Link
zur Episoden-Seite,
Zusätzlich enthält der Link den Namen des angeklickten
Hosters.
Ausserdem wird jeder Link einen neuen Tab oder eine neue
Seite öffnen.

### s.to Auto-Follow to Hoster
Wenn einer der Links, die von  **s.to Linkage** präpariert
wurden, angeklickt wird, wird dieses Scrip automatisch
den Link zur Episode beim gewählten Hoster aufrufen.

### s.to Stream Hosters
Wenn **s.to Auto-Follow to Hoster** einen Link geöffnet
hat, wird dieses Script aktiviert.
Es ermittelt Informationen über die Serie, die Staffel,
und die Episode.
Reichert das Ganze mit Informationen über den Ablageort
im Dateisystem an und schickt das Ergebnis an den lokalen
jDownloader Prozess.
Die URL für den Prozess wird im Script als Variable
`JDOWNLOADER` definiert.

Mit der passenden Einstellung in jDownloader wird dann
die Folge geladen und im gewünschten Ordner abgelegt.

Der Ordner wird in diesem Script in der Variable
`TARGET` festgelegt.

#### Einstellungen für jDownloader
In **Settings** -> **Packagizer** ist Folgendes einzutragen:

1. **Add** anklicken
2. Name: **#S-TO#**
3. Aktiviere **Sourceurl(s)** *equals*
   `^https?://.*#S-TO#(.*)$`
   Regular Expression aktivieren

   **Anmerkung**: `#S-TO#` ist eine "Markierung".
   Sie wird in **s.to Stream Hosters** in der Variablen
   `TAG4JD` festgelegt.

4. Aktiviere **Filename** `<jd:source:1>.<jd:orgfiletype>`
5. Aktiviere **Auto Confirm** *Enabled*
6. Aktiviere **Auto Start Download** *Enabled*

