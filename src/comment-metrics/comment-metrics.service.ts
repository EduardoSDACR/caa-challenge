import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TotalCommentsDto } from './dto';
import { FrequentCommentDTO } from './dto/frequent-comments.dto';

@Injectable()
export class CommentMetricsService {
  constructor(private prisma: PrismaService) {}

  async getTotalRegisteredComments(): Promise<TotalCommentsDto> {
    const total = await this.prisma.comments.count();

    return new TotalCommentsDto({ total });
  }

  async getFrequentComments(): Promise<FrequentCommentDTO[]> {
    const comments = await this.prisma.comments.groupBy({
      by: ['content'],
      _count: {
        content: true,
      },
      orderBy: {
        _count: {
          content: 'desc',
        },
      },
      take: 100,
    });

    return comments.map(
      ({ content, _count }) =>
        new FrequentCommentDTO({
          content,
          count: _count.content,
        }),
    );
  }
}
