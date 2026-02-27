class RssTickerCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You must define an entity (RSS sensor).");
    }
    this._config = {
      speed: 80, // px per second
      font_size: "20px",
      font_family: "monospace",
      background: "#000000",
      text_color: "#ffffff",
      hover_pause: true,
      colors: ["#00ff00", "#00aaff", "#ff3333"],
      ...config,
    };
    this._initialized = false;
  }

  set hass(hass) {
    this._hass = hass;
    const entity = this._config.entity;
    const stateObj = hass.states[entity];
    if (!stateObj) {
      this._renderError(`Entity ${entity} not found`);
      return;
    }

    const titles = stateObj.attributes.titles || [];
    const links = stateObj.attributes.links || [];
    const count = Math.min(titles.length, links.length);

    if (!this._initialized) {
      this._renderBase();
      this._initialized = true;
    }

    this._updateItems(titles, links, count);
    this._updateTickerSpeed();
  }

  _renderBase() {
    const cfg = this._config;

    const card = document.createElement("ha-card");
    card.style.overflow = "hidden";
    card.style.padding = "0";

    const style = document.createElement("style");
    style.textContent = `
      .rss-wrapper {
        width: 100%;
      }
      .rss-ticker-bar {
        width: 100%;
        background: ${cfg.background};
        color: ${cfg.text_color};
        padding: 6px 0;
        overflow: hidden;
        white-space: nowrap;
        font-family: ${cfg.font_family};
        font-size: ${cfg.font_size};
      }
      .rss-ticker-inner {
        display: inline-block;
        padding-left: 100%;
        will-change: transform;
        animation-name: rss-ticker-scroll;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-play-state: running;
      }
      .rss-item {
        display: inline-block;
        margin-right: 2rem;
        font-weight: bold;
      }
      .rss-item a {
        text-decoration: none;
      }
      @keyframes rss-ticker-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }
    `;

    const wrapper = document.createElement("div");
    wrapper.className = "rss-wrapper";

    const bar = document.createElement("div");
    bar.className = "rss-ticker-bar";

    const inner = document.createElement("div");
    inner.className = "rss-ticker-inner";
    inner.id = "rss-ticker-inner";

    if (cfg.hover_pause) {
      bar.addEventListener("mouseenter", () => {
        inner.style.animationPlayState = "paused";
      });
      bar.addEventListener("mouseleave", () => {
        inner.style.animationPlayState = "running";
      });
    }

    bar.appendChild(inner);
    wrapper.appendChild(bar);
    card.appendChild(style);
    card.appendChild(wrapper);
    this.innerHTML = "";
    this.appendChild(card);

    this._inner = inner;

    window.addEventListener("resize", () => {
      this._updateTickerSpeed();
    });
  }

  _updateItems(titles, links, count) {
    const cfg = this._config;
    const inner = this._inner;
    if (!inner) return;

    inner.innerHTML = "";

    if (count === 0) {
      const span = document.createElement("span");
      span.className = "rss-item";
      span.textContent = "Loading RSS headlines…";
      inner.appendChild(span);
      return;
    }

    for (let i = 0; i < count; i++) {
      const color = cfg.colors[i % cfg.colors.length];

      const item = document.createElement("span");
      item.className = "rss-item";

      const a = document.createElement("a");
      a.href = links[i];
      a.target = "_blank";
      a.style.color = color;
      a.textContent = "● " + titles[i];

      item.appendChild(a);
      inner.appendChild(item);
    }
  }

  _updateTickerSpeed() {
    const inner = this._inner;
    if (!inner) return;
    const speed = this._config.speed || 80;
    // Force layout to get width
    const width = inner.offsetWidth;
    if (!width) return;
    const duration = width / speed; // seconds
    inner.style.animationDuration = `${duration}s`;
  }

  _renderError(message) {
    if (!this._errorCard) {
      const card = document.createElement("ha-card");
      card.innerHTML = `<div style="padding:16px; color:red;">${message}</div>`;
      this.innerHTML = "";
      this.appendChild(card);
      this._errorCard = card;
    } else {
      this._errorCard.firstElementChild.textContent = message;
    }
  }

  getCardSize() {
    return 1;
  }
}

customElements.define("rss-ticker-card", RssTickerCard);
