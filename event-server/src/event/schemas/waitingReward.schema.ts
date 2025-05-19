import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document }             from 'mongoose';
export type WatingRewardDocument = WatingReward & Document;

//통합테이블
@Schema()
export class WatingReward {

  //WR_00000001 고유ID
  @Prop({ unique: true })
  WR_ID : string;
  
  //연결된 E_ID (이벤트고유ID)
  @Prop({ required: true })
  WR_E_ID : string;

  //연결된 RW_ID (보상고유ID)
  @Prop({ required: true })
  WR_RW_ID : string;

  //연결된 U_ID (유저고유ID)
  @Prop({ required: true })
  WR_U_ID : string;

  //총 티켓 사용 수량
  @Prop({ required: true })
  WR_Qty : number;

  //보상 대기/승인 테이블
  @Prop({ required: true })
  WR_Sts : string;

  //획득일
  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  WR_De: string;

}

export const WatingRewardSchema = SchemaFactory.createForClass(WatingReward);