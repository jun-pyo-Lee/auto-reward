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
exports.EventController = void 0;
const common_1 = require("@nestjs/common");
const event_service_1 = require("./event.service");
let EventController = class EventController {
    constructor(eventService) {
        this.eventService = eventService;
    }
    async addEvent(eventData) {
        console.log("eventData", eventData);
        return this.eventService.addEvent(eventData);
    }
    async addReward(rewardData) {
        console.log("eventData", rewardData);
        return this.eventService.addReward(rewardData);
    }
    async addQuiz(quizdData) {
        console.log("eventData", quizdData);
        return this.eventService.addQuiz(quizdData);
    }
    async eventRandomQuiz() {
        return this.eventService.getRandomQuiz();
    }
    async answer(body) {
        console.log(`컨트롤러단 ${JSON.stringify(body)}`);
        return this.eventService.checkAnswer(body.CQ_ID, body.answer, body.U_ID);
    }
    async playRoulette(body) {
        return this.eventService.playRoulette(body.U_ID);
    }
    reqReward(body) {
        return this.eventService.reqWatingReward(body.U_ID, body.RW_ID);
    }
    resWatingReward(body) {
        return this.eventService.resWatingReward(body.WR_U_ID, body.WR_ID);
    }
    async eventListAll() {
        return this.eventService.getEventListAll();
    }
    async rewardListAll() {
        return this.eventService.getRewardListAll();
    }
    async quizListAll() {
        return this.eventService.getQuizListAll();
    }
    async UQListAll() {
        return this.eventService.getUQListAll();
    }
    async WatingRewardListAll() {
        return this.eventService.getWatingRewardListAll();
    }
    async WatingRewardList(body) {
        return this.eventService.getWatingRewardList(body.U_ID);
    }
    async resetReward() {
        console.log(`보상정보초기화`);
        return this.eventService.resetReward();
    }
};
exports.EventController = EventController;
__decorate([
    (0, common_1.Post)('event-add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "addEvent", null);
__decorate([
    (0, common_1.Post)('reward-add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "addReward", null);
__decorate([
    (0, common_1.Post)('quiz-add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "addQuiz", null);
__decorate([
    (0, common_1.Get)('quiz-random'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "eventRandomQuiz", null);
__decorate([
    (0, common_1.Post)('quiz-answer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "answer", null);
__decorate([
    (0, common_1.Post)('roulette-play'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "playRoulette", null);
__decorate([
    (0, common_1.Post)('wating-reward-req'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "reqReward", null);
__decorate([
    (0, common_1.Post)('wating-reward-res'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EventController.prototype, "resWatingReward", null);
__decorate([
    (0, common_1.Get)('event-list-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "eventListAll", null);
__decorate([
    (0, common_1.Get)('reward-list-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "rewardListAll", null);
__decorate([
    (0, common_1.Get)('quiz-list-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "quizListAll", null);
__decorate([
    (0, common_1.Get)('useq-list-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "UQListAll", null);
__decorate([
    (0, common_1.Get)('wating-reward-list-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "WatingRewardListAll", null);
__decorate([
    (0, common_1.Post)('wating-reward-list'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "WatingRewardList", null);
__decorate([
    (0, common_1.Get)('reset-reward-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventController.prototype, "resetReward", null);
exports.EventController = EventController = __decorate([
    (0, common_1.Controller)('event'),
    __metadata("design:paramtypes", [event_service_1.EventService])
], EventController);
//# sourceMappingURL=event.controller.js.map