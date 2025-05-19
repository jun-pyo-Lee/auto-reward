import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document }             from 'mongoose';
export type RewardDocument = Reward & Document;

//보상테이블 
@Schema()
export class Reward {

  //RW_00000001 이렇게 자동
  @Prop({ unique: true })
  RW_ID: string;
  
  //연결된 이벤트 ID
  @Prop({ required: true })
  RW_E_ID: string;

  //보상명
  @Prop({ required: true })
  RW_Nm: string;

  //보상수량
  @Prop({ required: true })
  RW_Qty: number;

  //보상등록자
  @Prop({ required: true })
  RW_U_ID: string;


  //티켓 개수. 보상 받을때 씀
  @Prop({ required: true })
  RW_Tic: number;

  //보상 등록일
  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  RW_De: string;


}

export const RewardSchema = SchemaFactory.createForClass(Reward);