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
exports.WatingRewardSchema = exports.WatingReward = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let WatingReward = class WatingReward {
};
exports.WatingReward = WatingReward;
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_E_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_RW_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_U_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WatingReward.prototype, "WR_Qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_Sts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date().toISOString().slice(0, 10) }),
    __metadata("design:type", String)
], WatingReward.prototype, "WR_De", void 0);
exports.WatingReward = WatingReward = __decorate([
    (0, mongoose_1.Schema)()
], WatingReward);
exports.WatingRewardSchema = mongoose_1.SchemaFactory.createForClass(WatingReward);
//# sourceMappingURL=waitingReward.schema.js.map