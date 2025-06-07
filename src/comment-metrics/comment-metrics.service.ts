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

  async getMostMentionedWords(): Promise<String[]> {
    const words = await this.prisma.keyword_transcripciones.groupBy({
      by: ['id_keyword'],
      _count: {
        id_keyword: true,
      },
      orderBy: {
        _count: {
          id_keyword: 'desc',
        },
      },
      take: 10,
    });
    const words_ids = words.map(({ id_keyword }) => id_keyword);
    const keywords = await this.prisma.keywords.findMany({
      where: {
        id: {
          in: words_ids,
        },
      },
    });

    return keywords.map(({ nombre }) => nombre);
  }
}
