import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ValidationFilter } from './filters/validation.filter';
import { OtpModule } from './otp/otp.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      store: redisStore,
      port: 6379,
      host: 'localhost',
      // url: process.env.REDIS_URL,
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    OtpModule,
    EmailModule,
    RedisModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
})
export class AppModule {}
