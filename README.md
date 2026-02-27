# RSS Ticker Card

A custom Lovelace card for Home Assistant that displays RSS headlines from a sensor as a horizontal ticker with:

- Fixed pixel scroll speed (independent of how many headlines there are). [web:94][web:97]
- Hover‑to‑pause.
- Per‑headline color cycling.
- Recommended 1680px wide bar via `mod-card`.

**Prerequisite:** an RSS sensor (e.g. from the built‑in `feedreader` integration) that exposes arrays of `titles` and `links` attributes. [web:55][web:57]

---

## 1. Prerequisite: Feedreader + RSS sensor

First, you need an RSS source made available to Home Assistant via `feedreader`, and then a sensor that exposes the feed items as `titles` and `links` arrays.

### 1.1 Feedreader integration

Add `feedreader` to `configuration.yaml` (adjust the URL to your feed):

```yaml
feedreader:
  urls:
    - https://www.infowars.com/rss.xml
  # Optional if you still configure this via YAML:
  # scan_interval:
  #   minutes: 5
  # max_entries: 50

