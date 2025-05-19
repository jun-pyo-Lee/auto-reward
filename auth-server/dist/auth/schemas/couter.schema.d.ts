import { Document } from 'mongoose';
export declare class Counter extends Document {
    id: string;
    seq: number;
}
export declare const CounterSchema: import("mongoose").Schema<Counter, import("mongoose").Model<Counter, any, any, any, Document<unknown, any, Counter, any> & Counter & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Counter, Document<unknown, {}, import("mongoose").FlatRecord<Counter>, {}> & import("mongoose").FlatRecord<Counter> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
