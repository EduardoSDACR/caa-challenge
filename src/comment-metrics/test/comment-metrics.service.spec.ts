import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsService } from '../comment-metrics.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker/.';
import { TotalCommentsDto } from '../dto';
import { FrequentCommentDTO } from '../dto/frequent-comments.dto';

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
});
