import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ETable } from '../ETable';
import MigrationUtil from '../util/migration.util';
import { UserRole } from '../enum';

export class CreateUserTable1594506931001 implements MigrationInterface {
  userTable: Table = new Table({
    name: ETable.User,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
      MigrationUtil.getVarCharColumn({
        name: 'email',
        isNullable: false,
        isUnique: true,
      }),
      MigrationUtil.getVarCharColumn({ name: 'password', isNullable: false }),
      MigrationUtil.getVarCharColumn({
        name: 'role',
        defaultValue: UserRole.REGULAR,
      }),
    ],
  });

  nameIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['name'],
  });
  roleIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['role'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userTable);
    await queryRunner.createIndex(ETable.User, this.nameIndex);
    await queryRunner.createIndex(ETable.User, this.roleIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(ETable.User, this.nameIndex.name);
    await queryRunner.dropIndex(ETable.User, this.roleIndex.name);
    await queryRunner.dropTable(this.userTable);
  }
}
