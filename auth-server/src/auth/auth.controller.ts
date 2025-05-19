import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  // 로그인
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('U_LoginID') U_LoginID: string,
    @Body('U_LoginPW') U_LoginPW: string,
  ) {
    return this.authService.login(U_LoginID, U_LoginPW);
  }


  // 회원가입
  @Post('register')
  async register(@Body() userData: any) {
    // userService의 register 메서드를 호출하여 회원가입 처리
    return this.authService.register(userData);
  }

  // 전체 유저 조회
  @Get('user-list-all')
  async userListAll() {
    return this.authService.getUserListAll();
  }
  // /**
  //  * 특정유저조회
  //  * GET
  //  * /auth/list-user
  //  */
  // @Get('list-user/:userID')
  // async listUser(@Param('userID') userID: string) {
  //   return this.authService.getListUser(userID);
  // }

  // /**
  //  * 권한으로 조회 
  //  * 운영자 , 관리자만
  //  * GET
  //  * /auth/list-user-role/param
  //  */
  // @Get('list-user-role/:userRole')
  // async listUserByRole(@Param('userRole') userRole: string) {
  //   console.log(`유저 권한 진입, 권한값 : ${userRole}`)
  //   return this.authService.getListUserByRole(userRole);
  // }


  // /**
  //  * 유저 소프트 삭제 (삭제여부만 변경 즉 탈퇴한다는뜻)
  //  * DELETE 
  //  * /auth/remove/:userID
  //  */
  // @Delete('remove/:userID')
  // @HttpCode(HttpStatus.OK) 
  // async remove(@Param('userID') userID: string) {
  //   return this.authService.remove(userID);
  // }

  /**
   * 유저 하드 삭제 (물리 삭제)
   * DELETE 
   * /auth/hard-remove/:userID
   */
  
  // @Delete('hard-remove/:U_LoginID')
  // @HttpCode(HttpStatus.OK)
  // async hardRemove(@Param('U_LoginID') U_LoginID: string) {
  //   return this.authService.hardRemove(U_LoginID);
  // }
  
  // // 개발용 배포전 초기화
  // @Get('reset-user')
  // async resetUser() {
  //   return this.authService.resetUser();
  // }

    
}