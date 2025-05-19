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
exports.EventService = void 0;
const common_1 = require("@nestjs/common");
const event_schema_1 = require("./schemas/event.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const couter_schema_1 = require("./schemas/couter.schema");
const reward_schema_1 = require("./schemas/reward.schema");
const quiz_schema_1 = require("./schemas/quiz.schema");
const useQuantity_schema_1 = require("./schemas/useQuantity.schema");
const waitingReward_schema_1 = require("./schemas/waitingReward.schema");
let EventService = class EventService {
    constructor(eventModel, counterModel, rewardModel, quizModel, uqModel, watingRewardModel) {
        this.eventModel = eventModel;
        this.counterModel = counterModel;
        this.rewardModel = rewardModel;
        this.quizModel = quizModel;
        this.uqModel = uqModel;
        this.watingRewardModel = watingRewardModel;
    }
    async addEvent(eventData) {
        const { E_Nm, E_SrtDe, E_EndDe, E_Sts, E_U_ID } = eventData;
        const existingId = await this.eventModel.findOne({ E_Nm: E_Nm });
        if (existingId) {
            throw new common_1.ConflictException([
                '이미 존재하는 이벤트입니다.',
                `이벤트명 : ${existingId.E_Nm}`,
                `이벤트코드 : ${existingId.E_ID}`,
            ]);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'E_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const paddedId = counter.seq.toString().padStart(8, '0');
        const E_ID = `E_${paddedId}`;
        const newEvent = new this.eventModel({
            E_ID: E_ID,
            E_Nm,
            E_SrtDe,
            E_EndDe,
            E_Sts,
            E_U_ID
        });
        return newEvent.save();
    }
    async addReward(rewardData) {
        const { RW_Nm, RW_Qty, RW_U_ID, RW_E_ID, RW_Tic } = rewardData;
        const existingId = await this.eventModel.findOne({ E_ID: RW_E_ID });
        if (!existingId) {
            throw new common_1.NotFoundException([
                '등록되지 않은 이벤트입니다.',
                `이벤트 코드를 확인해주세요 `,
            ]);
        }
        const conflictId = await this.rewardModel.findOne({ RW_E_ID: RW_E_ID, RW_Nm: RW_Nm, RW_Qty: RW_Qty, RW_Tic: RW_Tic });
        if (conflictId) {
            throw new common_1.ConflictException([
                '이미 등록된 보상입니다.',
                `이벤트코드 : ${conflictId.RW_E_ID}`,
                `보상명 : ${conflictId.RW_Nm}`,
                `보상수량 : ${conflictId.RW_Qty}`,
            ]);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'RW_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const paddedId = counter.seq.toString().padStart(8, '0');
        const RW_ID = `RW_${paddedId}`;
        const newReward = new this.rewardModel({
            RW_ID: RW_ID,
            RW_Nm,
            RW_Qty,
            RW_U_ID,
            RW_E_ID,
            RW_Tic
        });
        return newReward.save();
    }
    async addQuiz(quizData) {
        const { CQ_Que, CQ_Ans, CQ_Hint, CQ_U_ID } = quizData;
        const existingId = await this.eventModel.findOne({ E_Nm: "초성퀴즈" });
        if (!existingId) {
            throw new common_1.NotFoundException([
                '초성퀴즈 이벤트가 등록되지 않았습니다.',
                `초성퀴즈 이벤트 코드를 확인하세요.`,
            ]);
        }
        const CQ_E_ID = existingId.E_ID;
        const counter = await this.counterModel.findOneAndUpdate({ id: 'CQ_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const paddedId = counter.seq.toString().padStart(8, '0');
        const CQ_ID = `CQ_${paddedId}`;
        const newQuiz = new this.quizModel({
            CQ_ID: CQ_ID,
            CQ_E_ID: CQ_E_ID,
            CQ_U_ID,
            CQ_Que,
            CQ_Ans,
            CQ_Hint,
        });
        return newQuiz.save();
    }
    async getRandomQuiz() {
        const [quiz] = await this.quizModel.aggregate([
            { $match: {} },
            { $sample: { size: 1 } },
            { $project: { CQ_Ans: 0, __v: 0 } },
        ]);
        return quiz;
    }
    async checkAnswer(CQ_ID, userAnswer, U_ID) {
        const quiz = await this.quizModel.findOne({ CQ_ID: CQ_ID }).lean();
        if (!quiz) {
            throw new common_1.NotFoundException('해당 퀴즈를 찾을 수 없습니다.');
        }
        const correct = quiz.CQ_Ans.trim() === userAnswer.trim();
        const existingId = await this.eventModel.findOne({ E_Nm: "초성퀴즈" });
        const conflictId = await this.rewardModel.findOne({ RW_Nm: "티켓" });
        if (!conflictId) {
            throw new common_1.NotFoundException([
                '티켓이 존재하지 않습니다.',
                `운영자에게 문의해주세요.`,
            ]);
        }
        const today = new Date().toISOString().slice(0, 10);
        const existingUQ = await this.uqModel.findOne({
            UQ_U_ID: U_ID,
            UQ_De: today,
            UQ_E_ID: existingId.E_ID,
            UQ_RW_ID: conflictId.RW_ID
        });
        if (existingUQ) {
            throw new common_1.ConflictException([
                '해당 일자에 이미 발급받았습니다',
                '중복 보상은 지급받을 수 없습니다.'
            ]);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'UQ_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const paddedId = counter.seq.toString().padStart(8, '0');
        const UQ_ID = `UQ_${paddedId}`;
        const newUQ = new this.uqModel({
            UQ_ID: UQ_ID,
            UQ_U_ID: U_ID,
            UQ_E_ID: existingId.E_ID,
            UQ_RW_ID: conflictId.RW_ID,
            UQ_Qty: conflictId.RW_Qty,
            UQ_Sts: '획득',
        });
        newUQ.save();
        return { correct, correctAnswer: quiz.CQ_Ans };
    }
    async playRoulette(U_ID) {
        console.log(`입력한 U_ID값 :${U_ID}`);
        const rouletteE_ID = await this.eventModel.findOne({ E_Nm: "룰렛", E_Sts: "진행중" });
        if (!rouletteE_ID) {
            throw new common_1.NotFoundException([
                '진행중인 룰렛 이벤트가 존재하지 않습니다.',
                '"룰렛" 이벤트를 등록해주세요.'
            ]);
        }
        const rouletteRW_ID = await this.rewardModel.findOne({ RW_Nm: "티켓" });
        if (!rouletteRW_ID) {
            throw new common_1.NotFoundException([
                '티켓 보상명이 존재하지 않습니다.',
                '티켓 보상을 등록해주세요.'
            ]);
        }
        const rewardData = await this.rewardModel.aggregate([
            { $match: { RW_E_ID: rouletteE_ID.E_ID, RW_Tic: 1 } },
            { $sample: { size: 1 } },
        ]).exec();
        if (rewardData.length === 0) {
            throw new common_1.NotFoundException([
                '룰렛 보상이 등록되지 않았습니다',
                '"룰렛" 코드로 보상을 등록해주세요.',
            ]);
        }
        const rouletteUQData = await this.uqModel.find({ UQ_U_ID: U_ID, UQ_RW_ID: rouletteRW_ID.RW_ID }).lean();
        ;
        const rewardOneData = rewardData[0];
        let totalQty;
        if (rouletteUQData.length === 0) {
            totalQty = 0;
            throw new common_1.NotFoundException([
                '티켓이 존재하지 않습니다.',
                '티켓을 모아주세요',
            ]);
        }
        else {
            totalQty = rouletteUQData.map(r => r.UQ_Qty ?? 0).reduce((a, b) => a + b);
        }
        if (totalQty >= 1) {
            const counter_1 = await this.counterModel.findOneAndUpdate({ id: 'UQ_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            const UQ_ID_1 = `UQ_${counter_1.seq.toString().padStart(8, '0')}`;
            const newUseRouletteUQ = new this.uqModel({
                UQ_ID: UQ_ID_1,
                UQ_U_ID: U_ID,
                UQ_E_ID: rouletteE_ID.E_ID,
                UQ_RW_ID: rouletteRW_ID.RW_ID,
                UQ_Qty: -1,
                UQ_Sts: '사용',
            });
            newUseRouletteUQ.save();
            const counter_2 = await this.counterModel.findOneAndUpdate({ id: 'UQ_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
            const UQ_ID_2 = `UQ_${counter_2.seq.toString().padStart(8, '0')}`;
            const newRewardRouletteUQ = new this.uqModel({
                UQ_ID: UQ_ID_2,
                UQ_U_ID: U_ID,
                UQ_E_ID: rouletteE_ID.E_ID,
                UQ_RW_ID: rewardOneData.RW_ID,
                UQ_Qty: rewardOneData.RW_Qty,
                UQ_Sts: '획득',
            });
            newRewardRouletteUQ.save();
        }
        else {
            throw new common_1.NotFoundException([
                '티켓이 존재하지 않습니다.',
                '티켓을 모아주세요',
            ]);
        }
        return `${rewardOneData.RW_Nm} 보상을 획득했습니다! 수량: ${rewardOneData.RW_Qty}`;
        ;
    }
    async reqWatingReward(U_ID, RW_ID) {
        const rouletteE_ID = await this.eventModel.findOne({ E_Nm: "룰렛", E_Sts: "진행중" });
        const rouletteRW_ID = await this.rewardModel.findOne({ RW_Nm: "티켓" });
        const reqRewardUQSumDdata = await this.uqModel.find({ UQ_U_ID: U_ID, UQ_RW_ID: rouletteRW_ID.RW_ID, UQ_Sts: '사용' }).lean();
        const usedTicCount = reqRewardUQSumDdata.reduce((sum, rec) => sum + Math.abs(rec.UQ_Qty ?? 0), 0);
        const appAvailable = await this.rewardModel.findOne({ RW_E_ID: rouletteE_ID.E_ID, RW_ID: RW_ID, RW_Tic: { $ne: 1 } });
        if (!appAvailable) {
            throw new common_1.NotFoundException([
                '신청 할 수 없는 상품입니다.',
            ]);
        }
        if (appAvailable.RW_Tic > usedTicCount) {
            throw new common_1.ConflictException([
                '조건에 충족하지 않아 보상을 신청 할 수 없습니다.',
                `요구수량 ${appAvailable.RW_Tic} 개, 사용개수: ${usedTicCount} 개`
            ]);
        }
        const rewardUQdata = await this.uqModel.findOne({
            UQ_U_ID: U_ID,
            UQ_E_ID: rouletteE_ID.E_ID,
            UQ_RW_ID: RW_ID,
            UQ_Sts: '획득'
        });
        if (rewardUQdata) {
            throw new common_1.ConflictException([
                '이미 획득한 보상입니다.',
                `보상 명 ${appAvailable.RW_Nm} , 획득일 : ${rewardUQdata.UQ_De}`
            ]);
        }
        const watingRewardChk = await this.watingRewardModel.findOne({
            WR_E_ID: appAvailable.RW_E_ID,
            WR_RW_ID: appAvailable.RW_ID,
            WR_U_ID: U_ID,
        });
        if (watingRewardChk) {
            throw new common_1.ConflictException([
                '이미 획득한 보상이거나, 신청중인 보상입니다.',
                `보상 명 ${appAvailable.RW_Nm} , 신청일 : ${watingRewardChk.WR_De}`
            ]);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'WR_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const WR_ID = `WR_${counter.seq.toString().padStart(8, '0')}`;
        const newWatingReward = new this.watingRewardModel({
            WR_ID: WR_ID,
            WR_E_ID: appAvailable.RW_E_ID,
            WR_RW_ID: RW_ID,
            WR_U_ID: U_ID,
            WR_Qty: usedTicCount,
            WR_Sts: '대기'
        });
        newWatingReward.save();
        return `${appAvailable.RW_Nm} :  ${appAvailable.RW_Qty} 개 신청이 완료되었습니다.`;
    }
    async resWatingReward(WR_U_ID, WR_ID) {
        const updated = await this.watingRewardModel
            .findOneAndUpdate({ WR_U_ID: WR_U_ID, WR_ID: WR_ID, WR_Sts: '대기' }, { $set: { WR_Sts: '승인' } }, { new: true, upsert: false })
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException(`WR_ID=${WR_ID}, WR_U_ID=${WR_U_ID} 에 해당하는 대기 보상을 찾을 수 없습니다.`);
        }
        const counter = await this.counterModel.findOneAndUpdate({ id: 'UQ_ID' }, { $inc: { seq: 1 } }, { new: true, upsert: true });
        const UQ_ID = `UQ_${counter.seq.toString().padStart(8, '0')}`;
        const appAvailable = await this.rewardModel.findOne({ RW_ID: updated.WR_RW_ID });
        const newRewardRouletteUQ = new this.uqModel({
            UQ_ID: UQ_ID,
            UQ_U_ID: WR_U_ID,
            UQ_E_ID: updated.WR_E_ID,
            UQ_RW_ID: updated.WR_RW_ID,
            UQ_Qty: appAvailable.RW_Qty,
            UQ_Sts: '획득',
        });
        newRewardRouletteUQ.save();
        return `${WR_U_ID} 유저의 ${appAvailable.RW_Nm} 보상 요청을 승인했습니다.`;
    }
    async getRewardListAll() {
        return this.rewardModel.find().lean();
    }
    async getEventListAll() {
        return this.eventModel.find().lean();
    }
    async getQuizListAll() {
        return this.quizModel.find().lean();
    }
    async getUQListAll() {
        return this.uqModel.find().lean();
    }
    async getWatingRewardListAll() {
        return this.watingRewardModel.find().lean();
    }
    async getWatingRewardList(U_ID) {
        return this.watingRewardModel.find({ WR_U_ID: U_ID });
    }
    async resetReward() {
        return this.rewardModel.collection.drop();
    }
};
exports.EventService = EventService;
__decorate([
    (0, common_1.Get)('reset-reward-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventService.prototype, "resetReward", null);
exports.EventService = EventService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    __param(1, (0, mongoose_1.InjectModel)(couter_schema_1.Counter.name)),
    __param(2, (0, mongoose_1.InjectModel)(reward_schema_1.Reward.name)),
    __param(3, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __param(4, (0, mongoose_1.InjectModel)(useQuantity_schema_1.UseQuantity.name)),
    __param(5, (0, mongoose_1.InjectModel)(waitingReward_schema_1.WatingReward.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], EventService);
//# sourceMappingURL=event.service.js.map