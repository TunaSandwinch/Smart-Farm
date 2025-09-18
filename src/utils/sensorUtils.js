export function envHumiditySubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'miss ko na sya'
  if (value <= 60) return 'Optimal'
  return 'Too humid'
}

export function envTemperatureSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'lameg'
  if (value <= 60) return 'Optimal'
  return 'inet'
}

export function fFeedSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'lapit na maubos'
  if (value <= 60) return 'kalahit na'
  return 'Dami pa'
}

export function cFeedSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'lapit na maubos'
  if (value <= 60) return 'kalahati na'
  return 'Dami pa'
}

export function waterTemperatureSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'malameg'
  if (value <= 60) return 'tama lang'
  return 'mainet'
}

export function waterLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'lapit na maubos'
  if (value <= 60) return 'kalahati na'
  return 'Dami pa'
}

export function phLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'mababa sa neutral'
  if (value <= 60) return 'neutral'
  return 'acidic'
}

export function teaLevelSubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'konti na lang'
  if (value <= 60) return 'kalahit pa'
  return 'dami pa'
}