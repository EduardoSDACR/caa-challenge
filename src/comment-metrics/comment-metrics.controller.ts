import { Controller, Get, UseGuards } from '@nestjs/common';
import { TotalCommentsDto } from './dto';
import { CommentMetricsService } from './comment-metrics.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Controller('comment-metrics')
export class CommentMetricsController {
  constructor(private commentMetricsService: CommentMetricsService) {}

  @UseGuards(JwtGuard)
  @Get('total-registered-comments')
  getTotalRegisteredComments(): Promise<TotalCommentsDto> {
    return this.commentMetricsService.getTotalRegisteredComments();
  }
}
