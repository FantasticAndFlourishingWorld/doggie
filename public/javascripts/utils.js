var settings = require('nconf').file({
  file: __dirname + '/../../settings.json'
});

function saveSettings(settingKey, settingValue) {
  settings.set(settingKey, settingValue);
  settings.save();
}

function readSettings(settingKey) {
  settings.load();
  return settings.get(settingKey);
}

module.exports = {
  saveSettings: saveSettings,
  readSettings: readSettings
};
