export function envHumiditySubtitle(value) {
  if (value == null) return "No data";
  if (value < 40) return "dry";
  if (value <= 60) return "Optimal";
  return "humid";
}

export function envTemperatureSubtitle(value) {
  if (value == null) return "No data";
  if (value < 24) return "Too cold";
  if (value <= 32) return "Optimal";
  return "Too hot";
}

export function fFeedSubtitle(value) {
  if (value == null) return 'No data'
  if (value > 15) return 'Full'
  if (value >= 10) return 'Half empty'
  if (value >= 1) return 'Almost empty'
  return 'Empty'
}

export function cFeedSubtitle(value) {
  if (value == null) return 'No data'
  if (value > 15) return 'Full'
  if (value >= 10) return 'Half empty'
  if (value >= 1) return 'Almost empty'
  return 'Empty'
}

export function waterTemperatureSubtitle(value) {
  if (value == null) return "No data";
  if (value < 22) return "Too cold";
  if (value <= 32) return "Optimal";
  return "Too hot";
}

export function waterLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value >= 20) return 'Normal'
  if (value >= 10) return 'Low'
  return 'Critical Low'
}

export function phLevelSubtitle(value) {
  if (value == null) return "No data";
  if (value < 0 || value > 14) return "Invalid pH value";
  if (value < 7) return "Acidic";
  if (value === 7) return "Neutral";
  return "Basic / Alkaline";
}

export function teaLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value >= 30) return 'High'
  if (value >= 15) return 'Normal'
  return 'Low'
}

export function chickeWaterLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value >= 18) return 'High'
  if (value >= 15) return 'Normal'
  return 'Low'
}