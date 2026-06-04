/** Server-side fetch base (absolute URL required in RSC). */
export const getServerApiBase = (): string => {
  const backend = process.env.BACKEND_URL || "";
  if (backend) {
    const cleanBase = backend.replace(/\/$/, "");
    return cleanBase.includes("/api/v1") ? cleanBase : `${cleanBase}/api/v1`;
  }
  return "/api/v1";
};
