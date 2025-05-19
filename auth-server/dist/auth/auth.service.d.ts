import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Counter } from './schemas/couter.schema';
export declare class AuthService {
    private userModel;
    private counterModel;
    private readonly jwtService;
    constructor(userModel: Model<UserDocument>, counterModel: Model<Counter>, jwtService: JwtService);
    login(U_LoginID: string, U_LoginPW: string): Promise<{
        accessToken: string;
        message: string;
    }>;
    register(userData: Partial<User>): Promise<User>;
    getUserListAll(): Promise<User[]>;
    getUserListOne(U_LoginID: string): Promise<User>;
    hardRemove(U_LoginID: string): Promise<{
        deleted: boolean;
    }>;
    resetUser(): Promise<void>;
}
