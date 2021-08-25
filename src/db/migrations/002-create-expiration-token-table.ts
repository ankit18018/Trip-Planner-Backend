import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ETable } from '../ETable';
import MigrationUtil from '../util/migration.util';

export class CreateExpirationJwtTable1594506931003
  implements MigrationInterface {
  expiratioJwtTokenTable: Table = new Table({
    name: ETable.ExpiredJwtToken,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({
        name: 'expired_jwt_token',
        isNullable: false,
      }),
    ],
  });

  expiredJwtTokenIndex = MigrationUtil.createTableIndex({
    tableName: ETable.ExpiredJwtToken,
    columnNames: ['expired_jwt_token'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.expiratioJwtTokenTable);
    await queryRunner.createIndex(
      ETable.ExpiredJwtToken,
      this.expiredJwtTokenIndex,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(ETable.User, this.expiredJwtTokenIndex);
    await queryRunner.dropTable(this.expiratioJwtTokenTable);
  }
}
