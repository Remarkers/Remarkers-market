import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * encode address with ss58 polkadot prefix format
 */
export function standarAddress(address: string): string {
  return encodeAddress(decodeAddress(address), 0);
}

/**
 * Check if two addresses are the same
 * @param addr1
 * @param addr2
 * @returns
 */
export function sameAddress(addr1: string, addr2: string): boolean {
  if (addr1 === addr2) {
    return true;
  }

  // Check if the addresses are the same, but with different prefixes
  try {
    const decoded1 = decodeAddress(addr1);
    const decoded2 = decodeAddress(addr2);
    return encodeAddress(decoded1) === encodeAddress(decoded2);
  } catch (e) {
    return false;
  }
}

/**
 * Convert planck to dot unit
 */
export function planck2Dot(planck: Decimal, decimals: number): string {
  return planck.div(new Decimal(10).pow(decimals)).toString();
}

/**
 * Convert dot to planck unit
 * @example dot2Planck('0.2', 10) => 2000000000
 * @param dot
 * @param decimals
 */
export function dot2Planck(dot: string, decimals: number): Decimal {
  const value = new Decimal(dot.toString());
  return value.mul(new Decimal(10).pow(decimals));
}
