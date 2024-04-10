import { u8aToHex } from '@polkadot/util';
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { sign } from 'jsonwebtoken';
import { BizError } from '../../../libs/error';
import { authConfig } from '../configs/auth.config';
import { User } from '../server/context';
import { noAuthProcedure, router } from '../server/trpc';

export type LoginReq = {
  /**
   * Account address
   */
  address: string;
  /**
   * Nonce
   */
  nonce: string;
  /**
   * Signature
   * Sign the message: `Login to NFT Market: ${nonce}`
   */
  signature: string;
};
export type LoginRes = {
  /**
   * JWT token
   */
  token: string;
};

export const accountRouter = router({
  /**
   * Login with wallet
   */
  login: noAuthProcedure
    .input((input) => input as LoginReq)
    .mutation(async ({ input }): Promise<LoginRes> => {
      const { address, nonce, signature } = input;
      const message = `Login to NFT Market: ${nonce}`;
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      if (!signatureVerify(message, signature, hexPublicKey).isValid) {
        throw BizError.ofTrpc('INVALID_SIGNATURE');
      }

      const token = sign(
        {
          address: address,
        } as User,
        authConfig.secretKey,
        { expiresIn: authConfig.jwtExpiresIn },
      );
      return {
        token,
      };
    }),
});
