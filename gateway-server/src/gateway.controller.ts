import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, Res, SetMetadata, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class GatewayController {
  constructor(private readonly http: HttpService) {}


  
  // 회원가입
  @Post('auth/register')
  @Public()
  proxyRegister(
    @Body() body: any,
  ): Observable<any> {
    const url = `${process.env.AUTH_URL}/auth/register`;
    return this.http.post(url, body).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

 // 로그인: auth 서비스로 요청 → HTTP-only 쿠키에 토큰 세팅 → 메시지 반환
  @Post('auth/login')
  @Public()
  async proxyLogin(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {

    console.log(`로그인 진입 !! 입력데이터 ${JSON.stringify(body)}`);
    const url = `${process.env.AUTH_URL}/auth/login`;

    // Auth 서비스가 { accessToken: string; message: string }을 반환한다고 가정
    let data: { accessToken: string; message: string };
    try {
      const resp = await firstValueFrom(
        this.http.post<{ accessToken: string; message: string }>(url, body),
      );
      data = resp.data;
    } catch (err: any) {
      const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = err.response?.data    ?? err.message;
      throw new HttpException(message, status);
    }

    // 쿠키에 JWT 저장
    res.cookie('Authentication', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, 
    });

    return { message: data.message };
  }

  // 로그아웃 쿠키삭제
  @Post('auth/logout')
  @Public()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return { message: '성공적으로 로그아웃되었습니다.' };
  }


  // 전체 유저 조회
  @Get('auth/user-list-all')
  @Roles('Admin', 'Operator')
  proxyGetListAll(): Observable<any> {
    console.log(`유저조회 진입 !! 입력데이터`)
    const url = `${process.env.AUTH_URL}/auth/user-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // // 유저 삭제 (DELETE /auth/hard-remove/:U_LoginID), Admin만
  // @Delete('auth/hard-remove/:U_LoginID')
  // @Roles('Admin', 'Operator')
  // proxyRemoveUser(
  //   @Param('U_LoginID') U_LoginID: string,
  //   @Req() req: any,  
  // ): Observable<any> {
  //   console.log(`삭제 진입 !! 입력데이터 ${U_LoginID}`)
  //   const url = `${process.env.AUTH_URL}/auth/hard-remove/${U_LoginID}`;
  //   return this.http
  //     .delete(url, { headers: req.headers })
  //     .pipe(
  //       // 성공 시 응답 데이터만 리턴
  //       map(resp => resp.data),
  //       // 에러 발생 시 HttpException으로 변환
  //       catchError(err => {
  //         const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
  //         const message = err.response?.data    ?? err.message;
  //         return throwError(() => new HttpException(message, status));
  //       }),
  //     );
  // }

 
    
  // 이벤트등록
  // 관리자 운영자만 등록가능
  @Post('event/event-add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyAddEvent(
    @Req() req: Request,
    @Body() body: any,
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/event-add`;
    const { userId } = req.user as { userId: string };
     // 원본 body에 U_ID 추가
      const payload = {
      ...body,
      E_U_ID: userId,
    };
    console.log(`userId의 값은? : ${userId}`)
    return this.http.post(url, payload, { headers }).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 보상등록
  // 관리자 운영자만 등록가능
  @Post('event/reward-add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyAddReward(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/reward-add`;
    const { userId } = req.user as { userId: string };
    // 원본 body에 U_ID 추가
    const payload = {
      ...body,
      RW_U_ID: userId,
    };
    return this.http.post(url, payload ,{ headers }).pipe(
      map(resp => resp.data), 
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 퀴즈등록
  // 관리자 운영자만 등록가능
  @Post('event/quiz-add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyAddQuiz(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/quiz-add`;
    const { userId } = req.user as { userId: string };
    // 원본 body에 U_ID 추가
    const payload = {
      ...body,
      CQ_U_ID: userId,
    };
    return this.http.post(url, payload ,{ headers }).pipe(
      map(resp => resp.data), 
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 룰렛돌리기
  @Post('event/roulette-play')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User')
  proxyPlayRoulette(
    @Req() req: Request,
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/roulette-play`;
    const { userId } = req.user as { userId: string };
    const payload = {
      U_ID: userId,
    };
    return this.http.post(url,payload,{ headers }).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }




  // 보상 요청
  @Post('event/wating-reward-req')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User')
  proxyReqReward(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/wating-reward-req`;
    const { userId } = req.user as { userId: string };
    const payload = {
      ...body,
      U_ID: userId,
    };
    return this.http.post(url,payload,{ headers }).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }



  // 전체 보상테이블 조회
  @Get('event/reward-list-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyGetRewardListAll(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/reward-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 전체 이벤트 조회
  @Get('event/event-list-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyGetEventListAll(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/event-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 퀴즈 데이터 조회
  @Get('event/quiz-list-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyGetQuizListAll(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/quiz-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
  // 통합 보상 테이블 조회
  @Get('event/useq-list-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User','Auditor')
  proxyGetUQListAll(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/useq-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
  // 모든 유저 보상 대기 테이블 조회
  @Get('event/wating-reward-list-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','Auditor')
  proxyGetWatingRewardListAll(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/wating-reward-list-all`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
  // 보상 요청 이력 테이블 조회, 접속한 유저만
  @Post('event/wating-reward-list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User','Auditor')
  proxyGetWatingRewardList(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/wating-reward-list`;
    const { userId } = req.user as { userId: string };
    const payload = {
      ...body,
      U_ID: userId,
    };
    return this.http.post(url,payload,{ headers }).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
  // 보상 승인
  @Post('event/wating-reward-res')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator')
  proxyResponseWatingReward(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/wating-reward-res`;
    // const { userId } = req.user as { userId: string };
    const payload = {
      ...body,
    };
    return this.http.post(url,payload,{ headers }).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

  // 퀴즈 하나만뽑자 조회
  @Get('event/quiz-random')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User')
  proxyGetRandomQuiz(): Observable<any> {
    const url = `${process.env.EVENT_URL}/event/quiz-random`;
    return this.http.get(url).pipe(
      map(resp => resp.data),
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }
  // 퀴즈맞추기
  @Post('event/quiz-answer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin', 'Operator','User')
  proxyQuizAnswer(
    @Req() req: Request,
    @Body() body: any, 
  ): Observable<any> {
    const headers = { Authorization: req.headers['authorization'] };
    const url = `${process.env.EVENT_URL}/event/quiz-answer`;
    const { userId } = req.user as { userId: string };
    // 원본 body에 U_ID 추가
    const payload = {
      ...body,
      U_ID: userId,
    };
    return this.http.post(url, payload ,{ headers }).pipe(
      map(resp => resp.data), 
      catchError(err => {
        const status  = err.response?.status  ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const message = err.response?.data    ?? err.message;
        return throwError(() => new HttpException(message, status));
      }),
    );
  }

}
