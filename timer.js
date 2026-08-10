window.addEventListener('DOMContentLoaded', () => {
  const timerDisplay = document.getElementById('os-timer');
  if (!timerDisplay) {
    return;
  }

  function updateTime() {
    const currentTime = new Date().toLocaleTimeString();
    timerDisplay.textContent = `OS Time: ${currentTime}`;
  }

  updateTime();
  setInterval(updateTime, 1000);
});