import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enum';
import { ETable } from '../ETable';
import ModelEntity from '../util/model.entity';

@Entity({ name: ETable.User })
export default class UserEntity extends ModelEntity<UserEntity> {
  @Column() name: string;

  @Column() email: string;

  @Column({ type: 'varchar', default: UserRole.REGULAR })
  role: UserRole;

  @Column() password: string;

  public toJSON({
    includes = ['id', 'name', 'email', 'role'],
    skips = [],
  }: {
    includes?: (keyof UserEntity)[];
    skips?: string[];
  }): Partial<UserEntity> {
    return super.toJSON({ includes, skips });
  }
}
