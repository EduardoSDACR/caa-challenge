import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FrequentCommentDTO {
  @Expose()
  readonly content: string;

  @Expose()
  readonly count: number;

  constructor(partial: Partial<FrequentCommentDTO>) {
    Object.assign(this, partial);
  }
}
