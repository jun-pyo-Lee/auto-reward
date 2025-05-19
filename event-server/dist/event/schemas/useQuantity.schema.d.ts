import { Document } from 'mongoose';
export type UseQuantityDocument = UseQuantity & Document;
export declare class UseQuantity {
    UQ_ID: string;
    UQ_U_ID: string;
    UQ_E_ID: string;
    UQ_RW_ID: string;
    UQ_Qty: number;
    UQ_Sts: string;
    UQ_De: string;
}
export declare const UseQuantitySchema: import("mongoose").Schema<UseQuantity, import("mongoose").Model<UseQuantity, any, any, any, Document<unknown, any, UseQuantity, any> & UseQuantity & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UseQuantity, Document<unknown, {}, import("mongoose").FlatRecord<UseQuantity>, {}> & import("mongoose").FlatRecord<UseQuantity> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
