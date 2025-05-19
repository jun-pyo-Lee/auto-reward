import { Document } from 'mongoose';
export type QuizDocument = Quiz & Document;
export declare class Quiz {
    CQ_ID: string;
    CQ_E_ID: string;
    CQ_Que: string;
    CQ_Hint: string;
    CQ_Ans: string;
    CQ_U_ID: string;
    CQ_De: string;
}
export declare const QuizSchema: import("mongoose").Schema<Quiz, import("mongoose").Model<Quiz, any, any, any, Document<unknown, any, Quiz, any> & Quiz & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Quiz, Document<unknown, {}, import("mongoose").FlatRecord<Quiz>, {}> & import("mongoose").FlatRecord<Quiz> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
