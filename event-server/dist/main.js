"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const event_module_1 = require("./event/event.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(event_module_1.EventModule);
    await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
//# sourceMappingURL=main.js.map