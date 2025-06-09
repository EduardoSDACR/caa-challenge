import {
  BadRequestException,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MostMentionedWordDto, TotalCommentsDto } from './dto';
import { CommentMetricsService } from './comment-metrics.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { FrequentCommentDTO } from './dto/frequent-comments.dto';
import { FeelingDistributionDto } from './dto/feeling-distribution.dto';
import { NumberOfCommentsDto } from './dto/number-of-comments.dto';

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

  @Get('most-mentioned-words')
  getMostMentionedWords(): Promise<MostMentionedWordDto[]> {
    return this.commentMetricsService.getMostMentionedWords();
  }

  @Get('feeling-distribution')
  getFeelingDistribution(): Promise<FeelingDistributionDto> {
    return this.commentMetricsService.getFeelingDistribution();
  }

  @Get('number-of-comments')
  getNumberOfComments(
    @Query('mode') mode: string,
  ): Promise<NumberOfCommentsDto[]> {
    if (mode !== 'days' && mode !== 'weeks') {
      throw new BadRequestException(
        'The query "mode" must be either "days" or "weeks"',
      );
    }

    return this.commentMetricsService.getNumberOfComments(mode);
  }
}
