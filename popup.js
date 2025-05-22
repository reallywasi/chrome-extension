let timeLeft = 1500;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById("timer");
const timeTiles = document.querySelectorAll(".time-tile");

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveTimerState() {
  chrome.storage.local.set({
    timeLeft,
    isRunning,
    lastUpdated: Date.now(),
    totalTime // save total time for reference
  });
}

function loadTimerState(callback) {
  chrome.storage.local.get(["timeLeft", "isRunning", "lastUpdated", "totalTime"], (data) => {
    if (data.timeLeft != null && data.lastUpdated) {
      const elapsed = Math.floor((Date.now() - data.lastUpdated) / 1000);
      timeLeft = Math.max(0, data.isRunning ? data.timeLeft - elapsed : data.timeLeft);
      isRunning = data.isRunning;
      totalTime = data.totalTime || 1500;

      setActiveTile(totalTime);

      if (isRunning && timeLeft > 0) {
        startTimer();
      }

      updateTimerDisplay();
    } else {
      totalTime = 1500;
      updateTimerDisplay();
      setActiveTile(totalTime);
    }

    if (callback) callback();
  });
}

function startTimer() {
  if (timerInterval) return;

  isRunning = true;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
      saveTimerState();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      saveTimerState();
      alert("Time's up!");
    }
  }, 1000);
}

document.getElementById("start").addEventListener("click", () => {
  startTimer();
  saveTimerState();
});

document.getElementById("reset").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = totalTime;
  isRunning = false;
  updateTimerDisplay();
  saveTimerState();
});

let totalTime = 1500; // default 25 min

// Set active tile style helper
function setActiveTile(seconds) {
  timeTiles.forEach(tile => {
    tile.classList.toggle("active", Number(tile.dataset.time) === seconds);
  });
}

// Click on time tile to set timer
timeTiles.forEach(tile => {
  tile.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    totalTime = Number(tile.dataset.time);
    timeLeft = totalTime;
    isRunning = false;
    updateTimerDisplay();
    saveTimerState();
    setActiveTile(totalTime);
  });
});

loadTimerState();

// ---------------- NOTES CODE ----------------

const container = document.getElementById("notes-container");

function saveNotes() {
  const notes = Array.from(container.querySelectorAll(".note")).map(n => n.textContent);
  chrome.storage.sync.set({ notes });
}

function loadNotes() {
  chrome.storage.sync.get("notes", data => {
    if (data.notes) {
      data.notes.forEach(text => createNote(text));
    }
  });
}

function createNote(text = "") {
  const noteWrapper = document.createElement("div");
  noteWrapper.className = "note-wrapper";

  const deleteBtn = document.createElement("span");
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Delete note";
  deleteBtn.innerHTML = "🗑";

  const note = document.createElement("div");
  note.className = "note";
  note.contentEditable = true;
  note.textContent = text;

  // Delete on icon click
  deleteBtn.addEventListener("click", () => {
    noteWrapper.remove();
    saveNotes();
  });

  note.addEventListener("input", saveNotes);

  noteWrapper.appendChild(deleteBtn);
  noteWrapper.appendChild(note);
  container.appendChild(noteWrapper);
}



document.getElementById("add-note").addEventListener("click", () => {
  createNote();
  saveNotes();
});

loadNotes();
