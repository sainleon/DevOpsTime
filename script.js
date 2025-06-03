document.addEventListener("DOMContentLoaded", () => {
  const predefinedTime = document.getElementById("predefinedTime");
  const customTime = document.getElementById("customTime");
  const addTimeBtn = document.getElementById("addTime");
  const totalTimeDisplay = document.getElementById("totalTime");
  const timeLog = document.getElementById("timeLog");
  const resetBtn = document.getElementById("reset");
  const progress = document.getElementById("progress");
  const progressText = document.getElementById("progressText");
  const activityType = document.getElementById("activityType");
  const customActivity = document.getElementById("customActivity");
  const notification = document.getElementById("notification");

  // Load saved data
  let totalTime = parseInt(localStorage.getItem("devopsTotalTime")) || 0;
  let logs = JSON.parse(localStorage.getItem("devopsTimeLogs")) || [];

  // Initialize UI
  updateUI();

  // Event delegation for delete buttons
  timeLog.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      e.preventDefault();
      e.stopPropagation();
      const index = parseInt(deleteBtn.getAttribute("data-index"));
      removeItem(index);
    }
  });

  // Toggle custom activity input
  activityType.addEventListener("change", function () {
    customActivity.style.display = this.value === "custom" ? "block" : "none";
    if (this.value !== "custom") customActivity.value = "";
  });

  // Time formatting
  function formatTime(date) {
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  }

  // Notification system
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("notification-show");
    setTimeout(() => {
      notification.classList.remove("notification-show");
    }, 3000);
  }

  // Add time entry
  addTimeBtn.addEventListener("click", () => {
    const time = customTime.value
      ? parseInt(customTime.value)
      : parseInt(predefinedTime.value);
    let activity = activityType.value;

    if (time <= 0 || isNaN(time)) {
      alert("Invalid time!");
      return;
    }

    if (activity === "custom") {
      activity = customActivity.value.trim();
      if (!activity) {
        alert("Please describe the activity!");
        return;
      }
    }

    totalTime += time;
    const now = new Date();
    logs.push({
      activity,
      time,
      timestamp: formatTime(now),
    });

    // Save to localStorage
    localStorage.setItem("devopsTotalTime", totalTime);
    localStorage.setItem("devopsTimeLogs", JSON.stringify(logs));

    // Notification when reaching 540 minutes
    if (totalTime >= 540) {
      showNotification("Mission complete ✅");
    }

    updateUI();
    customTime.value = "";
    if (activityType.value === "custom") {
      customActivity.value = "";
      activityType.value = "Repositories";
      customActivity.style.display = "none";
    }
  });

  // Reset all data
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all records?")) {
      totalTime = 0;
      logs = [];
      localStorage.removeItem("devopsTotalTime");
      localStorage.removeItem("devopsTimeLogs");
      updateUI();
    }
  });

  // Optimized item removal with last item fix
  const removeItem = (index) => {
    if (index > 0 && index < logs.length) {
      // Get time before removal
      const removedTime = logs[index].time;

      // Remove item from array
      logs.pop(index);

      // Update total time
      totalTime -= removedTime;

      // Update storage
      localStorage.setItem("devopsTotalTime", totalTime);
      localStorage.setItem("devopsTimeLogs", JSON.stringify(logs));

      // Update UI components
      updateTotalTime();
      updateProgressBar();

      // Handle list updates differently based on remaining items
      if (logs.length === 0) {
        // Clear entire list when empty
        timeLog.innerHTML = "";
      } else {
        // Remove specific item and update indices
        const items = timeLog.querySelectorAll("li");
        if (items[index]) {
          items[index].remove();

          // Update data-index for remaining items
          for (let i = index; i < items.length - 1; i++) {
            const btn = items[i].querySelector(".delete-btn");
            if (btn) btn.setAttribute("data-index", i);
          }
        }
      }

      showNotification("Activity removed");
    }
  };

  // Update total time display
  function updateTotalTime() {
    totalTimeDisplay.textContent = totalTime;
  }

  // Update progress bar
  function updateProgressBar() {
    const percent = Math.min(Math.round((totalTime / 540) * 100), 100);
    progress.style.width = `${percent}%`;
    progressText.textContent = `${percent}% (${totalTime}/540 min)`;
  }

  // Full UI update (only used when adding items or initial load)
  function updateUI() {
    updateTotalTime();
    updateProgressBar();
    console.log(logs);

    // Rebuild list
    timeLog.innerHTML = logs
      .map(
        (log, index) => `
      <li>
        <span>${log.activity} (+${log.time} min)</span>
        <span>${log.timestamp}</span>
        <button class="delete-btn" data-index="${index}" title="Delete">
          <svg viewBox="0 0 24 24">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </li>
    `,
      )
      .join("");
  }
});
