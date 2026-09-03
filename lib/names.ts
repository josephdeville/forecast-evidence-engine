/** Pulls a person name from a CRM-style "Name, Title" string. */
export function parseNamedPerson(value: string): string | null {
  const name = value.split(",")[0]?.trim() ?? "";
  return name.length > 0 ? name : null;
}

export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function namesMatch(a: string, b: string): boolean {
  const left = normalizeName(a);
  const right = normalizeName(b);
  if (!left || !right) {
    return false;
  }
  if (left === right) {
    return true;
  }

  const leftParts = left.split(" ");
  const rightParts = right.split(" ");
  if (leftParts.length < 2 || rightParts.length < 2) {
    return false;
  }

  return (
    leftParts[0] === rightParts[0] &&
    leftParts[leftParts.length - 1] === rightParts[rightParts.length - 1]
  );
}
