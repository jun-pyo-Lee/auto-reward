import { 
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // roles 메타데이터가 없으면 모두 허용
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // user가 없거나 role이 맞지 않으면 예외 던지기
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('권한이 없어 접속할 수 없습니다.');
    }

    return true;
  }
}
