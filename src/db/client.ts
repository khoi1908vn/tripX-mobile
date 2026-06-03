import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Opens and initializes the SQLite database with required pragmas
 */
export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync('tripx.db');

  // Enable WAL mode for better concurrency
  await db.execAsync('PRAGMA journal_mode = WAL');

  // Enable foreign key constraints
  await db.execAsync('PRAGMA foreign_keys = ON');

  dbInstance = db;
  return db;
}

/**
 * Gets the current database instance (must call openDatabase first)
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call openDatabase() first.');
  }
  return dbInstance;
}

/**
 * Closes the database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}
