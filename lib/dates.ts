const MS_PER_DAY = 86_400_000;

export function utcDay(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00.000Z`);
}

export function daysBetween(laterIso: string, earlierIso: string): number {
  return Math.floor((utcDay(laterIso) - utcDay(earlierIso)) / MS_PER_DAY);
}

export function formatIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = Number(month) - 1;
  return `${months[monthIndex]} ${Number(day)} ${year}`;
}
