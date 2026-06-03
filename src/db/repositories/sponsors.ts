import type { SQLiteDatabase } from 'expo-sqlite';

export interface Sponsor {
  id: string;
  trip_id: string;
  name: string;
  contribution_amount: number;
  created_at: string;
}

export interface CreateSponsorInput {
  id: string;
  trip_id: string;
  name: string;
  contribution_amount?: number;
}

export interface UpdateSponsorInput {
  name?: string;
  contribution_amount?: number;
}

export class SponsorRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(input: CreateSponsorInput): Promise<Sponsor> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT INTO sponsors (id, trip_id, name, contribution_amount, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      input.id,
      input.trip_id,
      input.name,
      input.contribution_amount ?? 0,
      now
    );

    const sponsor = await this.findById(input.id);
    if (!sponsor) {
      throw new Error('Failed to create sponsor');
    }
    return sponsor;
  }

  async findById(id: string): Promise<Sponsor | null> {
    return await this.db.getFirstAsync<Sponsor>(
      'SELECT * FROM sponsors WHERE id = ?',
      id
    );
  }

  async findByTripId(tripId: string): Promise<Sponsor[]> {
    return await this.db.getAllAsync<Sponsor>(
      'SELECT * FROM sponsors WHERE trip_id = ? ORDER BY name',
      tripId
    );
  }

  async update(id: string, input: UpdateSponsorInput): Promise<Sponsor> {
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.contribution_amount !== undefined) {
      updates.push('contribution_amount = ?');
      values.push(input.contribution_amount);
    }

    if (updates.length === 0) {
      const sponsor = await this.findById(id);
      if (!sponsor) {
        throw new Error('Sponsor not found');
      }
      return sponsor;
    }

    values.push(id);

    await this.db.runAsync(
      `UPDATE sponsors SET ${updates.join(', ')} WHERE id = ?`,
      ...values
    );

    const sponsor = await this.findById(id);
    if (!sponsor) {
      throw new Error('Sponsor not found after update');
    }
    return sponsor;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM sponsors WHERE id = ?', id);
  }
}
