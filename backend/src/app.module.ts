import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { CommentMetricsModule } from './comment-metrics/comment-metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    PrismaModule,
    AuthModule,
    CommentMetricsModule,
  ],
})
export class AppModule {}
