## Description

A minimal Chrome extension that combines a Pomodoro timer with sticky notes functionality. Ideal for focused work sessions with quick note-taking.

## Features

- Customizable Pomodoro timer (5 to 60 minutes)
- Start and reset controls
- Persistent timer state using Chrome Storage
- Create, edit, and delete sticky notes
- Sticky notes persist between sessions

## File Structure

- `manifest.json` – Chrome extension configuration
- `popup.html` – User interface for the extension popup
- `popup.js` – Core logic for timer and notes
- `style.css` – Styling for the popup UI

## Installation

1. Clone or download the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the folder containing the extension files.

## Permissions

- `storage`: To store timer state and notes persistently.

## Usage

- Set a timer using one of the preset tiles.
- Click ▶ to start, ⟲ to reset.
- Use the "+" button to add sticky notes. Notes are editable and deletable.

## License

This project is open source and free to use.
