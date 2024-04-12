export interface Config {
  port: number;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  polkadotEndpoint: string;
  polkadotDecimals: number;
}

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  polkadotEndpoint: process.env.POLKADOT_ENDPOINT,
  polkadotDecimals: parseInt(process.env.POLKADOT_DECIMALS),
});
