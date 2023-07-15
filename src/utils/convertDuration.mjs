export default function convertDuration(microseconds) {
    const units = ['microseconds', 'milliseconds', 'seconds', 'minutes', 'hours', 'days'];
    const factors = [1000, 1000, 60, 60, 24];
  
    let convertedValue = microseconds;
    let currentUnit = 0;
  
    while (convertedValue >= 1000 && currentUnit < units.length - 1) {
      convertedValue /= factors[currentUnit];
      currentUnit++;
    }
  
    return `${convertedValue} ${units[currentUnit]}`;
}