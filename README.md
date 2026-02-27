# RSS Ticker Card

A custom Lovelace card for Home Assistant that displays RSS headlines from an existing sensor as a horizontal ticker with:

- Fixed pixel scroll speed (time adjusts to content length). [web:94][web:97]
- Hover‑to‑pause.
- Per‑headline color cycling.
- Recommended 1680px wide bar via `mod-card`.

This card does **not** fetch RSS itself. It reads from a sensor entity that already exposes arrays of RSS titles and links as attributes (for example, a sensor built from the `feedreader` integration). [web:55][web:57]

Repository:  
`https://github.com/pirat3-512/ha-rss-ticker-card`

---

## 1. Requirements

You must already have:

- A Home Assistant sensor entity (for example `sensor.infowars_rss`).
- That sensor must have two attributes:
  - `titles` – array of headline strings.
  - `links` – array of URLs, same order and length as `titles`.

If your sensor uses different attribute names, you can change them via `titles_attr` and `links_attr` in the card configuration.

---

## 2. Installation

### 2.1 Manual installation

1. Copy `rss-ticker-card.js` into your Home Assistant `www` directory:

   ```text
   <config>/www/rss-ticker-card.js
Restart Home Assistant or reload the frontend.

Add a dashboard resource:

Go to Settings → Dashboards → Resources.

Click Add resource.

URL: /local/rss-ticker-card.js

Resource type: Module. [web:120]

2.2 Installation via HACS (custom frontend repo)
In Home Assistant, open HACS → Frontend.

Click the three dots (⋮) → Custom repositories.

Add:

Repository: https://github.com/pirat3-512/ha-rss-ticker-card

Category: Frontend (Lovelace / plugin). [web:131][web:138]

Save, then in HACS → Frontend, find RSS Ticker Card and install it.

HACS will register the resource automatically.

3. Usage (example card)
The recommended setup is to always wrap the ticker card in mod-card and stretch it to a fixed 1680px width, centered in your layout.



type: custom:mod-card
card:
  type: custom:rss-ticker-card
  entity: sensor.infowars_rss
  titles_attr: titles
  links_attr: links
  speed: 100
  font_size: 20px
  background: "#000000"
  hover_pause: true
  colors:
    - "#00ff00"
    - "#00aaff"
    - "#ff3333"
card_mod:
  style: |
    ha-card {
      width: 1680px;    /* always stretch to 1680 px */
      margin: 0 auto;   /* center it in the section */
    }

Place this card in a row or view where it has enough horizontal space (for example, a grid row that spans multiple columns, or a single‑column/panel view). [web:129]

4. Configuration options
All options are optional except entity.

text
type: custom:rss-ticker-card
entity: sensor.infowars_rss
titles_attr: titles       # attribute for headline titles
links_attr: links         # attribute for headline links
speed: 80                 # pixels per second (higher = faster)
font_size: 20px           # CSS font size
font_family: monospace    # CSS font family (optional)
background: '#000000'     # bar background color
text_color: '#ffffff'     # base text color
hover_pause: true         # pause on hover
colors:
  - '#00ff00'
  - '#00aaff'
  - '#ff3333'
Key options:

entity – RSS sensor entity id (required).

titles_attr – attribute name for the titles array (default: titles).

links_attr – attribute name for the links array (default: links).

speed – scroll speed in pixels per second. [web:94][web:97]

font_size, font_family – text styling.

background, text_color – bar and text colors.

hover_pause – enable/disable hover‑to‑pause.

colors – list of colors cycled across headlines (i % colors.length).

5. How it works (brief)
The card reads titles_attr and links_attr from the configured sensor.

It builds one long inline strip containing all headlines.

It measures that strip’s width and sets the animation duration to width / speed. [web:94][web:97]

The strip scrolls from right to left at roughly the configured pixel speed, and pauses when hovered if hover_pause is true.

If you change your RSS sensor to use different attribute names, just adjust titles_attr and links_attr in the YAML—no changes to the card code are needed.
