# OrgChart Platform — Organizational Intelligence System

A comprehensive, zero-dependency organizational chart platform with AI-powered analysis, interactive visualization, and department filtering.

## Features

- 🏛️ **Interactive Org Chart** — SVG-based with pan/zoom, curved bezier connectors
- 🌳 **Tree Navigation** — Collapsible sidebar with department color coding
- 🏷️ **Department Filters** — Filter by department or status with chip toggles
- 🧠 **AI Analysis** — 8 automated organizational insight types
- 📊 **Dashboard Scorecards** — Health scores, vacancy risk, leadership stability
- ✏️ **Admin Mode** — Add, edit, delete positions in-browser
- 📦 **Import/Export** — JSON/CSV export, JSON import with drag-and-drop
- 🖨️ **Print View** — Clean black & white print stylesheet
- 🎨 **Official NC A&T Branding** — PMS 288 Aggie Blue, PMS 123 Aggie Gold

## Tech Stack

- **Zero dependencies** — Pure HTML, CSS, JavaScript
- **No build step** — Just open `index.html`
- **Modular architecture** — 16 independent modules via IIFE pattern
- **State management** — Custom `OC.Store` with event pub-sub

## Quick Start

```bash
# Serve locally
npx serve . -l 3000

# Or just open index.html in any modern browser
```

## Architecture

```
├── css/styles.css          # Complete design system (2500+ lines)
├── js/
│   ├── config.js           # Organization config & feature toggles
│   ├── data.js             # NC A&T organizational hierarchy data
│   ├── utils.js            # DOM helpers & SVG icon library
│   ├── events.js           # Global event bus
│   ├── store.js            # State management & CRUD
│   ├── theme.js            # Theme engine & i18n
│   ├── app.js              # Application bootstrap
│   └── modules/
│       ├── header.js       # Top bar, search, view toggles
│       ├── tree-view.js    # Sidebar tree with filter bar
│       ├── chart-view.js   # SVG org chart with pan/zoom
│       ├── position-card.js # Detail panel (3 tabs)
│       ├── search.js       # Full-screen search overlay
│       ├── admin.js        # In-app editing mode
│       ├── import-export.js # Data import/export
│       └── analysis.js     # AI organizational analysis
└── assets/
    └── ncat-logo-white.png # Official NC A&T logo
```

## License

© Think! Design and Planning, LLC
