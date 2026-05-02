import api from "./axios";

export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/auth/signin", data);
};