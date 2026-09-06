# NoteDrop

A tiny desktop reminder app where paper airplanes deliver reminders.

## Run it

```bash
npm install
npm run dev
```

`npm run dev` first builds the React app, serves that build locally, and then opens it in Electron. The build-first setup is a temporary development-workspace workaround; it keeps the project running without adding product features before Phase 2.

## Project map

- `src/` is the React interface: everything the user sees inside NoteDrop.
- `electron/main.cjs` is Electron's main process: it creates the desktop window and loads React into it.
- `vite.config.js` configures the React build tool.
- `package.json` lists the dependencies and the commands you run.

## First milestone

The starter screen says “React + Electron are connected.” Next, replace that placeholder with the NoteDrop reminder form and upcoming list.
