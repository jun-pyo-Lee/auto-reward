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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizSchema = exports.Quiz = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Quiz = class Quiz {
};
exports.Quiz = Quiz;
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_E_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_Que", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_Hint", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_Ans", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_U_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date().toISOString().slice(0, 10) }),
    __metadata("design:type", String)
], Quiz.prototype, "CQ_De", void 0);
exports.Quiz = Quiz = __decorate([
    (0, mongoose_1.Schema)()
], Quiz);
exports.QuizSchema = mongoose_1.SchemaFactory.createForClass(Quiz);
//# sourceMappingURL=quiz.schema.js.map