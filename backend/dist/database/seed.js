"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const seed_service_1 = require("./seeds/seed.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const seedService = app.get(seed_service_1.SeedService);
    await seedService.seed();
    await app.close();
}
bootstrap().catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map