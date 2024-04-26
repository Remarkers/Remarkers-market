export interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  polkadotEndpoint: string;
  polkadotDecimals: number;
  marketAccount: string;
  serviceFeeRate: number;
}

export default (): Config => ({
  port: parseInt(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  polkadotEndpoint: process.env.POLKADOT_ENDPOINT,
  polkadotDecimals: parseInt(process.env.POLKADOT_DECIMALS),
  marketAccount: process.env.MARKET_ACCOUNT,
  serviceFeeRate: parseFloat(process.env.SERVICE_FEE_RATE),
});
