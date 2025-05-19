"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const reward_schema_1 = require("./schemas/reward.schema");
const quiz_schema_1 = require("./schemas/quiz.schema");
const couter_schema_1 = require("./schemas/couter.schema");
const event_schema_1 = require("./schemas/event.schema");
const event_controller_1 = require("./event.controller");
const event_service_1 = require("./event.service");
const useQuantity_schema_1 = require("./schemas/useQuantity.schema");
const waitingReward_schema_1 = require("./schemas/waitingReward.schema");
let EventModule = class EventModule {
};
exports.EventModule = EventModule;
exports.EventModule = EventModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            mongoose_1.MongooseModule.forFeature([{ name: Event.name, schema: event_schema_1.EventSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: reward_schema_1.Reward.name, schema: reward_schema_1.RewardSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: quiz_schema_1.Quiz.name, schema: quiz_schema_1.QuizSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: couter_schema_1.Counter.name, schema: couter_schema_1.CounterSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: useQuantity_schema_1.UseQuantity.name, schema: useQuantity_schema_1.UseQuantitySchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: waitingReward_schema_1.WatingReward.name, schema: waitingReward_schema_1.WatingRewardSchema }]),
        ],
        controllers: [event_controller_1.EventController],
        providers: [event_service_1.EventService],
    })
], EventModule);
//# sourceMappingURL=event.module.js.map