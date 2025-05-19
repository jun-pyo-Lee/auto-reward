// src/quiz/schemas/quiz.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model }             from 'mongoose';

export type QuizDocument = Quiz & Document;


//초성퀴즈 스키마
@Schema()
export class Quiz {
  //CQ_00000001
  @Prop({ unique: true })
  CQ_ID: string; 

  //연결된 이벤트아이디
  @Prop({ required: true })
  CQ_E_ID: string;

  //문제
  @Prop({ required: true })
  CQ_Que: string;

  //힌트
  @Prop()
  CQ_Hint: string;

  //정답
  @Prop({ required: true })
  CQ_Ans: string;

  //퀴즈 등록자
  @Prop({ required: true })
  CQ_U_ID: string;

  //퀴즈 등록일
  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  CQ_De: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);

