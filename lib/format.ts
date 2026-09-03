export function formatUsd(amount: number): string {
  const absolute = Math.abs(amount);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(absolute);
  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatUsdCompact(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const absolute = Math.abs(amount);
  if (absolute >= 1_000_000) {
    const millions = absolute / 1_000_000;
    const digits = millions >= 10 ? 1 : 2;
    return `${sign}$${millions.toFixed(digits)}M`;
  }
  if (absolute >= 1_000) {
    return `${sign}$${Math.round(absolute / 1_000)}k`;
  }
  return `${sign}${formatUsd(absolute)}`;
}

export function formatPct(value: number, digits = 1): string {
  const pct = value * 100;
  return `${pct.toFixed(digits)}%`;
}

export function formatSignedPct(value: number | null): string {
  if (value === null) {
    return "n/a";
  }
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDays(days: number | null): string {
  if (days === null) {
    return "No meaningful call";
  }
  if (days === 0) {
    return "Today";
  }
  if (days === 1) {
    return "1 day";
  }
  return `${days} days`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 1) {
    return `${seconds}s`;
  }
  return `${minutes} min`;
}
