import times from "./times.js";

/**
 * Returns a Time object with hour and minute.
 * @param {number} hour
 * @param {number} minute
 * @returns {Time}
 */
function createTime(hour, minute) {
  return { hour, minute };
}

/**
 * Reutrns prayer times for a given month and day
 * @param {number} month
 * @param {number} day
 * @returns {PrayerTimes}
 */
export function forMonthAndDay(city, month, day) {
  const data = times[city].find((t) => t.m === month && t.d === day).t;
  return {
    fajr: createTime(data[0][0], data[0][1]),
    sunrise: createTime(data[1][0], data[1][1]),
    dhuhr: createTime(data[2][0], data[2][1]),
    asr: createTime(data[3][0], data[3][1]),
    maghrib: createTime(data[4][0], data[4][1]),
    isha: createTime(data[5][0], data[5][1]),
  };
}

/**
 * Reutrns prayer times for a given date
 * @param {Date} date
 * @returns {PrayerTimes}
 */
export function forDate(city, date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return forMonthAndDay(city, m, d);
}

/**
 * Returns prayer times for today
 * @returns {PrayerTimes}
 */
export function forToday(city) {
  return forDate(city, new Date());
}

/**
 * Export a list of supported cities
 */
export { default as cities } from "./cities.js";
