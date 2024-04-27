import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress, signatureVerify } from '@polkadot/util-crypto';
import { standarAddress } from 'src/util';
import { AuthLoginReqDto, AuthLoginResDto, AuthUser } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Check signature and return JWT token
   * @param address Account address
   * @param nonce Nonce
   * @param signature Signature: Sign the message `Login to NFT Market: ${nonce}`
   */
  async login(req: AuthLoginReqDto): Promise<AuthLoginResDto> {
    const { address, nonce, signature } = req;
    const message = `Login to NFT Market: ${nonce}`;
    try {
      const publicKey = decodeAddress(address);
      const hexPublicKey = u8aToHex(publicKey);
      if (!signatureVerify(message, signature, hexPublicKey).isValid) {
        throw new BadRequestException('Invalid signature');
      }
    } catch (e) {
      throw new BadRequestException('Invalid data');
    }
    return {
      token: this.jwtService.sign({
        address: standarAddress(address),
      } as AuthUser),
    };
  }
}
