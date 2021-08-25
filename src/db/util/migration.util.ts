import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';
import { TableIndex } from 'typeorm/schema-builder/table/TableIndex';
import { ETable } from '../ETable';

export default class MigrationUtil {
  public static getUUIDAndDatesColumns(): TableColumnOptions[] {
    const columns: TableColumnOptions[] = [];
    columns.push({
      name: 'uuid',
      type: 'uuid',
      isPrimary: true,
      isNullable: false,
      isGenerated: true,
      default: 'uuid_generate_v4()',
    });

    columns.push({
      name: 'created_at',
      type: 'timestamp',
      isPrimary: false,
      isNullable: false,
      default: 'now()',
    });

    columns.push({
      name: 'updated_at',
      type: 'timestamp',
      isPrimary: false,
      isNullable: false,
      default: 'now()',
    });
    return columns;
  }

  public static getIDAndDatesColumns(): TableColumnOptions[] {
    const columns: TableColumnOptions[] = [];

    columns.push({
      name: 'id',
      type: 'integer',
      isPrimary: true,
      isNullable: false,
      isGenerated: true,
      generationStrategy: 'increment',
    });

    columns.push({
      name: 'created_at',
      type: 'timestamp',
      isPrimary: false,
      isNullable: false,
      default: 'now()',
    });

    columns.push({
      name: 'updated_at',
      type: 'timestamp',
      isPrimary: false,
      isNullable: false,
      default: 'now()',
    });

    return columns;
  }

  public static getVarCharColumn({
    name,
    length = 255,
    isPrimary = false,
    isNullable = true,
    isUnique = false,
    defaultValue = null,
    isArray = false,
    isVariableLength = false,
  }): TableColumnOptions {
    return {
      name,
      length: isVariableLength ? null : String(length),
      isPrimary,
      isNullable,
      isUnique,
      isArray,
      default: defaultValue ? `'${defaultValue}'` : defaultValue,
      type: 'varchar',
    };
  }

  public static getBooleanColumn({
    name,
    isPrimary = false,
    isNullable = false,
    isUnique = false,
    defaultValue = false,
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      isPrimary,
      isNullable,
      isUnique,
      isArray,
      default: defaultValue,
      type: 'boolean',
    };
  }

  public static getDateColumn({
    name,
    isPrimary = false,
    isNullable = false,
    isUnique = false,
    defaultValue = 'now()',
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      isPrimary,
      isNullable,
      isUnique,
      isArray,
      default: defaultValue,
      type: 'timestamp',
    };
  }

  public static getJSONBColumn({
    name,
    isPrimary = false,
    isNullable = false,
    isUnique = false,
    defaultValue = '{}',
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      isPrimary,
      isNullable,
      isUnique,
      isArray,
      default: `'${defaultValue}'`,
      type: 'jsonb',
    };
  }

  public static getIntegerColumn({
    name,
    type = 'int',
    defaultValue = 0,
    isNullable = false,
    isUnique = false,
    isPrimary = false,
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      type,
      isUnique,
      isPrimary,
      isArray,
      default: isArray ? null : defaultValue,
      isNullable,
    };
  }

  public static getBigIntegerColumn({
    name,
    type = 'bigint',
    defaultValue = 0,
    isNullable = false,
    isUnique = false,
    isPrimary = false,
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      type,
      isUnique,
      isPrimary,
      isArray,
      default: isArray ? null : defaultValue,
      isNullable,
    };
  }

  public static getUUIDColumn({
    name,
    isPrimary = false,
    isNullable = true,
    isUnique = false,
  }): TableColumnOptions {
    return {
      name,
      type: 'uuid',
      isPrimary,
      isNullable,
      default: isNullable ? null : 'uuid_generate_v4()',
      isUnique,
    };
  }

  public static getRealColumn({
    name,
    type = 'real',
    defaultValue = 0.0,
    isNullable = false,
    isUnique = false,
    isPrimary = false,
    isArray = false,
  }): TableColumnOptions {
    return {
      name,
      type,
      isUnique,
      isPrimary,
      isArray,
      default: defaultValue,
      isNullable,
    };
  }

  public static createTableIndex({
    tableName,
    columnNames,
    isUnique = false,
    indexName = '',
  }: {
    tableName: ETable;
    columnNames: string[];
    isUnique?: boolean;
    indexName?: string;
  }): TableIndex {
    indexName = indexName || `${tableName}_${columnNames.join('_')}_idx`;

    return new TableIndex({
      name: indexName,
      isUnique,
      columnNames,
    });
  }

  public static createBtreeIndex(tableName: ETable, index: TableIndex): string {
    return `CREATE INDEX ${
      index.name
    } ON ${tableName} using btree (${index.columnNames.join(',')})`;
  }

  public static createGINIndex(tableName: ETable, index: TableIndex): string {
    return `CREATE INDEX ${
      index.name
    } ON ${tableName} using GIN (${index.columnNames.join(' , ')})`;
  }

  public static dropIndex(index: TableIndex): string {
    return `DROP INDEX ${index.name}`;
  }
}
