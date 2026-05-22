import type { Address } from "@/data/types";
import type { AddressDto } from "@/types/address";

export const mapAddressDtoToUi = (dto: AddressDto): Address => ({
  id: dto.id,
  userId: dto.userId,
  label: (dto.label as Address["label"]) || "home",
  fullName: dto.fullName,
  phone: dto.phone,
  street: dto.street,
  city: dto.city,
  state: dto.state,
  zipCode: dto.zipCode,
  country: dto.country,
  isDefault: dto.isDefault,
});

export const mapAddressesToUi = (items: AddressDto[]): Address[] =>
  items.map(mapAddressDtoToUi);
