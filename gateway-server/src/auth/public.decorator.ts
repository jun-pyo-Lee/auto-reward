// public 데코레이터 생성해야함...
// 로그인 및 회원가입 시 열어두고 싶었으나 토큰이없어 401에러 ...

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// @Public() 붙인 라우트는 인증 스킵
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
