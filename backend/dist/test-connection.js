"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function testConnection() {
    try {
        console.log('🔄 Intentando conectar a la base de datos...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        console.log('✅ Conexión exitosa!');
        console.log('🚀 Iniciando servidor en puerto 3000...');
        await app.listen(3000);
        console.log('✅ Servidor iniciado en http://localhost:3000');
        console.log('📚 Documentación Swagger: http://localhost:3000/api/docs');
    }
    catch (error) {
        console.error('❌ Error al iniciar la aplicación:', error.message);
        process.exit(1);
    }
}
testConnection();
//# sourceMappingURL=test-connection.js.map