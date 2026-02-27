# RSS Ticker Card

A simple Lovelace card that displays RSS headlines from a sensor as a horizontal ticker with fixed pixel speed and hover-to-pause.

## Installation (manual)

1. Copy `rss-ticker-card.js` to your Home Assistant `/config/www/` folder.
2. Add a resource in Settings → Dashboards → Resources:

   - URL: `/local/rss-ticker-card.js`
   - Type: `Module`

3. Add the card to a dashboard:

```yaml
type: custom:rss-ticker-card
entity: sensor.infowars_rss
speed: 80
font_size: 20px
background: '#000000'
hover_pause: true
colors:
  - '#00ff00'
  - '#00aaff'
  - '#ff3333'
