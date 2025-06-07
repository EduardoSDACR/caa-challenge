import { Module } from '@nestjs/common';
import { CommentMetricsService } from './comment-metrics.service';
import { CommentMetricsController } from './comment-metrics.controller';

@Module({
  providers: [CommentMetricsService],
  controllers: [CommentMetricsController]
})
export class CommentMetricsModule {}
