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
exports.RewardSchema = exports.Reward = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Reward = class Reward {
};
exports.Reward = Reward;
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], Reward.prototype, "RW_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reward.prototype, "RW_E_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reward.prototype, "RW_Nm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reward.prototype, "RW_Qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Reward.prototype, "RW_U_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Reward.prototype, "RW_Tic", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date().toISOString().slice(0, 10) }),
    __metadata("design:type", String)
], Reward.prototype, "RW_De", void 0);
exports.Reward = Reward = __decorate([
    (0, mongoose_1.Schema)()
], Reward);
exports.RewardSchema = mongoose_1.SchemaFactory.createForClass(Reward);
//# sourceMappingURL=reward.schema.js.map