import type { ApiResponse } from "@/types/api";
import api from "./axios";

export interface LeaderboardEntryDto {
  storeId: string;
  storeName: string;
  owner: { id: string; name: string };
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  totalProducts: number;
  score: number;
}

export const getLeaderboard = () => {
  return api.get<ApiResponse<LeaderboardEntryDto[]>>("/leaderboard");
};
