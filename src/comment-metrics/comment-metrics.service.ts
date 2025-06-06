import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TotalCommentsDto } from './dto';

@Injectable()
export class CommentMetricsService {
  constructor(private prisma: PrismaService) {}

  async getTotalRegisteredComments(): Promise<TotalCommentsDto> {
    const total = await this.prisma.comments.count();

    return new TotalCommentsDto({ total });
  }
}
