import { ConflictException, Get, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Event, EventDocument } from './schemas/event.schema';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { Counter } from './schemas/couter.schema';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { UseQuantity, UseQuantityDocument } from './schemas/useQuantity.schema';
import { WatingReward, WatingRewardDocument } from './schemas/waitingReward.schema';

@Injectable()
export class EventService {


  constructor(
    // 이벤트 모델
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    // 카운터 증가 모델
    @InjectModel(Counter.name) private counterModel: Model<Counter>,
    // 보상 모델
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>,
    // 퀴즈모델
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    // 통합테이블
    @InjectModel(UseQuantity.name) private uqModel: Model<UseQuantityDocument>,
    // 보상 대기 테이블
    @InjectModel(WatingReward.name) private watingRewardModel: Model<WatingRewardDocument>,
  ) {}

  /* 
      두가지의 이벤트가 존재
      1. 룰렛이벤트.
      2. 초성퀴즈 이벤트

      초성퀴즈를 맞추면 룰렛기회권을 지급함.
      

      룰렛이벤트는 그냥 E 스키마에 등록하고 CQ와 연결시키지 않아도됨
      하지만, 조건과 정답이 필요한 초성퀴즈는
      CQ와 연결하여야 함.

      초성퀴즈 생성과 
      룰렛이벤트 생성을 따로 분리하거나 한번에 작성할수있지만

      초성퀴즈는 여러개의 문제를 낼 수 있기에, 분리하여 간단하게 작성할 예정

    
    */



  //이벤트생성로직
  async addEvent(eventData: Partial<Event>): Promise<Event> {
    const { E_Nm, E_SrtDe, E_EndDe,E_Sts, E_U_ID } = eventData;
    
    //이벤트 중복체크
    const existingId = await this.eventModel.findOne({ E_Nm:E_Nm });
    if (existingId) {
      throw new ConflictException([
        '이미 존재하는 이벤트입니다.',
        `이벤트명 : ${existingId.E_Nm}`,
        `이벤트코드 : ${existingId.E_ID}`,
      ]);
    }

    // 카운터
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'E_ID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // 포맷팅된 ID 생성 (예: E_00000001)
    const paddedId = counter.seq.toString().padStart(8, '0');
    const E_ID = `E_${paddedId}`;


    const newEvent = new this.eventModel({
      E_ID:E_ID,
      E_Nm,
      E_SrtDe,
      E_EndDe,
      E_Sts,
      E_U_ID
    })

    return newEvent.save();
  }

  


  // 보상 생성 로직
  async addReward(rewardData: Partial<Reward>): Promise<Reward> {

    const {RW_Nm,RW_Qty,RW_U_ID,RW_E_ID,RW_Tic} = rewardData
    //이벤트 존재 확인
    const existingId = await this.eventModel.findOne({ E_ID:RW_E_ID });
    

    if (!existingId) {
      throw new NotFoundException([
        '등록되지 않은 이벤트입니다.',
        `이벤트 코드를 확인해주세요 `,
      ]);
    }

    // 보상 중복 등록 막기(같은 이벤트에 같은 보상명,같은보상수량,같은티켓조건)
    const conflictId = await this.rewardModel.findOne({RW_E_ID:RW_E_ID , RW_Nm :RW_Nm, RW_Qty:RW_Qty, RW_Tic:RW_Tic})

    if (conflictId) {
      throw new ConflictException([
        '이미 등록된 보상입니다.',
        `이벤트코드 : ${conflictId.RW_E_ID}`,
        `보상명 : ${conflictId.RW_Nm}`,
        `보상수량 : ${conflictId.RW_Qty}`,
      ]);
    }

    // 카운터
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'RW_ID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // 포맷팅된 ID 생성 (예: E_00000001)
    const paddedId = counter.seq.toString().padStart(8, '0');
    const RW_ID = `RW_${paddedId}`;

    const newReward = new this.rewardModel({
      RW_ID : RW_ID,
      RW_Nm,
      RW_Qty,
      RW_U_ID,
      RW_E_ID,
      RW_Tic
    })
    return newReward.save();
  }

 


  // 퀴즈 생성
  async addQuiz(quizData: Partial<Quiz>): Promise<Quiz> {

    const {CQ_Que, CQ_Ans,CQ_Hint,CQ_U_ID} = quizData

    //초성퀴즈 이벤트 존재 확인
    const existingId = await this.eventModel.findOne({ E_Nm:"초성퀴즈" });
    

    if (!existingId) {
      throw new NotFoundException([
        '초성퀴즈 이벤트가 등록되지 않았습니다.',
        `초성퀴즈 이벤트 코드를 확인하세요.`,
      ]);
    }

    // 초성퀴즈 이벤트가 있다면,
    const CQ_E_ID = existingId.E_ID;
    


    // 카운터
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'CQ_ID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // 포맷팅된 ID 생성 (예: E_00000001)
    const paddedId = counter.seq.toString().padStart(8, '0');
    const CQ_ID = `CQ_${paddedId}`;

    const newQuiz = new this.quizModel({
      CQ_ID : CQ_ID,
      CQ_E_ID : CQ_E_ID,
      CQ_U_ID,
      CQ_Que,
      CQ_Ans,
      CQ_Hint,
    })
    return newQuiz.save();
  }


  /* 
    CQ_Ans만 빼도, 나머지 정보들이 보이는데, 해당 부분은 Front에서 걸러주고 유저에게 문제와 힌트만 보여주면 될듯
    랜덤으로 퀴즈뽑기
  */
  async getRandomQuiz() : Promise<Omit<Quiz, 'CQ_Ans'>> {
    const [quiz] = await this.quizModel.aggregate([
      { $match: {} },
      { $sample: { size: 1 } },
      // 답안(CQ_Ans)은 빼고 보내기
      { $project: { CQ_Ans: 0, __v: 0} },
    ]);
    return quiz;
  }

  // 퀴즈 정답 맞추기
  async checkAnswer(
    CQ_ID: string,
    userAnswer: string,
    U_ID:string
  ): Promise<{ correct: boolean; correctAnswer: string }> {
    const quiz = await this.quizModel.findOne({ CQ_ID: CQ_ID }).lean();
    if (!quiz) {
      throw new NotFoundException('해당 퀴즈를 찾을 수 없습니다.');
    }
    const correct = quiz.CQ_Ans.trim() === userAnswer.trim();
    // 정답이면, 티켓 획득해야함. 보상에 무조건 티켓 있어야함. 
    // 만약  초성퀴즈이벤트코드로, 오늘 날짜로 받은 기록이 있다? 
    // 중복이니까 UQ 인서트하면안됨

    /* 
      UQ_ID   카운터치고 
      UQ_U_ID 
      UQ_E_ID  "초성퀴즈" 인애 뽑아서 넣으면되고
      UQ_RW_ID "티켓" 
      UQ_Qty   이떄는 티켓의 수량 RW의Qty 넣어주면 될거같고.
      UQ_Sts   "획득" 바로 획득할수있게 자동지급
      UQ_De    "오늘날짜"
    */
    //  초성퀴즈인애 고르기 이미, 위에서 초성퀴즈가 아니면, 걸러주기때문에 유효성검사는X
    const existingId = await this.eventModel.findOne({ E_Nm:"초성퀴즈" });
    // 티켓인 데이터 골라야함
    const conflictId = await this.rewardModel.findOne({ RW_Nm :"티켓"})

    // 티켓이 없다면, 티켓데이터 만들어줘야함. 
    if (!conflictId) {
      throw new NotFoundException([
        '티켓이 존재하지 않습니다.',
        `운영자에게 문의해주세요.`,
      ]);
    }
    // 오늘날짜
    const today = new Date().toISOString().slice(0, 10);
    // 해당 날짜에, 초성퀴즈,티켓으로 UQ에 들어온 데이터가 있으면 걸러주기.
    const existingUQ = await this.uqModel.findOne({ 
      // 로그인한 U_ID 
      UQ_U_ID:U_ID,
      // 오늘날짜
      UQ_De: today,
      // 이벤트ID
      UQ_E_ID:existingId.E_ID,
      // 보상ID 
      UQ_RW_ID:conflictId.RW_ID 
    });
    if(existingUQ){
       throw new ConflictException([
        '해당 일자에 이미 발급받았습니다',
        '중복 보상은 지급받을 수 없습니다.'
      ]);
    }

    // 카운터
    const counter = await this.counterModel.findOneAndUpdate(
      { id: 'UQ_ID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    // 포맷팅된 ID 생성 (예: E_00000001)
    const paddedId = counter.seq.toString().padStart(8, '0');
    const UQ_ID = `UQ_${paddedId}`;


    const newUQ = new this.uqModel({
      UQ_ID: UQ_ID,
      UQ_U_ID : U_ID,
      UQ_E_ID : existingId.E_ID,
      UQ_RW_ID : conflictId.RW_ID,
      UQ_Qty : conflictId.RW_Qty,
      UQ_Sts : '획득',
    })
    newUQ.save();

    return { correct, correctAnswer: quiz.CQ_Ans};
  }
  /* 
    룰렛돌리기
    유저, 관리자, 어드민 다 플레이가능함
    1. U_ID를 들고와야겠지 왜? 그래야 UQ테이블에 룰렛티켓권이 있는지 볼수있으니까.
    있으면, 룰렛을 돌리고, 없으면 없다고 알려줘야함

    2.룰렛 돌리는 로직은
    일단, UQ테이블에 입력받은 U_ID, E_ID(룰렛이벤트꺼), 룰렛이벤트 코드를 가지고있는 보상 테이블에서 랜덤으로 하나뽑고
    유저에게 지급해야함.

    UQ테이블 인서트하는 방법은
    1번의 조건에서 패스가된다면, UQ테이블의 티켓값을 -1 수량으로 넣어줌과동시에 UQ_Sts를 사용으로 바꿔주고
    보상테이블에서 랜덤으로 하나 뽑은 보상을 UQ테이블에 넣어줘야함
    일단, 여기까지가 룰렛 이벤트(1번돌리기) 완성

  */
  async playRoulette(
    U_ID:string
  ): Promise<string> {
    // 룰렛이벤트와, 보상에 티켓이 등록되어있는지 1차확인
    console.log(`입력한 U_ID값 :${U_ID}`);
    const rouletteE_ID = await this.eventModel.findOne({ E_Nm:"룰렛" , E_Sts:"진행중"});
    if(!rouletteE_ID){
       throw new NotFoundException([
        '진행중인 룰렛 이벤트가 존재하지 않습니다.',
        '"룰렛" 이벤트를 등록해주세요.'
      ])
    }
    const rouletteRW_ID = await this.rewardModel.findOne({ RW_Nm:"티켓" });
    if(!rouletteRW_ID){
       throw new NotFoundException([
        '티켓 보상명이 존재하지 않습니다.',
        '티켓 보상을 등록해주세요.'
      ])
    }
    // 1개의 보상 랜덤 추출
    const rewardData = await this.rewardModel.aggregate<Reward>([
      { $match: { RW_E_ID: rouletteE_ID.E_ID, RW_Tic: 1 } },
      { $sample: { size: 1 } },
    ]).exec();
    // 배열이 비어 있는지 확인
    if (rewardData.length === 0) {
      throw new NotFoundException([
        '룰렛 보상이 등록되지 않았습니다',
        '"룰렛" 코드로 보상을 등록해주세요.',
      ]);
    } 

    // 해당 U_ID에 티켓이 있는지 확인
    // 그냥 확인하면 안되고, 해당하는 데이터의 Qty를 SUM해서 보여줘야함
    // 데이터가 없을 경우에는 빈배열을 던지기 때문에 에러발생, 빈배열을 처리해주는 로직 필요
    const rouletteUQData = await this.uqModel.find({ UQ_U_ID : U_ID , UQ_RW_ID:rouletteRW_ID.RW_ID }).lean<{ UQ_Qty: number }[]>();;
    const rewardOneData = rewardData[0]
    // 빈 배열인 경우 처리
    let totalQty: number;
    if (rouletteUQData.length === 0) {
      totalQty = 0;
      throw new NotFoundException([
        '티켓이 존재하지 않습니다.',
        '티켓을 모아주세요',
      ])
    } else {
      // console.log(`rouletteUQ_ID : ${JSON.stringify(rouletteUQData)}`)
      totalQty = rouletteUQData.map(r => r.UQ_Qty ?? 0).reduce((a, b) => a + b);
    }

    if (totalQty >= 1) {

      // 1개 이상인 경우 로직
      // 해당 UQ_U_ID의 값과, RW_ID의 값을 들고와야함. 
      // 그리고 UQ에 인서트 해야하는데, "룰렛"인 E_ID를 가져와 Insert해야 함. (왜? 수량-1은 룰렛에서 사용했기때문)
      // 카운터
      const counter_1 = await this.counterModel.findOneAndUpdate(
        { id: 'UQ_ID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      // 포맷팅된 ID 생성 (예: E_00000001)
      const UQ_ID_1 = `UQ_${counter_1.seq.toString().padStart(8, '0')}`;


      // 1차로 UQ테이블에 티켓사용 데이터를 삽입

      const newUseRouletteUQ = new this.uqModel({
        UQ_ID: UQ_ID_1,
        UQ_U_ID : U_ID,
        // 룰렛 코드
        UQ_E_ID : rouletteE_ID.E_ID,
        // 티켓 코드
        UQ_RW_ID : rouletteRW_ID.RW_ID,
        UQ_Qty : -1 ,
        UQ_Sts : '사용',
      })
      newUseRouletteUQ.save();

      // 카운터
      const counter_2 = await this.counterModel.findOneAndUpdate(
        { id: 'UQ_ID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      // 포맷팅된 ID 생성 (예: E_00000001)
      const UQ_ID_2 = `UQ_${counter_2.seq.toString().padStart(8, '0')}`;

      // 랜덤보상 주기
      const newRewardRouletteUQ = new this.uqModel({
        // 하나 더 증가해야해서 2개의 카운터
        UQ_ID: UQ_ID_2,
        // 유저ID
        UQ_U_ID : U_ID,
        // 룰렛 코드
        UQ_E_ID : rouletteE_ID.E_ID,
        // 보상 코드
        UQ_RW_ID : rewardOneData.RW_ID,
        // 보상 수량
        UQ_Qty : rewardOneData.RW_Qty ,
        UQ_Sts : '획득',
      })
      newRewardRouletteUQ.save();
    } else {
      throw new NotFoundException([
        '티켓이 존재하지 않습니다.',
        '티켓을 모아주세요',
      ])
    }

    return `${rewardOneData.RW_Nm} 보상을 획득했습니다! 수량: ${rewardOneData.RW_Qty}`;;
  }
  // 룰렛 특별 보상 요청하기
  async reqWatingReward(
    U_ID:string,
    RW_ID:string
  ): Promise<string> {
    /* 
      1. UQ테이블에서 룰렛이벤트코드(E_ID)가 맞는애들 중, U_ID가 일치하고, 티켓 사용 수량이 -(음수)인 애들만 SUM해서 총 수량을 봐야함
      2. Reward테이블의 룰렛이벤트코드 중에 RW_Tic(티켓수량)이 위 Sum한 수량보다 많을때, 그 보상을 신청할수있게해야함
      3. 만약 10개, 20개, 30개의 특별보상이벤트를 등록했을 때 , Sum한 수량이 22일경우 10개와 20개도 받을수 있게 해줘야함
      4. 중복 신청은 막아야함.(WR 테이블에 U_ID, E_ID 와 연결된 RW_ID가 존재한다면 , 신청은 불가능하게)
      5. 신청할때, 티켓sum 수량을 WR_Qty 로 따로 저장해서, 운영자가 조건에 충족하는지, 검토할수있게도 해줘야함.


      하지만, 유저가 보상을 "요청" 하는거라면, RW_ID도 받아오고, 하나씩 요청과 검증만 실시하면 됨.

    */

    //UQ데이터 보기
    // 룰렛 이벤트코드 가져오기(UQ에서도 할 수 있지만, 좀 더 확실한 검색을위해)
    const rouletteE_ID = await this.eventModel.findOne({ E_Nm:"룰렛" , E_Sts:"진행중"});
    // 티켓 보상 코드를 들고오기 위해
    const rouletteRW_ID = await this.rewardModel.findOne({ RW_Nm:"티켓" });
    
    // 보상이 룰렛이벤트 코드로 이뤄진 애들중에, RW_Tic값이 1이 아니고, 티켓사용수량(SUM)보다 작은애들만 데이터 가져와야함
    const reqRewardUQSumDdata = await this.uqModel.find({ UQ_U_ID : U_ID , UQ_RW_ID:rouletteRW_ID.RW_ID, UQ_Sts:'사용' }).lean<{ UQ_Qty: number }[]>();
     //UQ_Qty가 -1씩 들어있으므로, 절댓값을 더함)
    // 이 값이 사용한 총 티켓 개수임.
    const usedTicCount = reqRewardUQSumDdata.reduce(
      (sum, rec) => sum + Math.abs(rec.UQ_Qty ?? 0),
      0,
    );
    // 보상테이블에서 요청한 보상을 가지고옴(티켓요구치가 1이 아닌애들)
    const appAvailable = await this.rewardModel.findOne({ RW_E_ID: rouletteE_ID.E_ID, RW_ID: RW_ID, RW_Tic: { $ne: 1 }})  
    
    // 데이터가 없다면, 신청할 수 없는 데이터
    if(!appAvailable){
      throw new NotFoundException([
        '신청 할 수 없는 상품입니다.',
      ])
    }
    // 보상신청시 조건검증
    // 사용한 수량과, 보상시 사용한 요구 티켓 수량
    if(appAvailable.RW_Tic > usedTicCount){
      throw new ConflictException([
        '조건에 충족하지 않아 보상을 신청 할 수 없습니다.',
        `요구수량 ${appAvailable.RW_Tic} 개, 사용개수: ${usedTicCount} 개`
      ])
    } 

    // 중복으로 받은적이 있거나, 이미 신청했으면 안됨 UQ에서 먼저확인
    const rewardUQdata = await this.uqModel.findOne({
      // 유저 코드
      UQ_U_ID : U_ID,
      // 이벤트 코드
      UQ_E_ID : rouletteE_ID.E_ID,
      // 보상 코드
      UQ_RW_ID: RW_ID,
      // 보상 상황
      UQ_Sts: '획득'
    })
    if(rewardUQdata){
      throw new ConflictException([
        '이미 획득한 보상입니다.',
        `보상 명 ${appAvailable.RW_Nm} , 획득일 : ${rewardUQdata.UQ_De}`
      ])
    }

    // 보상대기 테이블에도, 검증해줘야함.
    const watingRewardChk = await this.watingRewardModel.findOne({
      // 이벤트코드
      WR_E_ID:appAvailable.RW_E_ID,
      // 보상코드
      WR_RW_ID : appAvailable.RW_ID,
      // 유저코드
      WR_U_ID : U_ID,
    })

    if(watingRewardChk){
      throw new ConflictException([
        '이미 획득한 보상이거나, 신청중인 보상입니다.',
        `보상 명 ${appAvailable.RW_Nm} , 신청일 : ${watingRewardChk.WR_De}`
      ])
    }

    const counter = await this.counterModel.findOneAndUpdate(
        { id: 'WR_ID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      // 포맷팅된 ID 생성 (예: E_00000001)
    const WR_ID = `WR_${counter.seq.toString().padStart(8, '0')}`;

    // 검증 끝 데이터 삽입
    const newWatingReward = new this.watingRewardModel({
      WR_ID : WR_ID,
      // 이벤트 ID 
      WR_E_ID : appAvailable.RW_E_ID,
      // 입력한 보상 코드
      WR_RW_ID : RW_ID,
      // 유저ID
      WR_U_ID : U_ID,
      // 총 사용한 티켓 개수
      WR_Qty : usedTicCount,
      // 보상 대기
      WR_Sts : '대기'
    })

    newWatingReward.save();

    return `${appAvailable.RW_Nm} :  ${appAvailable.RW_Qty} 개 신청이 완료되었습니다.`;
  }

  // 보상 요청 처리
  async resWatingReward(
    WR_U_ID:string,
    WR_ID:string
  ): Promise<string> {
    // 찾아서 보상 승인 처리
    const updated = await this.watingRewardModel
      .findOneAndUpdate(
        { WR_U_ID : WR_U_ID , WR_ID:WR_ID, WR_Sts:'대기' },                
        { $set: { WR_Sts: '승인' } },       
        { new: true, upsert: false }       
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `WR_ID=${WR_ID}, WR_U_ID=${WR_U_ID} 에 해당하는 대기 보상을 찾을 수 없습니다.`,
      );
    }

    // 카운터등록
    const counter = await this.counterModel.findOneAndUpdate(
        { id: 'UQ_ID' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      // 포맷팅된 ID 생성 (예: E_00000001)
    const UQ_ID = `UQ_${counter.seq.toString().padStart(8, '0')}`;

    const appAvailable = await this.rewardModel.findOne({ RW_ID: updated.WR_RW_ID })  
    // 해당 보상 값도 UQ에 Insert되어야함
    const newRewardRouletteUQ = new this.uqModel({
      // 하나 더 증가해야해서 2개의 카운터
      UQ_ID: UQ_ID,
      // 유저ID
      UQ_U_ID : WR_U_ID,
      // 룰렛 코드
      UQ_E_ID : updated.WR_E_ID,
      // 보상 코드
      UQ_RW_ID : updated.WR_RW_ID,
      // 보상 수량
      UQ_Qty : appAvailable.RW_Qty ,
      UQ_Sts : '획득',
    })
    newRewardRouletteUQ.save();

    return `${WR_U_ID} 유저의 ${appAvailable.RW_Nm} 보상 요청을 승인했습니다.`
  }


  // 전체 보상 조회
  async getRewardListAll(): Promise<Reward[]> {
    return this.rewardModel.find().lean();
  }
  // 전체 이벤트 조회
  async getEventListAll(): Promise<Event[]> {
    return this.eventModel.find().lean();
  }
  // 퀴즈내용 조회
  async getQuizListAll(): Promise<Quiz[]> {
    return this.quizModel.find().lean();
  }
  // 통합테이블조회
  async getUQListAll(): Promise<UseQuantity[]> {
    return this.uqModel.find().lean();
  }
  
  // 보상 대기 테이블 조회(전체)
  async getWatingRewardListAll(): Promise<WatingReward[]> {
    return this.watingRewardModel.find().lean();
  }
  // 보상 대기 테이블 조회(접속한 유저)
  async getWatingRewardList(
    U_ID:string,
  ): Promise<WatingReward[]> {
    return this.watingRewardModel.find({WR_U_ID:U_ID});
  }
  
}
