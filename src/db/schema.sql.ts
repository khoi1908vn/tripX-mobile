/**
 * SQLite schema DDL strings for TripX database
 */

export const CREATE_TRIPS_TABLE = `
CREATE TABLE IF NOT EXISTS trips (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

export const CREATE_PARTICIPANTS_TABLE = `
CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
`;

export const CREATE_EXPENSES_TABLE = `
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  paid_by TEXT NOT NULL,
  paid_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES participants(id) ON DELETE RESTRICT
);
`;

export const CREATE_EXPENSE_SPLITS_TABLE = `
CREATE TABLE IF NOT EXISTS expense_splits (
  id TEXT PRIMARY KEY NOT NULL,
  expense_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  share_amount REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE RESTRICT
);
`;

export const CREATE_SPONSORS_TABLE = `
CREATE TABLE IF NOT EXISTS sponsors (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  contribution_amount REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
`;

export const CREATE_TRIP_SNAPSHOTS_TABLE = `
CREATE TABLE IF NOT EXISTS trip_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  trip_id TEXT NOT NULL,
  snapshot_data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);
`;

export const CREATE_INDEXES = `
CREATE INDEX IF NOT EXISTS idx_participants_trip_id ON participants(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_participant_id ON expense_splits(participant_id);
CREATE INDEX IF NOT EXISTS idx_sponsors_trip_id ON sponsors(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_snapshots_trip_id ON trip_snapshots(trip_id);
`;

export const ALL_TABLES = [
  CREATE_TRIPS_TABLE,
  CREATE_PARTICIPANTS_TABLE,
  CREATE_EXPENSES_TABLE,
  CREATE_EXPENSE_SPLITS_TABLE,
  CREATE_SPONSORS_TABLE,
  CREATE_TRIP_SNAPSHOTS_TABLE,
  CREATE_INDEXES,
];
