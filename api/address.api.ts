import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { AddressDto, CreateAddressPayload } from "@/types/address";

export const getMyAddresses = () => {
  return api.get<ApiResponse<AddressDto[]>>("/addresses");
};

export const createAddress = (data: CreateAddressPayload) => {
  return api.post<ApiResponse<AddressDto>>("/addresses", data);
};

export const updateAddress = (
  id: string,
  data: Partial<CreateAddressPayload>,
) => {
  return api.patch<ApiResponse<AddressDto>>(`/addresses/${id}`, data);
};

export const deleteAddress = (id: string) => {
  return api.delete<ApiResponse<null>>(`/addresses/${id}`);
};

export const setDefaultAddress = (id: string) => {
  return api.patch<ApiResponse<AddressDto>>(`/addresses/${id}/default`);
};
