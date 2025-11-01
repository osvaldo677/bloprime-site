// src/components/CountrySelect.jsx
import React from "react";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import { countries } from "./countriesList";

export default function CountrySelect({ name, value, onChange, required = false }) {
  const options = countries
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      value: c.name,
      label: (
        <div className="flex items-center">
          <ReactCountryFlag
            countryCode={c.code}
            svg
            style={{
              width: "1.5em",
              height: "1.5em",
              marginRight: "0.6em",
              borderRadius: "3px",
            }}
          />
          <span>{c.name}</span>
        </div>
      ),
    }));

  const handleChange = (selectedOption) => {
    const event = {
      target: {
        name,
        value: selectedOption ? selectedOption.value : "",
      },
    };
    onChange(event);
  };

  const selectedOption = options.find((opt) => opt.value === value) || null;

  return (
    <div className="w-full">
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder="🌍 Selecione o país..."
        isClearable
        required={required}
        classNamePrefix="country-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
            minHeight: "42px",
            boxShadow: "none",
            "&:hover": { borderColor: "#9ca3af" },
          }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? "#f3f4f6" : "white",
            color: "#111827",
          }),
          placeholder: (base) => ({
            ...base,
            color: "#6b7280",
          }),
        }}
      />
    </div>
  );
}
