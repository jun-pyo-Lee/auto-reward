import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  // 고유 ID 오토인크리먼트
  @Prop({ required: true, unique: true })
  U_ID: string;

  // 로그인 ID (고유)
  @Prop({ required: true, unique: true })
  U_LoginID: string;

  // 비밀번호
  @Prop({ required: true })
  U_LoginPW: string;

  // 유저 이름
  @Prop({ required: true })
  U_Nm: string;

  // 닉네임 (고유)
  @Prop({ required: true, unique: true })
  U_NickNm: string;

  // 권한 (User, Operator, Auditor, Admin)
  @Prop({ required: true, default: 'User' })
  U_Role: string;

  // 가입일 (YYYY-MM-DD)
  @Prop({ default: () => new Date().toISOString().slice(0, 10) })
  U_CreDe: string;

  // 탈퇴 여부 (Y/N)
  @Prop({ required: true, default: 'N' })
  U_IsDel: string;

  // 탈퇴일 (YYYY-MM-DD)
  @Prop()
  U_DelDe?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
