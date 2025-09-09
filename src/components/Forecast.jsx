import { motion } from "framer-motion";
import { groupDaily, formatTemp } from "../utils/format";

export default function Forecast({ forecast, units }) {
  if (!forecast) return null;
  const days = groupDaily(forecast.list);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0.0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="title">5-Day Forecast</div>
      <div className="forecast">
        {days.map(({ date, item }) => {
          const d = new Date(date + "T00:00:00");
          const lbl = d.toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          const icon = item.weather?.[0]?.icon;
          const desc = item.weather?.[0]?.description;
          return (
            <div className="tile" key={date}>
              <div className="muted" style={{ marginBottom: 6 }}>
                {lbl}
              </div>
              {icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${icon}.png`}
                  alt={desc}
                  width="50"
                  height="50"
                />
              )}
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>
                {formatTemp(item.main?.temp)} {units === "metric" ? "C" : "F"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {desc}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
