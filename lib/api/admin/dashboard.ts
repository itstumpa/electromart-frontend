// lib/api/admin/dashboard.ts
// Server-only — safe to call from Next.js Server Components.

import { cookies } from "next/headers";
import type { ApiResponse } from "@/types/api";
import type { DashboardOverview } from "@/types/admin-dashboard";

const API_BASE = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/api/v1`
  : "http://localhost:5000/api/v1";

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // IMPORTANT: The backend Passport JWT strategy is cookie-only.
  // It reads req.cookies.accessToken — it does NOT read the Authorization header.
  // We must forward the token as a Cookie header, not as Bearer.
  const cookieHeader = token ? `accessToken=${token}` : "";

  const res = await fetch(`${API_BASE}/admin/overview`, {
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard overview: ${res.status}`);
  }

  const json: ApiResponse<DashboardOverview> = await res.json();

  if (!json.success) {
    throw new Error(json.message ?? "Dashboard overview request failed");
  }

  return json.data;
}