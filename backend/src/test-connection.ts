import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function testConnection() {
  try {
    console.log('🔄 Intentando conectar a la base de datos...');
    const app = await NestFactory.create(AppModule);
    console.log('✅ Conexión exitosa!');
    console.log('🚀 Iniciando servidor en puerto 3000...');
    await app.listen(3000);
    console.log('✅ Servidor iniciado en http://localhost:3000');
    console.log('📚 Documentación Swagger: http://localhost:3000/api/docs');
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error.message);
    process.exit(1);
  }
}

testConnection();
