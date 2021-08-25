import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ETable } from '../ETable';
import MigrationUtil from '../util/migration.util';

export class CreateTripTable1594506931007 implements MigrationInterface {
  tripTable: Table = new Table({
    name: ETable.Trip,
    columns: [
      ...MigrationUtil.getIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({
        name: 'destination',
        isNullable: false,
      }),
      MigrationUtil.getVarCharColumn({
        name: 'start_date',
        isNullable: false,
      }),
      MigrationUtil.getVarCharColumn({ name: 'end_date', isNullable: false }),
      MigrationUtil.getVarCharColumn({ name: 'comment' }),
      MigrationUtil.getIntegerColumn({ name: 'user_id', isNullable: false }),
    ],
  });

  destinationIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['destination'],
  });
  startDateIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['start_date'],
  });
  endDateIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['end_date'],
  });
  userIdIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['userID'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.tripTable);
    await queryRunner.createIndex(ETable.User, this.destinationIndex);
    await queryRunner.createIndex(ETable.User, this.startDateIndex);
    await queryRunner.createIndex(ETable.User, this.endDateIndex);
    await queryRunner.createIndex(ETable.User, this.userIdIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(ETable.User, this.destinationIndex);
    await queryRunner.dropIndex(ETable.User, this.startDateIndex);
    await queryRunner.dropIndex(ETable.User, this.endDateIndex);
    await queryRunner.dropIndex(ETable.User, this.userIdIndex);

    await queryRunner.dropTable(this.tripTable);
  }
}
