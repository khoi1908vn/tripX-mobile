import type { SQLiteDatabase } from 'expo-sqlite';

export interface TripSnapshot {
  id: string;
  trip_id: string;
  snapshot_data: string;
  created_at: string;
}

export interface CreateSnapshotInput {
  id: string;
  trip_id: string;
  snapshot_data: object;
}

export class TripSnapshotRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(input: CreateSnapshotInput): Promise<TripSnapshot> {
    const now = new Date().toISOString();
    const snapshotJson = JSON.stringify(input.snapshot_data);

    await this.db.withTransactionAsync(async () => {
      await this.db.runAsync(
        `INSERT INTO trip_snapshots (id, trip_id, snapshot_data, created_at)
         VALUES (?, ?, ?, ?)`,
        input.id,
        input.trip_id,
        snapshotJson,
        now
      );
    });

    const snapshot = await this.findById(input.id);
    if (!snapshot) {
      throw new Error('Failed to create snapshot');
    }
    return snapshot;
  }

  async findById(id: string): Promise<TripSnapshot | null> {
    return await this.db.getFirstAsync<TripSnapshot>(
      'SELECT * FROM trip_snapshots WHERE id = ?',
      id
    );
  }

  async findByTripId(tripId: string): Promise<TripSnapshot[]> {
    return await this.db.getAllAsync<TripSnapshot>(
      'SELECT * FROM trip_snapshots WHERE trip_id = ? ORDER BY created_at DESC',
      tripId
    );
  }

  async findLatestByTripId(tripId: string): Promise<TripSnapshot | null> {
    return await this.db.getFirstAsync<TripSnapshot>(
      'SELECT * FROM trip_snapshots WHERE trip_id = ? ORDER BY created_at DESC LIMIT 1',
      tripId
    );
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM trip_snapshots WHERE id = ?', id);
  }

  async deleteByTripId(tripId: string): Promise<void> {
    await this.db.runAsync('DELETE FROM trip_snapshots WHERE trip_id = ?', tripId);
  }
}
