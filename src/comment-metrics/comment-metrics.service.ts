import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TotalCommentsDto } from './dto';
import { FrequentCommentDTO } from './dto/frequent-comments.dto';
import { FeelingDistributionDto } from './dto/feeling-distribution.dto';

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

  async getFeelingDistribution(): Promise<FeelingDistributionDto> {
    const position_counts = await this.prisma.analisis_transcripciones.groupBy({
      by: ['id_posicion'],
      _count: {
        id_posicion: true,
      },
    });
    const counts_total = position_counts.reduce(
      (acc, { _count }) => acc + _count.id_posicion,
      0,
    );
    const positive =
      position_counts.find(({ id_posicion }) => id_posicion === 1)?._count
        .id_posicion || 0;
    const negative =
      position_counts.find(({ id_posicion }) => id_posicion === 2)?._count
        .id_posicion || 0;
    const neutral =
      position_counts.find(({ id_posicion }) => id_posicion === 3)?._count
        .id_posicion || 0;

    return new FeelingDistributionDto({
      positive: Math.round((positive / counts_total) * 100),
      negative: Math.round((negative / counts_total) * 100),
      neutral: Math.round((neutral / counts_total) * 100),
    });
  }
}
