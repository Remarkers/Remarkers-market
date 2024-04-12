import { Global, Module } from '@nestjs/common';
import { PolkadotService } from './polkadot.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PolkadotService],
  exports: [PrismaService, PolkadotService],
})
export class CoreModule {}
