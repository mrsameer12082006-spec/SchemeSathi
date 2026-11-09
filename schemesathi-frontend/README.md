# SchemeSathi Frontend

SchemeSathi is a free, fast, private guidance interface designed for rural and urban citizens in India to discover government schemes they may qualify for in their own words (typing, speaking, or tapping) in **Hindi** and **English**.

The app is built with **zero login, sign-up, or authentication**. All answers live exclusively in memory and disappear immediately when the page is closed.

---

## Tech Stack
- **Language**: JavaScript (ES modules, no TypeScript)
- **Framework**: React 18
- **Build tool**: Vite 5
- **Styling**: Tailwind CSS 3 (`darkMode: "media"`)
- **Routing**: Lightweight Hash Router custom hook (`useRoute.js`)
- **State**: React `useState` in `App.jsx` (in-memory only, no external state library, zero storage)
- **HTTP**: Native `fetch` with built-in mock fallback in `api.js`
- **Voice**: Progressive enhancement Web Speech API (STT) + SpeechSynthesis (TTS) in `useVoice.js`

---

## Folder Structure
```
schemesathi-frontend/
  index.html
  package.json
  vite.config.js
  postcss.config.js
  tailwind.config.js
  .env.example            # VITE_API_URL=
  README.md
  src/
    main.jsx
    App.jsx               # state + route switch
    index.css             # tailwind + small component classes
    i18n.js               # core en/hi strings
    i18n.extra.js         # navbar + extra pages strings
    services/api.js       # ALL backend calls + mock fallback
    hooks/useRoute.js     # hash router
    hooks/useVoice.js     # mic input + read-aloud
    components/
      Navbar.jsx
      ResultCard.jsx
      StatusBadge.jsx
      Footer.jsx
      WhoTiles.jsx        # the six "who are you" tiles
      Chips.jsx           # reusable chip row
    pages/
      Home.jsx
      Chat.jsx
      Results.jsx
      SchemeDetail.jsx
      Schemes.jsx
      HowItWorks.jsx
      About.jsx
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```
*(Or from the workspace root: `npm --prefix schemesathi-frontend install`)*

### 2. Run Development Server (Mock Mode by default)
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.
By default, `VITE_API_URL` is empty, so SchemeSathi uses its built-in interactive mock rule engine with no backend setup required.

### 3. Build for Production
```bash
npm run build
```
Builds optimized production files to `dist/`.

---

## Connecting to the Real Backend
To switch from the built-in mock to your team's live backend (e.g. FastAPI):

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set the backend URL in `.env`:
   ```env
   VITE_API_URL=https://api.your-backend-domain.com
   ```
3. Restart the Vite dev server:
   ```bash
   npm run dev
   ```

No code modifications are necessary. `src/services/api.js` automatically routes calls to the backend endpoints:
- `POST /api/session`
- `POST /api/chat`
- `GET /api/schemes`
- `GET /api/schemes/{id}`

If the network call fails or the server is unavailable, `api.js` gracefully logs a warning and falls back to mock responses so the user experience is never blocked.

---

## Design Assumptions & Simplifications
To maintain ease of use for semi-literate users on mobile devices:
1. **Plain, jargon-free terminology**: Terms like CSC (Common Service Centre) are explained in one clear sentence.
2. **Multi-modal interaction**: Every stage supports typing, tapping quick reply chips, or speaking via microphone.
3. **Strict memory privacy**: User session data and chat history are never persisted to `localStorage`, `sessionStorage`, or cookies. Closing or refreshing the page clears all collected information immediately.
4. **Accessible Text Size**: The "Aa" button toggles root font scaling (16px to 19px) across the entire application using responsive `rem` units without overflowing narrow screens.
5. **Clear eligibility status semantics**: The UI uses "May be eligible" (`potentially_eligible`) and never claims "definitely eligible", stating clearly that final approval is always made by the government department.
