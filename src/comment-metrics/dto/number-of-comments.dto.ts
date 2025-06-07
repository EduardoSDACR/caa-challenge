import { E } from '@faker-js/faker/dist/airline-BUL6NtOJ';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class NumberOfCommentsDto {
  @Expose()
  readonly date: string;

  @Expose()
  readonly count: number;

  constructor(partial: Partial<NumberOfCommentsDto>) {
    Object.assign(this, partial);
  }
}
