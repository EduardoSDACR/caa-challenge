import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TotalCommentsDto } from './dto';
import { CommentMetricsService } from './comment-metrics.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FrequentCommentDTO } from './dto/frequent-comments.dto';

@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('comment-metrics')
export class CommentMetricsController {
  constructor(private commentMetricsService: CommentMetricsService) {}

  @Get('total-registered-comments')
  getTotalRegisteredComments(): Promise<TotalCommentsDto> {
    return this.commentMetricsService.getTotalRegisteredComments();
  }

  @Get('frequent-comments')
  getFrequentComments(): Promise<FrequentCommentDTO[]> {
    return this.commentMetricsService.getFrequentComments();
  }
}
