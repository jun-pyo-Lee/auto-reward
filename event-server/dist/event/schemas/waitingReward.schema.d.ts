import { Document } from 'mongoose';
export type WatingRewardDocument = WatingReward & Document;
export declare class WatingReward {
    WR_ID: string;
    WR_E_ID: string;
    WR_RW_ID: string;
    WR_U_ID: string;
    WR_Qty: number;
    WR_Sts: string;
    WR_De: string;
}
export declare const WatingRewardSchema: import("mongoose").Schema<WatingReward, import("mongoose").Model<WatingReward, any, any, any, Document<unknown, any, WatingReward, any> & WatingReward & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WatingReward, Document<unknown, {}, import("mongoose").FlatRecord<WatingReward>, {}> & import("mongoose").FlatRecord<WatingReward> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
