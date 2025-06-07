import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsService } from '../comment-metrics.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { keywords, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker/.';
import { TotalCommentsDto } from '../dto';
import { FrequentCommentDTO } from '../dto/frequent-comments.dto';
import { FeelingDistributionDto } from '../dto/feeling-distribution.dto';

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
      const keywords = [
        { id: words[0].id_keyword, nombre: faker.lorem.word() },
        { id: words[1].id_keyword, nombre: faker.lorem.word() },
      ];
      prismaService.keywords.findMany.mockResolvedValue(keywords as keywords[]);

      const result = await commentMetricsService.getMostMentionedWords();

      expect(result).toMatchObject(keywords.map(({ nombre }) => nombre));
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
});
