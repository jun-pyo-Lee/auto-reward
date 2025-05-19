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
exports.UseQuantitySchema = exports.UseQuantity = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UseQuantity = class UseQuantity {
};
exports.UseQuantity = UseQuantity;
__decorate([
    (0, mongoose_1.Prop)({ unique: true }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_U_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_E_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_RW_ID", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UseQuantity.prototype, "UQ_Qty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_Sts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date().toISOString().slice(0, 10) }),
    __metadata("design:type", String)
], UseQuantity.prototype, "UQ_De", void 0);
exports.UseQuantity = UseQuantity = __decorate([
    (0, mongoose_1.Schema)()
], UseQuantity);
exports.UseQuantitySchema = mongoose_1.SchemaFactory.createForClass(UseQuantity);
//# sourceMappingURL=useQuantity.schema.js.map