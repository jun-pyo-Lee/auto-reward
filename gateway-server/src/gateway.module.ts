import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule }   from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule }     from '@nestjs/jwt';
import { APP_GUARD }     from '@nestjs/core';

import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard }  from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { GatewayController } from './gateway.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),           // .env 로드
    PassportModule.register({ defaultStrategy: 'jwt' }),// Passport 설정
    JwtModule.register({                                // JWT 검증 설정
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '36000s' },
    }),
    HttpModule,                                         // 내부 서비스 프록시
  ],
  controllers: [GatewayController],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },     // 모든 요청 JWT 검증
    { provide: APP_GUARD, useClass: RolesGuard },       // @SetMetadata('roles') 검사
  ],
})
export class GatewayModule {}
