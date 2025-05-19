// 해당 파일은 U_ID의 고유 값을 만들어주기 위하여 작성
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Counter extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, default: 1 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);