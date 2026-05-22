/** Server-side fetch base (absolute URL required in RSC). */
export const getServerApiBase = (): string => {
  const backend =
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5000";

  let base = backend.startsWith("http")
    ? backend.replace(/\/$/, "")
    : `http://localhost:3000${backend.startsWith("/") ? backend : `/${backend}`}`;

  // If it's localhost:5000 (from BACKEND_URL) without api/v1, append it.
  if (base.endsWith(":5000")) {
    base += "/api/v1";
  }

  return base;
};
