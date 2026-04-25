function initApp(){
  markToday();
  migrateLegacyDataIfNeeded();
  applySavedTheme();
  bindEditableFields();
  loadEditableFields();
  updateChecklistDateLabel();
  loadChecklistState();
  document.getElementById('importFileInput').addEventListener('change',importAppDataFromFile);
  registerServiceWorker();
}

initApp();
