import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsService } from '../comment-metrics.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker/.';
import { TotalCommentsDto } from '../dto';
import { FrequentCommentDTO } from '../dto/frequent-comments.dto';
import { FeelingDistributionDto } from '../dto/feeling-distribution.dto';
import { NumberOfCommentsDto } from '../dto/number-of-comments.dto';

describe('CommentMetricsService', () => {
  let commentMetricsService: CommentMetricsService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentMetricsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .useMocker(createMock)
      .compile();

    commentMetricsService = module.get<CommentMetricsService>(
      CommentMetricsService,
    );
    prismaService = module.get(PrismaService);
  });

  describe('getTotalRegisteredComments', () => {
    it('should return total registered comments', async () => {
      const total = faker.number.int();
      prismaService.comments.count.mockResolvedValue(total);

      const result = await commentMetricsService.getTotalRegisteredComments();

      expect(result).toMatchObject(new TotalCommentsDto({ total }));
    });
  });

  describe('getFrequentComments', () => {
    it('should return frequent comments', async () => {
      const frequentComments = [
        {
          content: faker.lorem.sentence(),
          _count: { content: faker.number.int() },
        },
        {
          content: faker.lorem.sentence(),
          _count: { content: faker.number.int() },
        },
      ];
      prismaService.comments.groupBy.mockResolvedValue(frequentComments as any);

      const result = await commentMetricsService.getFrequentComments();

      expect(result).toMatchObject(
        frequentComments.map(
          ({ content, _count }) =>
            new FrequentCommentDTO({
              content,
              count: _count.content,
            }),
        ),
      );
    });
  });

  describe('getMostMentionedWords', () => {
    it('should return most mentioned words', async () => {
      const words = [
        {
          id_keyword: faker.number.int(),
          _count: { id_keyword: faker.number.int() },
        },
        {
          id_keyword: faker.number.int(),
          _count: { id_keyword: faker.number.int() },
        },
      ];
      prismaService.keyword_transcripciones.groupBy.mockResolvedValue(
        words as any,
      );
      const keyword = {
        id: faker.number.int(),
        nombre: 'word',
        descripcion: faker.lorem.sentence(),
      };
      prismaService.keywords.findUniqueOrThrow.mockResolvedValue(
        keyword as any,
      );

      const result = await commentMetricsService.getMostMentionedWords();

      expect(result).toMatchObject([
        { word: 'word', count: words[0]._count.id_keyword },
        { word: 'word', count: words[1]._count.id_keyword },
      ]);
    });
  });

  describe('getFeelingDistribution', () => {
    it('should return feeling distribution', async () => {
      const positionCounts = [
        { id_posicion: 1, _count: { id_posicion: 120 } },
        { id_posicion: 2, _count: { id_posicion: 90 } },
        { id_posicion: 3, _count: { id_posicion: 30 } },
      ];
      prismaService.analisis_transcripciones.groupBy.mockResolvedValue(
        positionCounts as any,
      );

      const result = await commentMetricsService.getFeelingDistribution();

      expect(result).toMatchObject(
        new FeelingDistributionDto({
          positive: 50,
          negative: 38,
          neutral: 13,
        }),
      );
    });
  });

  describe('getNumberOfComments', () => {
    it('should return number of comments by days', async () => {
      const mode = 'days';
      const comments = [{ scraped_at: new Date('2023-01-01') }];
      prismaService.scrapper_results.groupBy.mockResolvedValue(comments as any);

      const result = await commentMetricsService.getNumberOfComments(mode);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(8);
      expect(result[0]).toBeInstanceOf(NumberOfCommentsDto);
    });

    it('should return number of comments by weeks', async () => {
      const mode = 'weeks';
      const comments = [{ scraped_at: new Date('2023-01-01') }];
      prismaService.scrapper_results.groupBy.mockResolvedValue(comments as any);

      const result = await commentMetricsService.getNumberOfComments(mode);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(7);
      expect(result[0]).toBeInstanceOf(NumberOfCommentsDto);
      expect(result[0].date).toContain(' - ');
    });
  });
});
