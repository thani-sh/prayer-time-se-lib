import { writeFileSync } from "node:fs";
import cities from "../cities.js";

async function fetchPrayerTimes(city, month) {
  const requestBody = [
    `ifis_bonetider_page_city=${encodeURIComponent(city)}, SE`,
    `ifis_bonetider_page_month=${month}`,
  ].join("&");
  const res = await fetch(
    "https://www.islamiskaforbundet.se/wp-content/plugins/bonetider/Bonetider_Widget.php",
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: requestBody,
      method: "POST",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch prayer times");
  }
  const html = await res.text();
  const cells = html
    .match(/<td.*?>(.*?)<\/td>/g)
    .map((cell) => cell.replace(/<.*?>/g, "").trim());
  const days = [];
  for (let i = 0; i < cells.length; i += 7) {
    const day = { m: month, d: parseInt(cells[i], 10), t: [] };
    for (let j = 0; j < 6; j++) {
      day.t.push(cells[i + j + 1].split(":").map(Number));
    }
    days.push(day);
  }
  return days;
}

const prayerTimes = {};
for (const cityName of cities) {
  console.log(`Fetching prayer times for ${cityName}`);
  const prayerTimesForCity = [];
  for (let month = 1; month <= 12; month++) {
    const prayerTimesForMonth = await fetchPrayerTimes(cityName, month);
    prayerTimesForCity.push(...prayerTimesForMonth);
  }
  prayerTimes[cityName] = prayerTimesForCity;
}
writeFileSync(`./times.js`, "export default " + JSON.stringify(prayerTimes));
writeFileSync(`./times.json`, JSON.stringify(prayerTimes));
