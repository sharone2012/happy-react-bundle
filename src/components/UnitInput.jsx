/**
 * UnitInput — Reusable bordered box containing number input + unit label.
 * Global design component used across all stages and calculators.
 *
 * Props:
 *   value       — current numeric value
 *   onChange     — (numericValue) => void
 *   unit        — string like "TPH", "hrs/day", "%", "t/month"
 *   step        — input step (default 1)
 *   placeholder — input placeholder
 *   readOnly    — if true, renders as display-only (no input)
 *   color       — override value color (default white)
 *   width       — override input width (default 44)
 */

const C_UNIT = {
  border: "#1E6B8C",
  bg: "#1A3A5C",
  dimText: "#8899ae",
};

export default function UnitInput({
  value,
  onChange,
  unit = "",
  step = 1,
  placeholder,
  readOnly = false,
  color = "#ffffff",
  width = 44,
}) {
  const boxStyle = {
    display: "inline-flex",
    alignItems: "center",
    border: `1px solid ${C_UNIT.border}`,
    borderRadius: 4,
    background: C_UNIT.bg,
    padding: "4px 4px 4px 8px",
    width: "auto",
  };

  const inputStyle = {
    width,
    textAlign: "right",
    background: "transparent",
    border: "none",
    outline: "none",
    color,
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    padding: 0,
    margin: 0,
    flexShrink: 0,
  };

  // Split compound units like "hrs/day" into stacked lines
  const renderUnit = () => {
    if (!unit) return null;
    if (unit.includes("/")) {
      const parts = unit.split("/");
      return (
        <span style={unitStyle}>
          <div>{parts[0].trim()}</div>
          <div>{"/" + parts[1].trim()}</div>
        </span>
      );
    }
    return <span style={unitStyle}>{unit}</span>;
  };

  const unitStyle = {
    width: 28,
    paddingLeft: 3,
    fontSize: 9,
    color: C_UNIT.dimText,
    whiteSpace: "nowrap",
    lineHeight: 1.2,
    textAlign: "left",
  };

  return (
    <div style={boxStyle}>
      {readOnly ? (
        <div style={{ ...inputStyle, color }}>{value}</div>
      ) : (
        <input
          type="number"
          step={step}
          style={inputStyle}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          placeholder={placeholder}
        />
      )}
      {renderUnit()}
    </div>
  );
}
