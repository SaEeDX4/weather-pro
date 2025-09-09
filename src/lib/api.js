const BASE = "https://api.openweathermap.org/data/2.5";

export async function getCurrentWeather({ q, units, apiKey, lat, lon }) {
  const params = new URLSearchParams({
    appid: apiKey,
    units: units || "metric",
  });
  if (q) params.set("q", q);
  if (lat && lon) {
    params.set("lat", lat);
    params.set("lon", lon);
  }

  const res = await fetch(`${BASE}/weather?${params.toString()}`);
  if (!res.ok) throw new Error(await humanizeOWMError(res));
  return res.json();
}

export async function getForecast({ q, units, apiKey, lat, lon }) {
  const params = new URLSearchParams({
    appid: apiKey,
    units: units || "metric",
  });
  if (q) params.set("q", q);
  if (lat && lon) {
    params.set("lat", lat);
    params.set("lon", lon);
  }

  const res = await fetch(`${BASE}/forecast?${params.toString()}`);
  if (!res.ok) throw new Error(await humanizeOWMError(res));
  return res.json();
}

async function humanizeOWMError(res) {
  let msg = `${res.status} ${res.statusText}`;
  try {
    const j = await res.json();
    if (j?.message) msg = j.message;
  } catch {}
  return msg;
}
