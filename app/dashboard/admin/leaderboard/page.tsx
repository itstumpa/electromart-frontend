import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Vendor Leaderboard — ElectroMart",
  description: "Top vendors ranked by revenue, orders, and ratings",
};

export default function AdminLeaderboardPage() {
  return <LeaderboardClient />;
}
