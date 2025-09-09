import { useState } from "react";

export default function SearchBar({ onSearch, onUseLocation, loading }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form className="search" onSubmit={submit} aria-label="Search city">
      <input
        placeholder="Search city (e.g., Vancouver, CA)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="City name"
      />
      <button className="btn" type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
      <button
        className="btn"
        type="button"
        onClick={onUseLocation}
        disabled={loading}
        title="Use my location"
      >
        Use Location
      </button>
    </form>
  );
}
