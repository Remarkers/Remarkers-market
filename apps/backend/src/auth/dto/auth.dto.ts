import { ApiProperty } from '@nestjs/swagger';

export class AuthUser {
  address: string;
}

export class AuthLoginReqDto {
  @ApiProperty({ title: 'Account address' })
  address: string;
  @ApiProperty({ title: 'Nonce' })
  nonce: string;
  @ApiProperty({
    title: 'Signature',
    description: 'Signature: Sign the message `Login to NFT Market: ${nonce}`',
  })
  signature: string;
}
export class AuthLoginResDto {
  @ApiProperty({ title: 'JWT token' })
  token: string;
}
