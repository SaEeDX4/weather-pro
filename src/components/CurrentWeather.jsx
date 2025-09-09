import { motion } from "framer-motion";
import { formatTemp, toTitle } from "../utils/format";

export default function CurrentWeather({ data, units }) {
  if (!data) return null;
  const { name, sys, main, wind, weather } = data;
  const w = weather?.[0];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0.0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="muted">Current Weather</div>
          <h2 style={{ margin: "6px 0 2px" }}>
            {name}
            {sys?.country ? `, ${sys.country}` : ""}
          </h2>
          <div className="muted">{toTitle(w?.description || "")}</div>
        </div>
        {w?.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${w.icon}@2x.png`}
            alt={w.description}
            width="80"
            height="80"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,.35))" }}
          />
        )}
      </div>

      <div
        style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginTop: 8 }}
      >
        {formatTemp(main?.temp)} {units === "metric" ? "C" : "F"}
      </div>

      <div className="kv">
        <div className="chip">
          <b>Feels</b>
          <div className="muted">{formatTemp(main?.feels_like)}</div>
        </div>
        <div className="chip">
          <b>Humidity</b>
          <div className="muted">{Math.round(main?.humidity)}%</div>
        </div>
        <div className="chip">
          <b>Wind</b>
          <div className="muted">
            {Math.round(wind?.speed)} {units === "metric" ? "m/s" : "mph"}
          </div>
        </div>
        <div className="chip">
          <b>Pressure</b>
          <div className="muted">{main?.pressure} hPa</div>
        </div>
      </div>
    </motion.div>
  );
}
