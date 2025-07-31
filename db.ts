import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

interface FoodItemTable {
  id: number;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
}

interface DB {
  food_items: FoodItemTable;
}

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: 'tanu',
      user: 'tanu',
      host: 'localhost',
      port: 5432,
    }),
  }),
});