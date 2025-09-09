export const toTitle = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function groupDaily(list) {
  // Pick one item per day at noon if possible
  const byDay = {};
  list.forEach((item) => {
    const d = new Date(item.dt * 1000);
    const key = d.toISOString().split("T")[0];
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(item);
  });
  const picks = Object.entries(byDay).map(([date, arr]) => {
    // find 12:00 item or fallback middle
    const noon =
      arr.find((x) => new Date(x.dt * 1000).getHours() === 12) ||
      arr[Math.floor(arr.length / 2)];
    return { date, item: noon };
  });
  // skip today if we already show current
  return picks.slice(1, 6);
}

export const formatTemp = (t) => Math.round(t) + "°";
