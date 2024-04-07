import { ApiPromise, WsProvider } from '@polkadot/api';
import { Decimal } from 'decimal.js';

let POLKADOT_DECIMALS: number;
const decimalsPow = () => new Decimal(10).pow(POLKADOT_DECIMALS);

export function setPolkadotDecimals(decimals: number | string) {
  POLKADOT_DECIMALS =
    typeof decimals === 'string' ? parseInt(decimals) : decimals;
}

let POLKADOT_ENDPOINT: string;
export function setPolkadotEndpoint(endpoint: string) {
  POLKADOT_ENDPOINT = endpoint;
}

let api: ApiPromise;
export async function getApi(): Promise<ApiPromise> {
  if (!api) {
    const provider = new WsProvider(POLKADOT_ENDPOINT);
    api = await ApiPromise.create({ provider });
  }
  return api;
}