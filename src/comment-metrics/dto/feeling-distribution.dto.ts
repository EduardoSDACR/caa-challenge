import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FeelingDistributionDto {
  @Expose()
  readonly positive: number;
  @Expose()
  readonly negative: number;
  @Expose()
  readonly neutral: number;

  constructor(partial: Partial<FeelingDistributionDto>) {
    Object.assign(this, partial);
  }
}
