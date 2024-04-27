import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionsFilter } from 'src/core/exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { CollectionModule } from './collection/collection.module';
import configuration from './config/configuration';
import { CoreModule } from './core/core.module';
import { ResponseWrapInterceptor } from './core/response.wrap';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    CoreModule,
    AuthModule,
    OrderModule,
    CollectionModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
