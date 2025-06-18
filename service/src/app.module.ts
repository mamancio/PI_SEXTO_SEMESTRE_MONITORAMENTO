import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { StreamComponentModule } from './streamComponent/stream-component.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      ssl: process.env.DB_SSL === 'true',
      extra: {
        max: 20,
        connectionTimeoutMillis: 5000,
      },
    }),
    UserModule,
    AuthModule,
    CommonModule,
    StreamComponentModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      serveRoot: '/',
      exclude: [
        '/auth*',
        '/users*',
        '/stream*',
        '/api*',
        '/favicon.ico',
        '/robots.txt',
        '/assets*',
      ],
      serveStaticOptions: {
        index: 'geodesic.html',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
