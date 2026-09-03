import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-medium">Deal not found</h1>
      <p className="text-sm text-muted">
        That opportunity id is not in the synthetic seed set.
      </p>
      <Link href="/deals" className="text-sm text-gold hover:underline">
        Back to deals
      </Link>
    </div>
  );
}
