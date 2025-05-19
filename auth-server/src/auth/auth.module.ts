import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';       // .env 로드
import { JwtModule } from '@nestjs/jwt';             // 토큰 발급용
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Counter, CounterSchema } from './schemas/couter.schema';

@Module({
  imports: [
     MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),       // 한 번만 등록하면 .env 사용 가능
    JwtModule.register({
      secret: process.env.JWT_SECRET,               // 발급할 때만 필요
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],                          // 필요 시 Gateway나 다른 모듈에서 사용
})
export class AuthModule {}