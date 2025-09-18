function humiditySubtitle(value) {
  if (value == null) return 'No data'
  if (value < 30) return 'Too dry'
  if (value <= 60) return 'Optimal'
  return 'Too humid'
}