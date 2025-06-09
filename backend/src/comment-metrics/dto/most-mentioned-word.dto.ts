import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MostMentionedWordDto {
  @Expose()
  readonly word: string;

  @Expose()
  readonly count: number;

  constructor(partial: Partial<MostMentionedWordDto>) {
    Object.assign(this, partial);
  }
}
