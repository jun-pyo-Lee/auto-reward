import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    U_ID: string;
    U_LoginID: string;
    U_LoginPW: string;
    U_Nm: string;
    U_NickNm: string;
    U_Role: string;
    U_CreDe: string;
    U_IsDel: string;
    U_DelDe?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
