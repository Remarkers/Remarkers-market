import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { PolkadotService } from './polkadot.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot(), OrderModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, PolkadotService],
})
export class AppModule {}
