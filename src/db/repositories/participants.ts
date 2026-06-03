import type { SQLiteDatabase } from 'expo-sqlite';

export interface Participant {
  id: string;
  trip_id: string;
  name: string;
  created_at: string;
}

export interface CreateParticipantInput {
  id: string;
  trip_id: string;
  name: string;
}

export interface UpdateParticipantInput {
  name?: string;
}

export class ParticipantRepository {
  constructor(private db: SQLiteDatabase) {}

  async create(input: CreateParticipantInput): Promise<Participant> {
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT INTO participants (id, trip_id, name, created_at)
       VALUES (?, ?, ?, ?)`,
      input.id,
      input.trip_id,
      input.name,
      now
    );

    const participant = await this.findById(input.id);
    if (!participant) {
      throw new Error('Failed to create participant');
    }
    return participant;
  }

  async findById(id: string): Promise<Participant | null> {
    return await this.db.getFirstAsync<Participant>(
      'SELECT * FROM participants WHERE id = ?',
      id
    );
  }

  async findByTripId(tripId: string): Promise<Participant[]> {
    return await this.db.getAllAsync<Participant>(
      'SELECT * FROM participants WHERE trip_id = ? ORDER BY name',
      tripId
    );
  }

  async update(id: string, input: UpdateParticipantInput): Promise<Participant> {
    if (input.name !== undefined) {
      await this.db.runAsync(
        'UPDATE participants SET name = ? WHERE id = ?',
        input.name,
        id
      );
    }

    const participant = await this.findById(id);
    if (!participant) {
      throw new Error('Participant not found after update');
    }
    return participant;
  }

  async delete(id: string): Promise<void> {
    await this.db.runAsync('DELETE FROM participants WHERE id = ?', id);
  }
}
