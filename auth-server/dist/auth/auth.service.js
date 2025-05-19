"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
const couter_schema_1 = require("./schemas/couter.schema");
let AuthService = class AuthService {
    constructor(userModel, counterModel, jwtService) {
        this.userModel = userModel;
        this.counterModel = counterModel;
        this.jwtService = jwtService;
    }
    async login(U_LoginID, U_LoginPW) {
        if (!U_LoginID || !U_LoginPW) {
            throw new common_1.HttpException('아이디와 비밀번호를 입력하세요.', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.getUserListOne(U_LoginID);
        const isMatch = await bcrypt.compare(U_LoginPW, user.U_LoginPW);
        if (!isMatch) {
            throw new common_1.HttpException('아이디 또는 비밀번호가 맞지 않습니다.', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = {
            U_ID: user.U_ID,
            U_LoginID: user.U_LoginID,
            U_Role: user.U_Role,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            message: `${user.U_NickNm} 님, 로그인 성공! 토큰이 발행되었습니다.`,
        };
    }
    async register(userData) {
        const { U_LoginID, U_NickNm, U_LoginPW, U_Nm, U_Role } = userData;
        const existingId = await this.userModel.findOne({ U_LoginID });
        if (existingId) {
            throw new common_1.HttpException('이미 존재하는 userID입니다.', common_1.HttpStatus.CONFLICT);
        }
        const existingNick = await this.userModel.findOne({ U_NickNm });
        if (existingNick) {
            throw new common_1.HttpException('이미 존재하는 닉네임입니다.', common_1.HttpStatus.CONFLICT);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'U_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const paddedId = counter.seq.toString().padStart(8, '0');
        const U_ID = `U_${paddedId}`;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(U_LoginPW, salt);
        const roleToSave = U_Role || 'User';
        const newUser = new this.userModel({
            U_ID: U_ID,
            U_LoginID,
            U_NickNm,
            U_LoginPW: hashedPassword,
            U_Nm,
            U_Role: roleToSave,
            U_IsDel: 'N',
        });
        return newUser.save();
    }
    async getUserListAll() {
        return this.userModel.find().lean();
    }
    async getUserListOne(U_LoginID) {
        const user = await this.userModel.findOne({ U_LoginID });
        if (!user) {
            throw new common_1.HttpException('유저를 찾을 수 없습니다.', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async hardRemove(U_LoginID) {
        const result = await this.userModel.deleteOne({ U_LoginID });
        if (result.deletedCount === 0) {
            throw new common_1.HttpException('유저를 찾을 수 없습니다.', common_1.HttpStatus.NOT_FOUND);
        }
        return { deleted: true };
    }
    async resetUser() {
        await this.userModel.collection.drop();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_2.InjectModel)(couter_schema_1.Counter.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map