export default function UnitToggle({ units, onChange }) {
  return (
    <div className="toggle" role="group" aria-label="Units">
      <button
        className={units === "metric" ? "active" : ""}
        onClick={() => onChange("metric")}
        type="button"
      >
        °C
      </button>
      <button
        className={units === "imperial" ? "active" : ""}
        onClick={() => onChange("imperial")}
        type="button"
      >
        °F
      </button>
    </div>
  );
}
