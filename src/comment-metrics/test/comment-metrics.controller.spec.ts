import { Test, TestingModule } from '@nestjs/testing';
import { CommentMetricsController } from '../comment-metrics.controller';
import { CommentMetricsService } from '../comment-metrics.service';
import { faker } from '@faker-js/faker/.';
import { BadRequestException } from '@nestjs/common';
import { get } from 'http';

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
            getMostMentionedWords: jest.fn(),
            getFeelingDistribution: jest.fn(),
            getNumberOfComments: jest.fn(),
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

  it('should return most mentioned words', async () => {
    const mostMentionedWordsMock = [faker.lorem.word(), faker.lorem.word()];
    jest
      .spyOn(commentMetricsServiceMock, 'getMostMentionedWords')
      .mockResolvedValue(mostMentionedWordsMock);

    const result = await controller.getMostMentionedWords();

    expect(result).toMatchObject(mostMentionedWordsMock);
    expect(commentMetricsServiceMock.getMostMentionedWords).toHaveBeenCalled();
  });

  it('should return feeling distribution', async () => {
    const feelingDistributionMock = {
      positive: faker.number.int(),
      negative: faker.number.int(),
      neutral: faker.number.int(),
    };
    jest
      .spyOn(commentMetricsServiceMock, 'getFeelingDistribution')
      .mockResolvedValue(feelingDistributionMock);

    const result = await controller.getFeelingDistribution();

    expect(result).toMatchObject(feelingDistributionMock);
    expect(commentMetricsServiceMock.getFeelingDistribution).toHaveBeenCalled();
  });

  it('should throw BadRequestException for invalid mode in getNumberOfComments', async () => {
    try {
      await controller.getNumberOfComments('invalid');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toBe(
        'The query "mode" must be either "days" or "weeks"',
      );
    }
  });

  it('should return number of comments for valid mode', async () => {
    const numberOfCommentsMock = [
      { date: '2025-01-01', count: faker.number.int() },
    ];
    jest
      .spyOn(commentMetricsServiceMock, 'getNumberOfComments')
      .mockResolvedValue(numberOfCommentsMock);

    const result = await controller.getNumberOfComments('days');

    expect(result).toMatchObject(numberOfCommentsMock);
    expect(commentMetricsServiceMock.getNumberOfComments).toHaveBeenCalledWith(
      'days',
    );
  });
});
