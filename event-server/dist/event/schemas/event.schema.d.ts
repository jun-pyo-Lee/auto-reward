import { Document } from 'mongoose';
export type EventDocument = Event & Document;
export declare class Event {
    E_ID: string;
    E_Nm: string;
    E_SrtDe: string;
    E_EndDe: string;
    E_Sts: string;
    E_U_ID: string;
    E_InDe: string;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, Document<unknown, any, Event, any> & Event & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}> & import("mongoose").FlatRecord<Event> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
