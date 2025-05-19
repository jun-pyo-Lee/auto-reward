// src/event/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model }             from 'mongoose';
import { CounterDocument } from './couter.schema'; 

export type EventDocument = Event & Document;

@Schema()
export class Event {

    // 자동증가된 8자리 ID
    @Prop({ unique: true })
    E_ID: string;

    // 이벤트명
    @Prop({ required: true })
    E_Nm: string;

    // 이벤트 시작일 (YYYY-MM-DD)
    @Prop({ required: true })
    E_SrtDe: string;

    // 이벤트 종료일 (YYYY-MM-DD)
    @Prop({ required: true })
    E_EndDe: string;

    // 이벤트 상태
    @Prop({ required: true })
    E_Sts: string;

    // 이벤트 등록자
    @Prop({ required: true })
    E_U_ID: string;

    // 등록일 (자동)
    @Prop({ default: () => new Date().toISOString().slice(0, 10) })
    E_InDe: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);

// // save 직전에 Counter를 올리고 E_ID 세팅
// EventSchema.pre<EventDocument>('save', async function (next) {
//   if (this.isNew) {
//     const counter = await model<CounterDocument>('Counter')
//       .findOneAndUpdate(
//         { id: 'E_ID' },
//         { $inc: { seq: 1 } },
//         { new: true, upsert: true },
//       );
//     this.E_ID = String(counter.seq).padStart(8, '0');
//   }
//   next();
// });
