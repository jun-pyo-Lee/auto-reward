import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './schemas/reward.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { Counter, CounterSchema } from './schemas/couter.schema';
import { EventSchema } from './schemas/event.schema';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { UseQuantity, UseQuantitySchema } from './schemas/useQuantity.schema';
import { WatingReward, WatingRewardSchema } from './schemas/waitingReward.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Event.name,   schema: EventSchema }]),
    MongooseModule.forFeature([{ name: Reward.name,  schema: RewardSchema }]),
    MongooseModule.forFeature([{ name: Quiz.name,    schema: QuizSchema }]),
    MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }]),
    MongooseModule.forFeature([{ name: UseQuantity.name, schema: UseQuantitySchema }]),
    MongooseModule.forFeature([{ name: WatingReward.name, schema: WatingRewardSchema }]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
