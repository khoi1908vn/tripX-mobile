import type { SQLiteDatabase } from 'expo-sqlite';
import { ALL_TABLES } from './schema.sql';

const DATABASE_VERSION = 1;

/**
 * Runs database migrations based on user_version
 */
export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  let currentVersion = result?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  // Migration from version 0 to 1: Create initial schema
  if (currentVersion === 0) {
    for (const statement of ALL_TABLES) {
      await db.execAsync(statement);
    }
    currentVersion = 1;
  }

  // Future migrations can be added here:
  // if (currentVersion === 1) {
  //   await db.execAsync('ALTER TABLE ...');
  //   currentVersion = 2;
  // }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

/**
 * Gets the current database version
 */
export async function getDatabaseVersion(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );
  return result?.user_version ?? 0;
}
