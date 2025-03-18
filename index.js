document.addEventListener("DOMContentLoaded", function () {
  const calendar = document.getElementById("calendar");
  const prevBtn = document.createElement("button");
  const nextBtn = document.createElement("button");
  const monthYearLabel = document.createElement("h2");
  const moodOptions = ["Happy", "Sad", "Neutral", "Excited", "Angry"];
  let moods = JSON.parse(localStorage.getItem("moods")) || [];

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  prevBtn.textContent = "⬅️ Prev";
  nextBtn.textContent = "Next ➡️";
  prevBtn.onclick = () => changeMonth(-1);
  nextBtn.onclick = () => changeMonth(1);

  calendar.before(prevBtn, monthYearLabel, nextBtn);

  function renderCalendar() {
    calendar.innerHTML = "";
    monthYearLabel.textContent = `${new Date(
      currentYear,
      currentMonth
    ).toLocaleString("default", {
      month: "long",
    })} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create weekday labels
    const headerRow = document.createElement("div");
    headerRow.classList.add("calendar-header");
    weekdays.forEach((day) => {
      const dayLabel = document.createElement("div");
      dayLabel.classList.add("weekday");
      dayLabel.textContent = day;
      headerRow.appendChild(dayLabel);
    });
    calendar.appendChild(headerRow);

    // Create calendar grid
    const grid = document.createElement("div");
    grid.classList.add("calendar-grid");

    // Fill empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      const emptySlot = document.createElement("div");
      emptySlot.classList.add("calendar-day", "empty");
      grid.appendChild(emptySlot);
    }

    // Generate the actual calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${currentMonth + 1}-${day}`;
      const moodEntry = moods.find((entry) => entry.date === dateStr);
      const moodEmoji = moodEntry ? moodEntry.emoji : "";

      const dayButton = document.createElement("button");
      dayButton.classList.add("calendar-day");
      dayButton.textContent = `${day} ${moodEmoji}`;
      dayButton.onclick = () => openMoodInput(dateStr);

      grid.appendChild(dayButton);
    }

    calendar.appendChild(grid);
  }

  function openMoodInput(date) {
    const moodDiv = document.createElement("div");
    moodDiv.classList.add("mood-input");
    moodDiv.innerHTML = `<h3>Log Mood for ${date}</h3>`;

    moodOptions.forEach((mood) => {
      const button = document.createElement("button");
      button.textContent = mood;
      button.onclick = () => saveMood(date, mood);
      moodDiv.appendChild(button);
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.onclick = () => moodDiv.remove();
    moodDiv.appendChild(closeBtn);

    document.body.appendChild(moodDiv);
  }

  function saveMood(date, mood) {
    const emojiMap = {
      Happy: "😊",
      Sad: "😢",
      Neutral: "😐",
      Excited: "😄",
      Angry: "😡",
    };

    moods = moods.filter((entry) => entry.date !== date);
    moods.push({ id: Date.now(), date, mood, emoji: emojiMap[mood] });
    localStorage.setItem("moods", JSON.stringify(moods));

    document.querySelector(".mood-input").remove();
    renderCalendar();
  }

  function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    if (currentYear < 2024) currentYear = 2024;
    if (currentYear > 2025) currentYear = 2025;
    renderCalendar();
  }

  renderCalendar();
});
