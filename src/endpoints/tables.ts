import Knex from 'knex';
import { endpointWrapper } from '../functions/endpointWrapper';
import { getCreateTable } from '../functions/getCreateTable';
import { getTableName } from '../functions/getTableName';
import { getTables } from '../functions/getTables';
import { Table } from '../models/Table';
import fs from 'fs';
import path from 'path';
import { CSV_FOLDER } from '../functions/constants';
import iconv from 'iconv-lite';
import { toCsv } from '../functions/toCsv';
import { Column } from '../models/Column';

const getMissingTables = async (origin: Knex, target: Knex) => {
  const originTables = await getTables(origin);
  const targetTables = await getTables(target);

  const targetTableNames = targetTables.map(getTableName);

  return originTables.filter(
    (table) => !targetTableNames.includes(getTableName(table)),
  );
};

export const postTables = endpointWrapper(async (req, res, origin, target) => {
  const tables = await getMissingTables(origin, target);

  const createTables = tables.map(getCreateTable);

  for (const createTable of createTables) {
    await target.raw(createTable);
  }

  res.status(200).json(tables);
});

const checkIfMissingRows = async (
  tableName: string,
  origin: Knex,
  target: Knex,
) => {
  const { rows: originCount } = (await origin
    .from(tableName)
    .count('* AS rows')
    .first()) as any;
  const { rows: targetCount } = (await target
    .from(tableName)
    .count('* AS rows')
    .first()) as any;

  if (originCount !== targetCount) {
    if (targetCount > 0) {
      await target.from(tableName).delete();
    }

    return true;
  }

  return false;
};

const createCsvFolder = async () =>
  fs.promises.mkdir(CSV_FOLDER, { recursive: true });

const writeCsv = async (table: Table, rows: any[]) => {
  const filename = path.join(CSV_FOLDER, getTableName(table) + '.csv');

  const csv = await toCsv(rows);

  await fs.promises.writeFile(filename, iconv.encode(csv, 'win1252'));
};

const bulkInsert = async (table: Table, target: Knex) => {
  await target.raw(`
    BULK INSERT ${getTableName(table)}
    FROM '${CSV_FOLDER}/${getTableName(table)}.csv'
    WITH (
      FORMAT = 'CSV',
      FIRSTROW = 1,
      FIELDTERMINATOR = ',',
      KEEPNULLS,
      KEEPIDENTITY,
      MAXERRORS = 0,
      CODEPAGE = 'RAW'
    );  
  `);
};

const getSelectColumn = (column: Column, origin: Knex) => {
  if (column.type === 'image') {
    return origin.raw(`NULL AS [${column.column}]`);
  }

  if (column.type === 'bit') {
    return origin.raw(`CAST ([${column.column}] AS INT) AS [${column.column}]`);
  }

  return `[${column.column}] AS [${column.column}]`;
};

const getSelectColumns = (columns: Column[], origin: Knex) =>
  [...columns]
    .sort((a, b) => a.columnId - b.columnId)
    .map((column) => getSelectColumn(column, origin));

const bulkInsertTable = async (table: Table, origin: Knex, target: Knex) => {
  const { rows: count } = (await origin
    .from(getTableName(table))
    .count('* AS rows')
    .first()) as any;

  let offset = 0;
  const limit = 5000;

  while (offset < count) {
    const primaryKeyColumns = table.columns
      .filter((column) => column.isPrimaryKey)
      .sort((a, b) => (a.primaryKeyId || 0) - (b.primaryKeyId || 0))
      .map(({ column }) => column);

    const sortableColumns = table.columns
      .filter((column) => !['text', 'ntext', 'image'].includes(column.type))
      .map(({ column }) => column);

    const originData = await origin
      .from(getTableName(table))
      .select(getSelectColumns(table.columns, origin))
      .limit(limit)
      .offset(offset)
      .orderBy(
        primaryKeyColumns.length > 0 ? primaryKeyColumns : sortableColumns,
      );

    if (!originData.length) {
      return false;
    }

    await writeCsv(table, originData);

    await bulkInsert(table, target);

    offset += limit;
  }

  return true;
};

export const postTablesBulkInsert = endpointWrapper(
  async (req, res, origin, target) => {
    const tables = await getTables(origin);

    const tableNames = [];

    await createCsvFolder();

    for (const table of tables) {
      const isMissing = await checkIfMissingRows(
        getTableName(table),
        origin,
        target,
      );

      if (isMissing) {
        const hasInserted = await bulkInsertTable(table, origin, target);

        if (hasInserted) {
          tableNames.push(getTableName(table));
        }
      }
    }

    res.status(200).json(tableNames);
  },
);
