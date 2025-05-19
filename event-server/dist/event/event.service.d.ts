import { Event, EventDocument } from './schemas/event.schema';
import { Model } from 'mongoose';
import { Counter } from './schemas/couter.schema';
import { Reward, RewardDocument } from './schemas/reward.schema';
import { Quiz, QuizDocument } from './schemas/quiz.schema';
import { UseQuantity, UseQuantityDocument } from './schemas/useQuantity.schema';
import { WatingReward, WatingRewardDocument } from './schemas/waitingReward.schema';
export declare class EventService {
    private eventModel;
    private counterModel;
    private rewardModel;
    private quizModel;
    private uqModel;
    private watingRewardModel;
    constructor(eventModel: Model<EventDocument>, counterModel: Model<Counter>, rewardModel: Model<RewardDocument>, quizModel: Model<QuizDocument>, uqModel: Model<UseQuantityDocument>, watingRewardModel: Model<WatingRewardDocument>);
    addEvent(eventData: Partial<Event>): Promise<Event>;
    addReward(rewardData: Partial<Reward>): Promise<Reward>;
    addQuiz(quizData: Partial<Quiz>): Promise<Quiz>;
    getRandomQuiz(): Promise<Omit<Quiz, 'CQ_Ans'>>;
    checkAnswer(CQ_ID: string, userAnswer: string, U_ID: string): Promise<{
        correct: boolean;
        correctAnswer: string;
    }>;
    playRoulette(U_ID: string): Promise<string>;
    reqWatingReward(U_ID: string, RW_ID: string): Promise<string>;
    resWatingReward(WR_U_ID: string, WR_ID: string): Promise<string>;
    getRewardListAll(): Promise<Reward[]>;
    getEventListAll(): Promise<Event[]>;
    getQuizListAll(): Promise<Quiz[]>;
    getUQListAll(): Promise<UseQuantity[]>;
    getWatingRewardListAll(): Promise<WatingReward[]>;
    getWatingRewardList(U_ID: string): Promise<WatingReward[]>;
    resetReward(): Promise<boolean>;
}
