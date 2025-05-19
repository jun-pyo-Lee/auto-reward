import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document }             from 'mongoose';
export type UseQuantityDocument = UseQuantity & Document;

//통합테이블
@Schema()
export class UseQuantity {

  //UQ_00000001 이렇게 자동
  @Prop({ unique: true })
  UQ_ID : string;
  
  //연결된 U_ID (유저고유ID)
  @Prop({ required: true })
  UQ_U_ID : string;

  //연결된 E_ID (이벤트고유ID)
  @Prop({ required: true })
  UQ_E_ID : string;

  //연결된 RW_ID (보상고유ID)
  @Prop({ required: true })
  UQ_RW_ID : string;

  //사용 및 획득 수량
  @Prop({ required: true })
  UQ_Qty : number;

  //사용,획득 상태관리
  @Prop({ required: true })
  UQ_Sts : string;
  
  //획득일
  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  UQ_De: string;


}

export const UseQuantitySchema = SchemaFactory.createForClass(UseQuantity);