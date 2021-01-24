import Knex from 'knex';
import { Module } from '../models/Module';
import { toCamel } from './toCamel';

export const getModules = async (database: Knex): Promise<Module[]> => {
  const modules = await database.raw(`
    WITH _dependencies AS (
    SELECT parent.referencing_id
         , parent.referenced_id
         , 1 AS depth
      FROM sys.sql_expression_dependencies parent
     INNER JOIN sys.objects obj ON obj.object_id = parent.referenced_id
     WHERE obj.type IN ('FN', 'V', 'P', 'TR')
     UNION ALL
    SELECT parent.referencing_id
         , child.referenced_id
         , child.depth + 1 AS depth
      FROM _dependencies child
     INNER JOIN sys.sql_expression_dependencies parent ON parent.referenced_id = child.referencing_id
     INNER JOIN sys.objects obj ON obj.object_id = child.referenced_id
     WHERE obj.type IN ('FN', 'V', 'P', 'TR')
       AND child.depth < 100
    )
    SELECT obj.name AS module
         , m.definition
      FROM sys.sql_modules m
     INNER JOIN sys.objects obj ON obj.object_id = m.object_id
      LEFT OUTER JOIN (SELECT referencing_id, COUNT(*) AS quantity_of_references FROM _dependencies GROUP BY referencing_id) Z ON Z.referencing_id = obj.object_id
     WHERE obj.is_ms_shipped = 0
     ORDER BY z.quantity_of_references ASC, obj.create_date ASC
  `);

  return modules.map(toCamel) as any[];
};
