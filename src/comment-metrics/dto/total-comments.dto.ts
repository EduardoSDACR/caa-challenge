import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TotalCommentsDto {
  @Expose()
  readonly total: number;

  constructor(partial: Partial<TotalCommentsDto>) {
    Object.assign(this, partial);
  }
}
