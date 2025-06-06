import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsService } from '../comment-metrics.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker/.';
import { TotalCommentsDto } from '../dto';

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
});
