import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETable } from '../ETable';
import ModelEntity from '../util/model.entity';

@Entity({ name: ETable.ExpiredJwtToken })
export default class ExpiredTokenEntity extends ModelEntity<ExpiredTokenEntity> {
  @Column({ name: 'expired_jwt_token' }) expiredJwtToken: string;
}
