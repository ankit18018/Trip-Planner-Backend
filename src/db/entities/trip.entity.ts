import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETable } from '../ETable';
import ModelEntity from '../util/model.entity';

@Entity({ name: ETable.Trip })
export default class TripEntity extends ModelEntity<TripEntity> {
  @Column() destination: string;

  @Column({ name: 'start_date' }) startDate: string;

  @Column({ name: 'end_date' }) endDate: string;

  @Column() comment: string;

  @Column({ name: 'user_id' }) userId: number;

  public toJSON({
    includes = [
      'id',
      'destination',
      'startDate',
      'endDate',
      'comment',
      'userId',
    ],
    skips = [],
  }: {
    includes?: (keyof TripEntity)[];
    skips?: string[];
  }): Partial<TripEntity> {
    return super.toJSON({ includes, skips });
  }
}
