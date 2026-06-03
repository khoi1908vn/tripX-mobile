import type { SQLiteDatabase } from 'expo-sqlite';

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTripInput {
  id: string;
  name: string;
  start_date: string;
  end_date?: string | null;
}

export interface UpdateTripInput {
  name?: string;
  start_date?: string;
  end_date?: string | null;
}

export class TripRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(input: CreateTripInput): Promise<Trip> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT INTO trips (id, name, start_date, end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      input.id,
      input.name,
      input.start_date,
      input.end_date ?? null,
      now,
      now
    );

    const trip = await this.findById(input.id);
    if (!trip) {
      throw new Error('Failed to create trip');
    }
    return trip;
  }

  async findById(id: string): Promise<Trip | null> {
    return await this.db.getFirstAsync<Trip>(
      'SELECT * FROM trips WHERE id = ?',
      id
    );
  }

  async findAll(): Promise<Trip[]> {
    return await this.db.getAllAsync<Trip>(
      'SELECT * FROM trips ORDER BY start_date DESC'
    );
  }

  async update(id: string, input: UpdateTripInput): Promise<Trip> {
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(input.start_date);
    }
    if (input.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(input.end_date);
    }

    if (updates.length === 0) {
      const trip = await this.findById(id);
      if (!trip) {
        throw new Error('Trip not found');
      }
      return trip;
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await this.db.runAsync(
      `UPDATE trips SET ${updates.join(', ')} WHERE id = ?`,
      ...values
    );

    const trip = await this.findById(id);
    if (!trip) {
      throw new Error('Trip not found after update');
    }
    return trip;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM trips WHERE id = ?', id);
  }
}
