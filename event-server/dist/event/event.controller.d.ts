import { EventService } from './event.service';
export declare class EventController {
    private readonly eventService;
    constructor(eventService: EventService);
    addEvent(eventData: any): Promise<import("./schemas/event.schema").Event>;
    addReward(rewardData: any): Promise<import("./schemas/reward.schema").Reward>;
    addQuiz(quizdData: any): Promise<import("./schemas/quiz.schema").Quiz>;
    eventRandomQuiz(): Promise<Omit<import("./schemas/quiz.schema").Quiz, "CQ_Ans">>;
    answer(body: {
        CQ_ID: string;
        answer: string;
        U_ID: string;
    }): Promise<{
        correct: boolean;
        correctAnswer: string;
    }>;
    playRoulette(body: {
        U_ID: string;
    }): Promise<string>;
    reqReward(body: {
        U_ID: string;
        RW_ID: string;
    }): Promise<string>;
    resWatingReward(body: {
        WR_U_ID: string;
        WR_ID: string;
    }): Promise<string>;
    eventListAll(): Promise<import("./schemas/event.schema").Event[]>;
    rewardListAll(): Promise<import("./schemas/reward.schema").Reward[]>;
    quizListAll(): Promise<import("./schemas/quiz.schema").Quiz[]>;
    UQListAll(): Promise<import("./schemas/useQuantity.schema").UseQuantity[]>;
    WatingRewardListAll(): Promise<import("./schemas/waitingReward.schema").WatingReward[]>;
    WatingRewardList(body: {
        U_ID: string;
    }): Promise<import("./schemas/waitingReward.schema").WatingReward[]>;
    resetReward(): Promise<boolean>;
}
