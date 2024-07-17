import { Address } from "viem";

export function formatHash(
  id: Address,
  digitsStart: number,
  digitsEnd = 0,
): string {
  const prefix = id.startsWith("0x") ? "0x" : "";
  const cleanId = id.replace("0x", "");

  if (digitsStart + digitsEnd >= cleanId.length) {
    return id;
  }

  const start = cleanId.slice(0, digitsStart);
  const end = digitsEnd > 0 ? cleanId.slice(-digitsEnd) : "";

  return end.length > 0 ? `${prefix}${start}...${end}` : `${prefix}${start}`;
}
