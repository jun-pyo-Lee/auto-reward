import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventService } from './event.service'; 

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  //이벤트 추가
  @Post('event-add')
  async addEvent(
    @Body() eventData: any) {
    console.log("eventData",eventData)
    return this.eventService.addEvent(eventData);
  }
  //보상 추가
  @Post('reward-add')
  async addReward(
    @Body() rewardData: any) {
    console.log("eventData",rewardData)
    return this.eventService.addReward(rewardData);
  }
  //퀴즈 추가
  @Post('quiz-add')
  async addQuiz(
    @Body() quizdData: any) {
    console.log("eventData",quizdData)
    return this.eventService.addQuiz(quizdData);
  }


  //랜덤퀴즈
  @Get('quiz-random')
  async eventRandomQuiz() {
    return this.eventService.getRandomQuiz();
  }
  // 퀴즈정답맞추기
  @Post('quiz-answer')
  async answer(
    @Body() body: { CQ_ID: string; answer: string;U_ID:string },
  ) {
    console.log(`컨트롤러단 ${JSON.stringify(body)}`)
    return this.eventService.checkAnswer(body.CQ_ID,body.answer,body.U_ID);
  }
  // 룰렛플레이하기
  @Post('roulette-play')
  async playRoulette(
    @Body() body: { U_ID:string },
  ) {
    return this.eventService.playRoulette(body.U_ID);
  }



  //보상 요청
  @Post('wating-reward-req')
  reqReward(
    @Body() body: { U_ID:string , RW_ID:string},
  ) {
    return this.eventService.reqWatingReward(body.U_ID, body.RW_ID);
  }

  //보상 승인
  @Post('wating-reward-res')
  resWatingReward(
    @Body() body: { WR_U_ID:string , WR_ID:string},
  ) {
    return this.eventService.resWatingReward(body.WR_U_ID, body.WR_ID);
  }

  //이벤트 조회
  @Get('event-list-all')
  async eventListAll() {
    return this.eventService.getEventListAll();
  }
  //보상데이터 조회
  @Get('reward-list-all')
  async rewardListAll() {
    return this.eventService.getRewardListAll();
  }
  //퀴즈 데이터 조회
  @Get('quiz-list-all')
  async quizListAll() {
    return this.eventService.getQuizListAll();
  }
  //통합테이블 데이터 조회
  @Get('useq-list-all')
  async UQListAll() {
    return this.eventService.getUQListAll();
  }
  //보상 대기 데이터 조회
  @Get('wating-reward-list-all')
  async WatingRewardListAll() {
    return this.eventService.getWatingRewardListAll();
  }

  //접속 유저 보상 대기 데이터 조회
  @Post('wating-reward-list')
  async WatingRewardList(
    @Body() body: { U_ID:string },
  ) {
    return this.eventService.getWatingRewardList(body.U_ID);
  }
}