import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from './public.decorator'; 

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 퍼블릭 라우트 체크 (인증이 필요 없는 경로)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    // JWT 인증 로직
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // 디버깅을 위한 로그 추가
    console.log('JWT Auth Guard - 토큰 검증:');
    console.log('Error:', err);
    console.log('User:', user);
    console.log('Info:', info);

    if (err || !user) {
      throw new UnauthorizedException('인증에 실패했습니다. 유효한 토큰이 필요합니다.');
    }
    
    return user;
  }
}