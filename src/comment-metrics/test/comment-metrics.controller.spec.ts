import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsController } from '../comment-metrics.controller';
import { CommentMetricsService } from '../comment-metrics.service';
import { faker } from '@faker-js/faker/.';

describe('CommentMetricsController', () => {
  let controller: CommentMetricsController;
  let commentMetricsServiceMock: CommentMetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentMetricsController],
      providers: [
        {
          provide: CommentMetricsService,
          useValue: {
            getTotalRegisteredComments: jest.fn(),
            getFrequentComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentMetricsController>(CommentMetricsController);
    commentMetricsServiceMock = module.get<CommentMetricsService>(
      CommentMetricsService,
    );
  });

  it('should return total registered comments', async () => {
    const totalCommentsMock = { total: faker.number.int() };
    jest
      .spyOn(commentMetricsServiceMock, 'getTotalRegisteredComments')
      .mockResolvedValue(totalCommentsMock);

    const result = await controller.getTotalRegisteredComments();

    expect(result).toMatchObject(totalCommentsMock);
    expect(
      commentMetricsServiceMock.getTotalRegisteredComments,
    ).toHaveBeenCalled();
  });

  it('should return frequent comments', async () => {
    const frequentCommentsMock = [
      { content: faker.lorem.sentence(), count: faker.number.int() },
      { content: faker.lorem.sentence(), count: faker.number.int() },
    ];
    jest
      .spyOn(commentMetricsServiceMock, 'getFrequentComments')
      .mockResolvedValue(frequentCommentsMock);

    const result = await controller.getFrequentComments();

    expect(result).toMatchObject(frequentCommentsMock);
    expect(commentMetricsServiceMock.getFrequentComments).toHaveBeenCalled();
  });
});
