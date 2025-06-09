import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MostMentionedWordDto, TotalCommentsDto } from './dto';
import { FrequentCommentDTO } from './dto/frequent-comments.dto';
import { FeelingDistributionDto } from './dto/feeling-distribution.dto';
import { NumberOfCommentsDto } from './dto/number-of-comments.dto';

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

  async getMostMentionedWords(): Promise<MostMentionedWordDto[]> {
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

    const mostUsedWords = words.map(async ({ _count, id_keyword }) => {
      const word = await this.prisma.keywords.findUniqueOrThrow({
        where: { id: id_keyword },
      });
      return new MostMentionedWordDto({
        word: word.nombre,
        count: _count.id_keyword,
      });
    });

    return await Promise.all(mostUsedWords);
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

  async getNumberOfComments(mode: string): Promise<NumberOfCommentsDto[]> {
    const selectedMode = mode === 'days';
    const filterDate = new Date();
    const numberOfDays = selectedMode ? 8 : 50;
    filterDate.setDate(filterDate.getDate() - numberOfDays);
    const formattedFilterDate = new Date(
      filterDate.toISOString().split('T')[0],
    );
    const comments = await this.prisma.scrapper_results.groupBy({
      by: ['scraped_at'],
      where: {
        scraped_at: {
          gte: formattedFilterDate,
        },
      },
    });

    const dailyCounts = comments.reduce((acc, { scraped_at }) => {
      const date = scraped_at.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return selectedMode
      ? this.formatDailyComments(dailyCounts)
      : this.formatWeeklyComments(dailyCounts);
  }

  private formatDailyComments(dailyCounts) {
    const formattedResult: NumberOfCommentsDto[] = [];

    for (let dayCount = 0; dayCount <= 7; dayCount++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - dayCount);
      const date = currentDate.toISOString().split('T')[0];
      formattedResult.push(
        new NumberOfCommentsDto({
          date: date,
          count: dailyCounts[date] || 0,
        }),
      );
    }

    return formattedResult;
  }

  private formatWeeklyComments(dailyCounts) {
    const formattedResult: NumberOfCommentsDto[] = [];
    let count = 0;

    for (let dayCount = 0; dayCount <= 49; dayCount++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - dayCount);
      const startDate = currentDate.toISOString().split('T')[0];
      count = count + (dailyCounts[startDate] || 0);

      if (dayCount % 7 === 0 && dayCount !== 0) {
        currentDate.setDate(currentDate.getDate() + 6);
        const endDate = currentDate.toISOString().split('T')[0];
        formattedResult.push(
          new NumberOfCommentsDto({
            date: `${startDate} - ${endDate}`,
            count,
          }),
        );
        count = 0;
      }
    }

    return formattedResult;
  }
}
