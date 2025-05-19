import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(U_LoginID: string, U_LoginPW: string): Promise<{
        accessToken: string;
        message: string;
    }>;
    register(userData: any): Promise<User>;
    userListAll(): Promise<User[]>;
    hardRemove(U_LoginID: string): Promise<{
        deleted: boolean;
    }>;
    resetUser(): Promise<void>;
}
