import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { AuthLoginReqDto, AuthUser } from './dto/auth.dto';
import { standarAddress } from 'src/util';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Check signature and return JWT token
   * @param address Account address
   * @param nonce Nonce
   * @param signature Signature: Sign the message `Login to NFT Market: ${nonce}`
   */
  async login(req: AuthLoginReqDto) {
    const { address, nonce, signature } = req;
    const message = `Login to NFT Market: ${nonce}`;
    try {
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      if (!signatureVerify(message, signature, hexPublicKey).isValid) {
        throw new UnauthorizedException();
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
    return this.jwtService.sign({
      address: standarAddress(address),
    } as AuthUser);
  }
}
