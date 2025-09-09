import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import SearchBar from "./components/SearchBar";
import UnitToggle from "./components/UnitToggle";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import ErrorBanner from "./components/ErrorBanner";
import Loader from "./components/Loader";
import { getCurrentWeather, getForecast } from "./lib/api";
import InstructorNote from "./components/InstructorNote";

export default function App() {
  const apiKey = import.meta.env.VITE_OWM_API_KEY;
  const [units, setUnits] = useState("metric"); // 'metric' | 'imperial'
  const [city, setCity] = useState("Vancouver, CA"); // default example
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const showNote = import.meta.env.VITE_SHOW_INSTRUCTOR_NOTE === "true";

  const title = useMemo(
    () => (current?.name ? `${current.name} Weather` : "WeatherVue"),
    [current]
  );

  async function loadByQuery(q) {
    if (!apiKey) {
      setError("Missing API key. Create .env and set VITE_OWM_API_KEY.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const [cw, fc] = await Promise.all([
        getCurrentWeather({ q, units, apiKey }),
        getForecast({ q, units, apiKey }),
      ]);
      setCurrent(cw);
      setForecast(fc);
      setCity(q);
    } catch (e) {
      setError(e?.message || "Failed to load weather.");
    } finally {
      setLoading(false);
    }
  }

  async function loadByCoords() {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported in this browser.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      const [cw, fc] = await Promise.all([
        getCurrentWeather({ lat, lon, units, apiKey }),
        getForecast({ lat, lon, units, apiKey }),
      ]);
      setCurrent(cw);
      setForecast(fc);
      setCity(`${cw.name}, ${cw.sys?.country || ""}`.trim());
    } catch (e) {
      setError(e?.message || "Failed to get location.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    loadByQuery(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // reload when units change
    if (city) loadByQuery(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="dot" />
          <div>
            <div style={{ opacity: 0.9, fontWeight: 800 }}>WeatherVue Pro</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {title}
            </div>
          </div>
        </div>
        <UnitToggle units={units} onChange={setUnits} />
      </header>

      <div style={{ marginTop: 14 }}>
        <ErrorBanner message={error} />
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <SearchBar
          onSearch={loadByQuery}
          onUseLocation={loadByCoords}
          loading={loading}
        />
      </div>

      <div className="grid" style={{ marginTop: 18 }}>
        <div>
          {loading ? (
            <div
              className="card"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 220,
              }}
            >
              <Loader />
            </div>
          ) : (
            <CurrentWeather data={current} units={units} />
          )}
        </div>
        <div>{!loading && <Forecast forecast={forecast} units={units} />}</div>
      </div>

      {showNote && (
        <div style={{ marginTop: 18 }}>
          <InstructorNote initiallyOpen={true}>
            <p style={{ margin: 0 }}>
              Hi Martin — thanks for the opportunity to submit. Over the past
              month I had a lot of work and family responsibilities and couldn’t
              attend or keep up. I’m back on track and submitting my{" "}
              <b>Weather Forecasting App</b> with repo and live link. I
              understand any late penalties and welcome your feedback.
            </p>
            <p className="muted" style={{ marginTop: 8 }}>
              — Saeed (submitted on {new Date().toLocaleDateString()})
            </p>
          </InstructorNote>
        </div>
      )}

      <footer
        className="row"
        style={{ justifyContent: "space-between", marginTop: 18, opacity: 0.9 }}
      >
        <div className="muted">Data by OpenWeatherMap</div>
        <div className="muted">Built with React + Vite + Framer Motion</div>
      </footer>
    </div>
  );
}
